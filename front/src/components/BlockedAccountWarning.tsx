import React from 'react';

interface BlockedAccountWarningProps {
  coordinatorEmail?: string;
}

export const BlockedAccountWarning: React.FC<BlockedAccountWarningProps> = ({ 
  coordinatorEmail = 'coordinator@sdu.edu.kz' 
}) => {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-red-50 border-2 border-red-500 rounded-xl p-8 text-center">
        <div className="mb-6">
          <svg 
            className="mx-auto h-20 w-20 text-red-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-red-700 mb-4">
          Account Suspended
        </h2>
        
        <div className="bg-white rounded-lg p-6 mb-6">
          <p className="text-gray-800 text-lg leading-relaxed">
            Your account has been suspended for reaching the limit of <strong className="text-red-600">three policy violations</strong>.
          </p>
          <p className="text-gray-800 text-lg leading-relaxed mt-4">
            Please have your parents contact{' '}
            <a 
              href={`mailto:${coordinatorEmail}`}
              className="text-blue-600 hover:text-blue-800 underline font-semibold"
            >
              {coordinatorEmail}
            </a>
            {' '}for further assistance.
          </p>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Access to all modules has been restricted until this matter is resolved.</p>
        </div>
      </div>
    </div>
  );
};
