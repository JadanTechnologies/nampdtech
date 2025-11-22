
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MembershipStatus } from '../types';
import { AlertTriangle, RotateCcw, Share2 } from 'lucide-react';

export const DigitalID: React.FC = () => {
  const { user } = useAuth();
  const [isFlipped, setIsFlipped] = useState(false);

  if (!user) return null;

  if (user.status !== MembershipStatus.ACTIVE) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-center p-6 bg-white rounded-lg shadow">
        <div className="p-4 bg-yellow-100 rounded-full mb-4">
          <AlertTriangle className="w-12 h-12 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ID Card Unavailable</h2>
        <p className="text-gray-600">Membership must be active to access Digital ID.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-8 pb-20">
      <h1 className="text-2xl font-bold text-gray-900">Digital Identity Card</h1>
      
      <div className="perspective-1000 w-full max-w-md cursor-pointer group" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''} aspect-[1.586] rounded-2xl shadow-2xl`}>
          
          {/* FRONT SIDE */}
          <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-indigo-900 via-blue-800 to-indigo-900 text-white rounded-2xl overflow-hidden border border-indigo-700">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            
            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                <div className="font-bold text-lg tracking-widest">NAMPD<span className="text-blue-300">Tech</span></div>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Coat_of_arms_of_Nigeria.svg/1200px-Coat_of_arms_of_Nigeria.svg.png" alt="Nigeria" className="h-10 opacity-80" />
              </div>

              <div className="flex items-center space-x-4 mt-4">
                <div className="w-24 h-24 rounded-lg border-2 border-white/30 overflow-hidden shadow-lg bg-gray-300">
                  <img src={user.documents.passportUrl || "https://via.placeholder.com/150"} alt="Member" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight">{user.fullName}</h2>
                  <p className="text-blue-200 text-sm font-medium mt-1">{user.role === 'MEMBER' ? 'Verified Member' : user.role.replace('_', ' ')}</p>
                  <div className="mt-2 inline-flex px-2 py-0.5 rounded bg-green-500/20 text-green-300 border border-green-500/30 text-xs font-bold tracking-wide">
                    ACTIVE
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs mt-auto pt-4 border-t border-white/10">
                 <div>
                   <div className="text-blue-300 uppercase tracking-wider text-[10px]">State</div>
                   <div className="font-medium text-sm">{user.state}</div>
                 </div>
                 <div>
                   <div className="text-blue-300 uppercase tracking-wider text-[10px]">Membership ID</div>
                   <div className="font-mono font-medium text-sm">{user.nampdId}</div>
                 </div>
                 <div>
                   <div className="text-blue-300 uppercase tracking-wider text-[10px]">Expires</div>
                   <div className="font-medium text-sm">{user.expiryDate}</div>
                 </div>
                 <div>
                   <div className="text-blue-300 uppercase tracking-wider text-[10px]">Business</div>
                   <div className="font-medium text-sm truncate">{user.businessName}</div>
                 </div>
              </div>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 rotate-y-180 backface-hidden bg-white rounded-2xl overflow-hidden border border-gray-200 text-gray-800">
             <div className="h-full flex flex-col p-6 justify-center items-center text-center space-y-4">
                <div className="w-32 h-32 bg-gray-900 p-2">
                    {/* QR Code */}
                    <div className="w-full h-full bg-white grid grid-cols-6 gap-1 p-1">
                       {[...Array(36)].map((_,i) => <div key={i} className={`bg-black ${Math.random() > 0.4 ? 'opacity-100' : 'opacity-0'}`}></div>)}
                    </div>
                </div>
                <p className="text-xs text-gray-500 px-8">
                  This card remains the property of NAMPDTech. If found, please return to the nearest state secretariat.
                  <br/><br/>
                  Scan QR code to verify membership status instantly.
                </p>
                <div className="text-xs font-bold text-indigo-900 mt-4">www.nampdtech.org</div>
             </div>
          </div>

        </div>
      </div>

      <div className="flex space-x-4 text-sm text-gray-500">
         <button onClick={() => setIsFlipped(!isFlipped)} className="flex items-center hover:text-gray-900">
           <RotateCcw className="w-4 h-4 mr-1" /> Flip Card
         </button>
         <button className="flex items-center hover:text-gray-900">
           <Share2 className="w-4 h-4 mr-1" /> Share
         </button>
      </div>
      
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  );
};
