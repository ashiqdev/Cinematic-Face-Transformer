
import React from 'react';

type StageStatus = 'pending' | 'active' | 'complete';

interface StageCardProps {
  stageNumber: number;
  title: string;
  status: StageStatus;
  children: React.ReactNode;
}

const statusClasses: Record<StageStatus, { bg: string; text: string; ring: string }> = {
  pending: { bg: 'bg-gray-700', text: 'text-gray-400', ring: 'ring-gray-700' },
  active: { bg: 'bg-purple-600', text: 'text-white', ring: 'ring-purple-500' },
  complete: { bg: 'bg-cyan-600', text: 'text-white', ring: 'ring-cyan-500' },
};

export const StageCard: React.FC<StageCardProps> = ({ stageNumber, title, status, children }) => {
  const statusConfig = statusClasses[status];

  return (
    <div className={`bg-gray-800/40 rounded-xl shadow-lg transition-all duration-500 ${status === 'pending' ? 'opacity-60' : 'opacity-100'} ring-1 ring-white/10`}>
      <div className="p-5 border-b border-gray-700 flex items-center gap-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${statusConfig.bg} ${statusConfig.text} ring-2 ${statusConfig.ring}`}>
          {stageNumber}
        </div>
        <h2 className="text-xl font-bold tracking-wide text-white">{title}</h2>
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  );
};