
import { UserRole, MembershipStatus, MemberProfile, Payment } from '../types';

export const MOCK_STATES = ['Lagos', 'Abuja', 'Kano', 'Rivers', 'Ogun', 'Enugu', 'Kaduna'];

export const MOCK_USERS: MemberProfile[] = [
  {
    id: 'u1',
    email: 'super@nampd.com',
    fullName: 'Chief HQ Admin',
    role: UserRole.SUPER_ADMIN,
    state: 'National',
    businessName: 'HQ Operations',
    businessAddress: 'Abuja HQ',
    phone: '08011111111',
    ninNumber: '12345678901',
    registrationDate: '2023-01-01',
    status: MembershipStatus.ACTIVE,
    documents: { ninUrl: '', passportUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', businessUrl: '' },
    nampdId: 'NAM-HQ-001'
  },
  {
    id: 'u2',
    email: 'lagos.admin@nampd.com',
    fullName: 'Lagos State Admin',
    role: UserRole.STATE_ADMIN,
    state: 'Lagos',
    businessName: 'Lagos Secretariat',
    businessAddress: 'Ikeja, Lagos',
    phone: '08022222222',
    ninNumber: '22345678902',
    registrationDate: '2023-02-01',
    status: MembershipStatus.ACTIVE,
    documents: { ninUrl: '', passportUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', businessUrl: '' },
    nampdId: 'NAM-LA-ADM-001'
  },
  {
    id: 'u3',
    email: 'ikeja.chair@nampd.com',
    fullName: 'Ikeja Chairman',
    role: UserRole.CHAIRMAN,
    state: 'Lagos',
    businessName: 'Computer Village Rep',
    businessAddress: 'Computer Village, Ikeja',
    phone: '08033333333',
    ninNumber: '32345678903',
    registrationDate: '2023-03-01',
    status: MembershipStatus.ACTIVE,
    documents: { ninUrl: '', passportUrl: 'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', businessUrl: '' },
    nampdId: 'NAM-LA-CHR-001'
  },
  {
    id: 'u4',
    email: 'member@gmail.com',
    fullName: 'John Technician',
    role: UserRole.MEMBER,
    state: 'Lagos',
    businessName: 'John Fix It',
    businessAddress: '12 Otigba St, Ikeja',
    phone: '08044444444',
    ninNumber: '42345678904',
    registrationDate: '2024-01-15',
    status: MembershipStatus.ACTIVE,
    documents: { ninUrl: '#', passportUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', businessUrl: '#' },
    nampdId: 'NAM-LA-00542',
    expiryDate: '2025-01-15'
  },
  {
    id: 'u5',
    email: 'pending.chair@gmail.com',
    fullName: 'Sarah Dealer',
    role: UserRole.MEMBER,
    state: 'Lagos',
    businessName: 'Sarah Accessories',
    businessAddress: 'Surulere, Lagos',
    phone: '08055555555',
    ninNumber: '52345678905',
    registrationDate: '2024-05-20',
    status: MembershipStatus.PENDING_CHAIRMAN,
    documents: { ninUrl: '#', passportUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', businessUrl: '#' }
  },
  {
    id: 'u6',
    email: 'pending.state@gmail.com',
    fullName: 'Mike Engineer',
    role: UserRole.MEMBER,
    state: 'Lagos',
    businessName: 'Mike Engineering',
    businessAddress: 'Yaba, Lagos',
    phone: '08066666666',
    ninNumber: '62345678906',
    registrationDate: '2024-05-22',
    status: MembershipStatus.PENDING_STATE,
    documents: { ninUrl: '#', passportUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', businessUrl: '#' }
  },
  {
    id: 'u7',
    email: 'pending.payment@gmail.com',
    fullName: 'Lisa Mobile',
    role: UserRole.MEMBER,
    state: 'Lagos',
    businessName: 'Lisa Global',
    businessAddress: 'Lekki, Lagos',
    phone: '08077777777',
    ninNumber: '72345678907',
    registrationDate: '2024-05-25',
    status: MembershipStatus.PENDING_PAYMENT,
    documents: { ninUrl: '#', passportUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', businessUrl: '#' }
  }
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'p1',
    userId: 'u4',
    userState: 'Lagos',
    amount: 5000,
    type: 'REGISTRATION',
    status: 'SUCCESS',
    date: '2024-01-15',
    reference: 'REF-12345'
  },
  {
    id: 'p2',
    userId: 'u4',
    userState: 'Lagos',
    amount: 10000,
    type: 'ANNUAL_DUES',
    status: 'SUCCESS',
    date: '2024-01-15',
    reference: 'REF-12346'
  },
  {
    id: 'p3',
    userId: 'u2',
    userState: 'Lagos',
    amount: 10000,
    type: 'ANNUAL_DUES',
    status: 'SUCCESS',
    date: '2024-02-01',
    reference: 'REF-99887'
  }
];
