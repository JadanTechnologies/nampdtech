import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_STATES } from '../services/mockData';
import { Upload } from 'lucide-react';

export const Register: React.FC = () => {
  const { register } = useAuth();
  const history = useHistory();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    state: 'Lagos',
    businessName: '',
    businessAddress: '',
    ninNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(2);
    } else {
      register(formData);
      history.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
       <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Join NAMPDTech</h2>
        <p className="text-center text-sm text-gray-500 mt-2">Step {step} of 2</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                 <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                     <div className="sm:col-span-6">
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <input type="password" name="password" required value={formData.password} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                     <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">State</label>
                      <select name="state" value={formData.state} onChange={handleChange} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm p-2">
                        {MOCK_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                 </div>
                 <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Next: Business Info</button>
              </>
            )}

            {step === 2 && (
               <>
                 <div className="grid grid-cols-1 gap-y-6 gap-x-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Name</label>
                      <input type="text" name="businessName" required value={formData.businessName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Address</label>
                      <input type="text" name="businessAddress" required value={formData.businessAddress} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NIN Number</label>
                      <input type="text" name="ninNumber" required value={formData.ninNumber} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Document Uploads (Mock)</p>
                      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                              <span>Upload passport & NIN</span>
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                        </div>
                      </div>
                    </div>

                 </div>
                 <div className="flex space-x-4">
                   <button type="button" onClick={() => setStep(1)} className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Back</button>
                   <button type="submit" className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">Submit Application</button>
                 </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};