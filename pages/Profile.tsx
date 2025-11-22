import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Save, User, Image as ImageIcon, X, Upload, Trash2 } from 'lucide-react';

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

  // Local state for documents editing
  const [documents, setDocuments] = useState({
    ninUrl: user?.documents?.ninUrl || '',
    passportUrl: user?.documents?.passportUrl || '',
    businessUrl: user?.documents?.businessUrl || '',
  });

  if (!user) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'passport' | 'business' | 'nin') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const base64 = reader.result as string;
        if (type === 'passport') setDocuments(prev => ({ ...prev, passportUrl: base64 }));
        if (type === 'business') setDocuments(prev => ({ ...prev, businessUrl: base64 }));
        if (type === 'nin') setDocuments(prev => ({ ...prev, ninUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDocument = (type: 'passport' | 'business' | 'nin') => {
    if (type === 'passport') setDocuments(prev => ({ ...prev, passportUrl: '' }));
    if (type === 'business') setDocuments(prev => ({ ...prev, businessUrl: '' }));
    if (type === 'nin') setDocuments(prev => ({ ...prev, ninUrl: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      documents: {
        ...user.documents,
        ...documents
      }
    });
    setIsEditing(false);
  };

  const DocumentCard = ({ title, url, type }: { title: string, url: string, type: 'passport' | 'nin' | 'business' }) => (
      <div className="border border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center bg-gray-50 relative">
          <span className="text-xs font-medium text-gray-500 mb-2">{title}</span>
          {url ? (
              <div className="relative w-full aspect-video bg-gray-200 rounded overflow-hidden group">
                  <img src={url} alt={title} className="w-full h-full object-cover" />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="flex space-x-2">
                            <label className="cursor-pointer text-white text-xs flex flex-col items-center hover:text-indigo-200">
                                <Upload size={20} />
                                <span className="mt-1">Change</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, type)} />
                            </label>
                            <button 
                                type="button" 
                                onClick={() => handleRemoveDocument(type)}
                                className="text-white text-xs flex flex-col items-center hover:text-red-300"
                            >
                                <Trash2 size={20} />
                                <span className="mt-1">Remove</span>
                            </button>
                         </div>
                    </div>
                  )}
                  {isEditing && (
                      <button 
                          type="button" 
                          onClick={() => handleRemoveDocument(type)}
                          className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-md sm:hidden"
                      >
                          <X size={12} />
                      </button>
                  )}
              </div>
          ) : (
              <div className="w-full aspect-video bg-gray-200 rounded flex items-center justify-center border-2 border-dashed border-gray-300">
                   {isEditing ? (
                       <label className="cursor-pointer flex flex-col items-center text-gray-500 hover:text-indigo-600 w-full h-full justify-center">
                           <Upload size={24} />
                           <span className="text-xs mt-1">Upload</span>
                           <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, type)} />
                       </label>
                   ) : (
                       <span className="text-xs text-gray-400">No Document</span>
                   )}
              </div>
          )}
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">
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
           <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden relative group">
              {documents.passportUrl ? (
                <img src={documents.passportUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-8 w-8 text-gray-500" />
              )}
              {isEditing && (
                 <label className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                     <Upload className="text-white w-5 h-5" />
                     <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'passport')} />
                 </label>
              )}
           </div>
           <div>
             <h3 className="text-lg leading-6 font-medium text-gray-900">{formData.fullName}</h3>
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
               
               <div className="border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Uploaded Documents</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <DocumentCard title="NIN Slip" url={documents.ninUrl} type="nin" />
                      <DocumentCard title="Business Doc" url={documents.businessUrl} type="business" />
                  </div>
               </div>

               <div className="flex space-x-4 pt-4">
                 <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                   <Save className="w-4 h-4 mr-2" /> Save Changes
                 </button>
                 <button type="button" onClick={() => { setIsEditing(false); setDocuments(user.documents); setFormData({ fullName: user.fullName, phone: user.phone, businessName: user.businessName, businessAddress: user.businessAddress }); }} className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                   Cancel
                 </button>
               </div>
            </form>
          ) : (
            <div>
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
                
                <div className="bg-gray-50 px-4 py-5 sm:px-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Documents</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Passport</p>
                            {documents.passportUrl ? <img src={documents.passportUrl} className="h-20 w-20 object-cover rounded border" /> : <span className="text-xs text-gray-400">None</span>}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">NIN Slip</p>
                            {documents.ninUrl ? <img src={documents.ninUrl} className="h-20 w-auto object-cover rounded border" /> : <span className="text-xs text-gray-400">None</span>}
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Business Doc</p>
                            {documents.businessUrl ? <img src={documents.businessUrl} className="h-20 w-auto object-cover rounded border" /> : <span className="text-xs text-gray-400">None</span>}
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};