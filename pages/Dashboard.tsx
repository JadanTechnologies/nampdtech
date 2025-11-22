import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { UserRole, MembershipStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, CreditCard, Clock, CheckCircle } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import * as ReactRouterDOM from 'react-router-dom';

const { Link } = ReactRouterDOM;

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getStats, members } = useData();
  const stats = getStats();

  // Member View
  if (user?.role === UserRole.MEMBER) {
    const nextStep = 
      user.status === MembershipStatus.PENDING_CHAIRMAN ? "Awaiting Chairman Verification" :
      user.status === MembershipStatus.PENDING_STATE ? "Awaiting State Admin Approval" :
      user.status === MembershipStatus.PENDING_PAYMENT ? "Action Required: Pay Dues" :
      "Your membership is Active";

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Welcome, {user.fullName}</h2>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StatusBadge status={user.status} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Current Status</dt>
                  <dd className="text-lg font-medium text-gray-900">{nextStep}</dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
             {user.status === MembershipStatus.PENDING_PAYMENT ? (
               <Link to="/payments" className="text-sm font-medium text-indigo-700 hover:text-indigo-900">Go to Payments &rarr;</Link>
             ) : user.status === MembershipStatus.ACTIVE ? (
                <Link to="/digital-id" className="text-sm font-medium text-green-700 hover:text-green-900">View ID Card &rarr;</Link>
             ) : (
               <span className="text-sm text-gray-500">Please wait for admin processing.</span>
             )}
          </div>
        </div>

        {user.status === MembershipStatus.ACTIVE && (
           <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="bg-white shadow rounded-lg p-6">
                 <h3 className="text-lg font-medium text-gray-900">My Details</h3>
                 <dl className="mt-2 text-sm text-gray-600">
                   <div className="mt-1">NAMPD ID: {user.nampdId}</div>
                   <div className="mt-1">Expires: {user.expiryDate}</div>
                 </dl>
              </div>
           </div>
        )}
      </div>
    );
  }

  // Admin View
  const chartData = [
    { name: 'Lagos', members: 400 },
    { name: 'Abuja', members: 300 },
    { name: 'Kano', members: 200 },
    { name: 'Rivers', members: 278 },
    { name: 'Ogun', members: 189 },
  ];

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 rounded-md p-3 ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="text-lg font-medium text-gray-900">{value}</dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard ({user?.role.replace('_', ' ')})</h2>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Members" value={stats.totalMembers} icon={Users} color="bg-indigo-500" />
        <StatCard title="Active" value={stats.activeMembers} icon={CheckCircle} color="bg-green-500" />
        <StatCard title="Pending" value={stats.pendingMembers} icon={Clock} color="bg-yellow-500" />
        <StatCard title="Revenue (₦)" value={stats.totalRevenue.toLocaleString()} icon={CreditCard} color="bg-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Member Distribution by State</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="members" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Pending Approvals</h3>
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {members.filter(m => m.status.includes('PENDING')).slice(0, 4).map(member => (
                <li key={member.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{member.fullName}</p>
                      <p className="text-sm text-gray-500 truncate">{member.businessName}</p>
                    </div>
                    <div>
                      <StatusBadge status={member.status} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <Link to="/approvals" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              View all
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};