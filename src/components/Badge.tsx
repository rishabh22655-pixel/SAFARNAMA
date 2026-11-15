import React, { useState } from 'react';
import { BadgeType } from '../types';

interface BadgeProps {
  type: BadgeType;
  source?: string;
  timestamp?: string;
  basis?: string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type,
  source,
  timestamp,
  basis,
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getStyle = () => {
    switch (type) {
      case 'LIVE':
        return 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 shadow-[0_0_8px_rgba(16,185,129,0.2)]';
      case 'ESTIMATE':
        return 'bg-amber-950/70 text-amber-300 border border-amber-700/50';
      case 'USER-ENTERED':
        return 'bg-blue-950/70 text-blue-300 border border-blue-700/50';
      default:
        return 'bg-zinc-800 text-zinc-300 border border-zinc-700';
    }
  };

  const getDot = () => {
    switch (type) {
      case 'LIVE':
        return 'bg-emerald-400 animate-pulse';
      case 'ESTIMATE':
        return 'bg-amber-400';
      case 'USER-ENTERED':
        return 'bg-blue-400';
      default:
        return 'bg-zinc-400';
    }
  };

  const tooltipText = () => {
    if (type === 'LIVE') {
      const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString() : 'Just now';
      return `Source: ${source || 'Live Satellite & OSRM Engine'} · Fetched: ${timeStr}`;
    }
    if (type === 'ESTIMATE') {
      return `Basis: ${basis || 'Historical seasonal averages & fixed daily rates'}`;
    }
    return 'Manually verified and entered by group member';
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold cursor-help transition-all ${getStyle()} ${className}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${getDot()}`} />
        {type}
      </span>

      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-50 w-56 p-2 text-[11px] leading-tight text-[#EDE5DB] bg-[#181512] border border-[#3A352E] rounded shadow-xl pointer-events-none animate-fadeIn backdrop-blur-md">
          <div className="font-semibold text-safari-amber mb-0.5">{type} Data Point</div>
          <div className="text-zinc-300">{tooltipText()}</div>
        </div>
      )}
    </div>
  );
};
