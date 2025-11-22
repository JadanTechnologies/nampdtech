
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  STATE_ADMIN = 'STATE_ADMIN',
  CHAIRMAN = 'CHAIRMAN',
  MEMBER = 'MEMBER'
}

export enum MembershipStatus {
  PENDING_CHAIRMAN = 'PENDING_CHAIRMAN',
  PENDING_STATE = 'PENDING_STATE',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  state: string;
  avatar?: string;
}

export interface MemberProfile extends User {
  businessName: string;
  businessAddress: string;
  phone: string;
  ninNumber: string;
  registrationDate: string;
  status: MembershipStatus;
  documents: {
    ninUrl: string;
    passportUrl: string;
    businessUrl: string;
  };
  expiryDate?: string;
  nampdId?: string;
  lastPaymentDate?: string;
}

export interface Payment {
  id: string;
  userId: string;
  userState: string; // For admin filtering
  amount: number;
  type: 'REGISTRATION' | 'ANNUAL_DUES' | 'RENEWAL';
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  date: string;
  reference: string;
}

export interface StateData {
  name: string;
  adminId: string;
  chairmanId: string;
  memberCount: number;
}
