
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Save, User } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { updateProfile } = useData();
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for form
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    phone: user?.phone || '',
    businessName: user?.businessName || '',
    businessAddress: user?.businessAddress || '',
  });

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setIsEditing(false);
    alert('Profile Updated!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="text-indigo-600 hover:text-indigo-900 font-medium">
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center space-x-4">
           <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {user.documents.passportUrl ? (
                <img src={user.documents.passportUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-gray-500" />
              )}
           </div>
           <div>
             <h3 className="text-lg leading-6 font-medium text-gray-900">{user.fullName}</h3>
             <p className="mt-1 max-w-2xl text-sm text-gray-500">{user.role.replace('_', ' ')} • {user.state}</p>
           </div>
        </div>

        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
               <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.fullName} 
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input 
                      type="tel" 
                      required 
                      value={formData.phone} 
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Business Name</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.businessName} 
                      onChange={e => setFormData({...formData, businessName: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Business Address</label>
                    <input 
                      type="text" 
                      required 
                      value={formData.businessAddress} 
                      onChange={e => setFormData({...formData, businessAddress: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" 
                    />
                  </div>
               </div>
               <div className="flex space-x-4">
                 <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                   <Save className="w-4 h-4 mr-2" /> Save Changes
                 </button>
                 <button type="button" onClick={() => setIsEditing(false)} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                   Cancel
                 </button>
               </div>
            </form>
          ) : (
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Phone number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.phone}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.businessName}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Business Address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.businessAddress}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">NIN Number</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.ninNumber}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Registration Date</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.registrationDate}</dd>
              </div>
            </dl>
          )}
        </div>
      </div>
    </div>
  );
};
