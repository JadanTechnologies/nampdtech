
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { UserRole, MembershipStatus } from '../types';
import { CheckCircle, AlertCircle, CreditCard } from 'lucide-react';

export const Payments: React.FC = () => {
  const { user } = useAuth();
  const { payments, processPayment, members } = useData();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user) return null;

  const handlePay = (amount: number, type: 'REGISTRATION' | 'ANNUAL_DUES' | 'RENEWAL') => {
    if (!window.confirm(`Proceed to pay ₦${amount.toLocaleString()} for ${type.replace('_', ' ')}?`)) return;
    
    setIsProcessing(true);
    // Simulate network delay for payment gateway
    setTimeout(() => {
      processPayment(amount, type);
      setIsProcessing(false);
      alert('Payment Successful!');
    }, 1500);
  };

  // --- MEMBER VIEW ---
  if (user.role === UserRole.MEMBER) {
    const myPayments = payments.filter(p => p.userId === user.id);
    const hasRegistration = myPayments.some(p => p.type === 'REGISTRATION');
    const hasAnnual = myPayments.some(p => p.type === 'ANNUAL_DUES');

    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">My Payments</h1>

        {/* Payment Actions */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Registration Fee</h3>
              <span className="text-2xl font-bold text-gray-900">₦5,000</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">One-time onboarding fee for new members.</p>
            <div className="mt-4">
              {user.status === MembershipStatus.PENDING_PAYMENT && !hasRegistration ? (
                <button 
                  onClick={() => handlePay(5000, 'REGISTRATION')}
                  disabled={isProcessing}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Pay Now'}
                </button>
              ) : hasRegistration ? (
                <span className="flex items-center text-green-600 font-medium">
                  <CheckCircle className="w-5 h-5 mr-2" /> Paid
                </span>
              ) : (
                <span className="flex items-center text-yellow-600 font-medium text-sm">
                  <AlertCircle className="w-5 h-5 mr-2" /> Available after admin approval
                </span>
              )}
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Annual Dues</h3>
              <span className="text-2xl font-bold text-gray-900">₦10,000</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">Valid for 12 months from date of payment.</p>
            <div className="mt-4">
              {user.status === MembershipStatus.ACTIVE || (user.status === MembershipStatus.PENDING_PAYMENT && hasRegistration) ? (
                <button 
                  onClick={() => handlePay(10000, 'ANNUAL_DUES')}
                  disabled={isProcessing}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                >
                   {isProcessing ? 'Processing...' : 'Pay Dues / Renew'}
                </button>
              ) : (
                <span className="text-sm text-gray-500">Complete registration first.</span>
              )}
            </div>
          </div>
        </div>

        {/* History */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Payment History</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {myPayments.length === 0 ? (
                <li className="px-6 py-4 text-sm text-gray-500">No payments found.</li>
              ) : (
                myPayments.map(payment => (
                  <li key={payment.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">{payment.type.replace('_', ' ')}</p>
                      <p className="text-sm text-gray-500">{payment.date} • {payment.reference}</p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Success
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // --- ADMIN VIEW ---
  let filteredPayments = payments;
  if (user.role === UserRole.STATE_ADMIN || user.role === UserRole.CHAIRMAN) {
    filteredPayments = payments.filter(p => p.userState === user.state);
  }

  return (
    <div className="space-y-6">
       <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>

       <div className="bg-white shadow rounded-lg p-6">
         <div className="flex items-center">
           <div className="p-3 rounded-full bg-green-100 text-green-600">
             <CreditCard className="h-8 w-8" />
           </div>
           <div className="ml-5">
             <p className="text-sm font-medium text-gray-500 truncate">Total Revenue Collected</p>
             <p className="text-3xl font-bold text-gray-900">
               ₦{filteredPayments.reduce((acc, p) => acc + p.amount, 0).toLocaleString()}
             </p>
           </div>
         </div>
       </div>

       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Transaction Log</h3>
          <span className="text-sm text-gray-500">Showing all transactions</span>
        </div>
        <div className="border-t border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map(payment => {
                const member = members.find(m => m.id === payment.userId);
                return (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member?.fullName || 'Unknown'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.userState}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₦{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.reference}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
