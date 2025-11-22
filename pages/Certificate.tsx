
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MembershipStatus } from '../types';
import { Printer, AlertTriangle } from 'lucide-react';

export const Certificate: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.status !== MembershipStatus.ACTIVE) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-6 bg-white rounded-lg shadow">
        <div className="p-4 bg-yellow-100 rounded-full mb-4">
          <AlertTriangle className="w-12 h-12 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificate Unavailable</h2>
        <p className="text-gray-600 max-w-md">
          Your membership is not currently active. Please complete all verification steps and payments to generate your certificate.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8 pb-20">
      <div className="w-full flex justify-between items-center no-print">
        <h1 className="text-2xl font-bold text-gray-900">Membership Certificate</h1>
        <button 
          onClick={() => window.print()}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 shadow-sm"
        >
          <Printer className="w-4 h-4 mr-2" /> Print / Download PDF
        </button>
      </div>

      {/* Certificate Area */}
      <div className="printable-area bg-white w-full max-w-[1123px] aspect-[1.414] shadow-2xl relative text-center text-gray-900 p-12 border-[20px] border-double border-gray-800 mx-auto">
        
        {/* Watermark/Background Design */}
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center overflow-hidden">
           <span className="text-[200px] font-bold rotate-45 transform text-gray-900">NAMPD</span>
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between border border-gray-300 p-8">
          
          {/* Header */}
          <div className="space-y-4">
            <div className="text-5xl font-serif font-bold tracking-wider uppercase text-indigo-900">NAMPDTech</div>
            <div className="text-xl uppercase tracking-[0.2em] text-gray-600">National Mobile Phone & Accessories Dealers & Technicians</div>
            <div className="w-24 h-1 bg-indigo-900 mx-auto mt-4"></div>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col justify-center space-y-8 py-10">
            <p className="text-2xl font-serif italic text-gray-600">This is to certify that</p>
            
            <div className="text-4xl font-bold border-b-2 border-gray-900 pb-2 inline-block mx-auto min-w-[400px]">
              {user.fullName}
            </div>

            <p className="text-xl text-gray-600">
              Has successfully fulfilled all requirements and is hereby recognized as a
            </p>

            <div className="text-3xl font-bold text-indigo-800 uppercase tracking-widest">
              Verified Member
            </div>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Of the National Mobile Phone & Accessories Dealers & Technicians, {user.state} State Chapter.
            </p>
          </div>

          {/* Footer Details */}
          <div className="grid grid-cols-3 gap-8 items-end mt-auto pt-12">
             <div className="text-center">
               <div className="border-t border-gray-600 pt-2 text-lg font-serif">State Chairman</div>
               <div className="h-12 font-script text-2xl text-indigo-600 flex items-center justify-center">Signed</div>
             </div>

             <div className="text-center space-y-2">
                <div className="w-24 h-24 bg-gray-100 mx-auto border border-gray-300 flex items-center justify-center">
                   {/* Simulated QR Code */}
                   <div className="w-20 h-20 bg-gray-900 grid grid-cols-4 gap-0.5 p-1">
                      {[...Array(16)].map((_,i) => <div key={i} className={`bg-white ${Math.random() > 0.5 ? 'opacity-0' : 'opacity-100'}`}></div>)}
                   </div>
                </div>
                <div className="text-xs font-mono text-gray-500">ID: {user.nampdId}</div>
                <div className="text-xs font-mono text-gray-500">EXP: {user.expiryDate}</div>
             </div>

             <div className="text-center">
               <div className="border-t border-gray-600 pt-2 text-lg font-serif">National President</div>
               <div className="h-12 font-script text-2xl text-indigo-600 flex items-center justify-center">Signed</div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};
