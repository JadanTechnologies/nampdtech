import React, { createContext, useContext, useState, useEffect } from 'react';
import { MemberProfile, Payment, MembershipStatus, UserRole } from '../types';
import { MOCK_USERS, MOCK_PAYMENTS } from '../services/mockData';

interface DataContextType {
  members: MemberProfile[];
  payments: Payment[];
  approveMember: (memberId: string, currentRole: UserRole) => void;
  rejectMember: (memberId: string) => void;
  processPayment: (amount: number, type: 'REGISTRATION' | 'ANNUAL_DUES' | 'RENEWAL') => void;
  updateProfile: (data: Partial<MemberProfile>) => void;
  getStats: () => any;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<MemberProfile[]>(() => {
    const stored = localStorage.getItem('nampd_members');
    return stored ? JSON.parse(stored) : MOCK_USERS;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const stored = localStorage.getItem('nampd_payments');
    return stored ? JSON.parse(stored) : MOCK_PAYMENTS;
  });

  // Persist data changes
  useEffect(() => {
    localStorage.setItem('nampd_members', JSON.stringify(members));
    localStorage.setItem('nampd_payments', JSON.stringify(payments));
  }, [members, payments]);

  const approveMember = (memberId: string, currentRole: UserRole) => {
    setMembers(prev => prev.map(m => {
      if (m.id !== memberId) return m;

      // Workflow Logic
      if (currentRole === UserRole.CHAIRMAN && m.status === MembershipStatus.PENDING_CHAIRMAN) {
        return { ...m, status: MembershipStatus.PENDING_STATE };
      }
      if (currentRole === UserRole.STATE_ADMIN && m.status === MembershipStatus.PENDING_STATE) {
        return { ...m, status: MembershipStatus.PENDING_PAYMENT };
      }
      // Super admin override
      if (currentRole === UserRole.SUPER_ADMIN) {
        // Move to next logical step or straight to payment
        if (m.status === MembershipStatus.PENDING_CHAIRMAN) return { ...m, status: MembershipStatus.PENDING_STATE };
        if (m.status === MembershipStatus.PENDING_STATE) return { ...m, status: MembershipStatus.PENDING_PAYMENT };
      }
      return m;
    }));
  };

  const rejectMember = (memberId: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, status: MembershipStatus.REJECTED } : m));
  };

  const processPayment = (amount: number, type: 'REGISTRATION' | 'ANNUAL_DUES' | 'RENEWAL') => {
    const currentUser = JSON.parse(localStorage.getItem('nampd_user') || '{}');
    if (!currentUser.id) return;

    const newPayment: Payment = {
      id: `p${Date.now()}`,
      userId: currentUser.id,
      userState: currentUser.state,
      amount,
      type,
      status: 'SUCCESS',
      date: new Date().toISOString().split('T')[0],
      reference: `REF-${Math.floor(Math.random() * 1000000)}`
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update user status to ACTIVE if this was the required payment
    setMembers(prev => prev.map(m => {
      if (m.id === currentUser.id) {
        const isActivation = m.status === MembershipStatus.PENDING_PAYMENT;
        
        let updated = { ...m };
        
        if (isActivation || type === 'RENEWAL') {
          updated.status = MembershipStatus.ACTIVE;
          updated.expiryDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];
          updated.lastPaymentDate = new Date().toISOString().split('T')[0];
        }
        
        if (isActivation && !updated.nampdId) {
          // Generate ID: NAM - State Code (2 chars) - Random 5 digits
          const stateCode = m.state.substring(0, 2).toUpperCase();
          const randomNum = Math.floor(10000 + Math.random() * 90000);
          updated.nampdId = `NAM-${stateCode}-${randomNum}`;
        }

        // Update local user in AuthContext
        localStorage.setItem('nampd_user', JSON.stringify(updated));
        // Notify AuthContext
        window.dispatchEvent(new Event('user-updated'));
        return updated;
      }
      return m;
    }));
  };

  const updateProfile = (data: Partial<MemberProfile>) => {
    const currentUser = JSON.parse(localStorage.getItem('nampd_user') || '{}');
    if (!currentUser.id) return;

    setMembers(prev => prev.map(m => {
      if (m.id === currentUser.id) {
        const updated = { ...m, ...data };
        localStorage.setItem('nampd_user', JSON.stringify(updated));
        window.dispatchEvent(new Event('user-updated'));
        return updated;
      }
      return m;
    }));
  };

  const getStats = () => {
    return {
      totalMembers: members.filter(m => m.role === UserRole.MEMBER).length,
      activeMembers: members.filter(m => m.status === MembershipStatus.ACTIVE).length,
      pendingMembers: members.filter(m => m.status.includes('PENDING')).length,
      totalRevenue: payments.reduce((acc, p) => acc + p.amount, 0),
      recentPayments: payments.slice(0, 5)
    };
  };

  return (
    <DataContext.Provider value={{ members, payments, approveMember, rejectMember, processPayment, updateProfile, getStats }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};