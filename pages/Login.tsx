
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('member@gmail.com');
  const { login } = useAuth();
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, ''); // Role handled by mock lookup
    history.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">NAMPDTech Portal</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          National Mobile Phone & Accessories Dealers & Technicians
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value="password" // Mocked
                  readOnly
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
                />
              </div>
            </div>

            <div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or register</span></div>
            </div>
            <div className="mt-6 grid grid-cols-1">
              <button onClick={() => history.push('/register')} className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Create new account
              </button>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded border">
            <p className="font-bold">Demo Credentials:</p>
            <div className="grid grid-cols-1 gap-1 mt-1">
              <button onClick={() => setEmail('super@nampd.com')} className="text-left hover:text-indigo-600">super@nampd.com (Super Admin)</button>
              <button onClick={() => setEmail('lagos.admin@nampd.com')} className="text-left hover:text-indigo-600">lagos.admin@nampd.com (State Admin)</button>
              <button onClick={() => setEmail('ikeja.chair@nampd.com')} className="text-left hover:text-indigo-600">ikeja.chair@nampd.com (Chairman)</button>
              <button onClick={() => setEmail('member@gmail.com')} className="text-left hover:text-indigo-600">member@gmail.com (Active Member)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
