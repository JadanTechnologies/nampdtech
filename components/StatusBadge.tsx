import React from 'react';
import { MembershipStatus } from '../types';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let colorClass = 'bg-gray-100 text-gray-800';

  switch (status) {
    case MembershipStatus.ACTIVE:
      colorClass = 'bg-green-100 text-green-800';
      break;
    case MembershipStatus.PENDING_CHAIRMAN:
    case MembershipStatus.PENDING_STATE:
      colorClass = 'bg-yellow-100 text-yellow-800';
      break;
    case MembershipStatus.PENDING_PAYMENT:
      colorClass = 'bg-blue-100 text-blue-800';
      break;
    case MembershipStatus.REJECTED:
    case MembershipStatus.SUSPENDED:
      colorClass = 'bg-red-100 text-red-800';
      break;
  }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};
