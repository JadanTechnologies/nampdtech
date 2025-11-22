
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { UserRole, MembershipStatus, MemberProfile } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { Eye, Check, X, User } from 'lucide-react';

export const Approvals: React.FC = () => {
  const { user } = useAuth();
  const { members, approveMember, rejectMember } = useData();
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);

  if (!user) return null;

  // Filter logic based on role
  const pendingMembers = members.filter(m => {
    if (user.role === UserRole.CHAIRMAN) {
      return m.status === MembershipStatus.PENDING_CHAIRMAN && m.state === user.state;
    }
    if (user.role === UserRole.STATE_ADMIN) {
      return m.status === MembershipStatus.PENDING_STATE && m.state === user.state;
    }
    if (user.role === UserRole.SUPER_ADMIN) {
      return m.status.includes('PENDING');
    }
    return false;
  });

  const handleApprove = (id: string) => {
    if (window.confirm('Verify this member and documents?')) {
        approveMember(id, user.role);
        setSelectedMember(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Pending Approvals</h1>
          <p className="mt-2 text-sm text-gray-700">Review registration requests requiring your verification.</p>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {pendingMembers.length === 0 ? (
            <li className="px-6 py-10 text-center flex flex-col items-center text-gray-500">
               <div className="bg-green-50 p-3 rounded-full mb-3">
                 <Check className="w-6 h-6 text-green-600" />
               </div>
               <p>All caught up! No pending approvals found.</p>
            </li>
          ) : (
            pendingMembers.map((member) => (
              <li key={member.id} className="bg-white px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                         {member.documents.passportUrl ? (
                             <img src={member.documents.passportUrl} alt="" className="h-full w-full object-cover" />
                         ) : <User className="h-8 w-8 m-2 text-gray-400" />}
                    </div>
                    <div>
                        <div className="flex items-center">
                            <p className="text-sm font-medium text-indigo-600 truncate">{member.fullName}</p>
                            <div className="ml-2"><StatusBadge status={member.status} /></div>
                        </div>
                        <p className="text-sm text-gray-500">{member.businessName} • {member.state}</p>
                        <p className="text-xs text-gray-400">NIN: {member.ninNumber}</p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex space-x-2">
                     <button 
                       onClick={() => setSelectedMember(member)}
                       className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                     >
                       <Eye className="w-3 h-3 mr-1" /> Review
                     </button>
                     <button 
                       onClick={() => handleApprove(member.id)}
                       className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 shadow-sm"
                     >
                       Approve
                     </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Verification Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedMember(null)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Verify Member: {selectedMember.fullName}</h3>
                    
                    <div className="mt-4 space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-xs font-medium text-gray-500">NIN Number</label>
                             <p className="text-sm font-bold">{selectedMember.ninNumber}</p>
                          </div>
                          <div>
                             <label className="block text-xs font-medium text-gray-500">Business Address</label>
                             <p className="text-sm">{selectedMember.businessAddress}</p>
                          </div>
                       </div>

                       <div className="border-t border-gray-200 pt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</p>
                          <div className="grid grid-cols-2 gap-2">
                             <div className="aspect-w-3 aspect-h-2 bg-gray-100 rounded flex items-center justify-center border border-dashed border-gray-300 text-xs text-gray-500">
                                Passport Photo
                             </div>
                             <div className="aspect-w-3 aspect-h-2 bg-gray-100 rounded flex items-center justify-center border border-dashed border-gray-300 text-xs text-gray-500">
                                NIN Slip / Card
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  onClick={() => handleApprove(selectedMember.id)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Verify & Approve
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    rejectMember(selectedMember.id);
                    setSelectedMember(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-100 text-base font-medium text-red-700 hover:bg-red-200 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Reject
                </button>
                <button 
                  type="button" 
                  onClick={() => setSelectedMember(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
