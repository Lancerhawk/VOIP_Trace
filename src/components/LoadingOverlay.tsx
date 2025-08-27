'use client';

import { useLoading } from '@/contexts/LoadingContext';

const LoadingOverlay = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] " style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
      <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Processing...</h3>
          <p className="text-gray-600 text-sm">Please wait while we complete your request</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
