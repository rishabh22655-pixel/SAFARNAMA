import React from 'react';
import { Destination } from '../../types';
import { Check } from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isSelected,
  onToggle,
}) => {
  return (
    <div
      onClick={() => onToggle(destination.id)}
      className={`group relative flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected
          ? 'bg-[#181511] border-2 border-safari-amber shadow-[0_0_20px_rgba(245,166,91,0.18)] translate-y-[-2px]'
          : 'bg-[#141210] border border-[#26231E] hover:border-[#3E382F] hover:bg-[#1A1713]'
      }`}
    >
      {/* Selection pill indicator */}
      <div
        className={`absolute top-3.5 right-3.5 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-safari-amber text-black scale-100 shadow-md'
            : 'bg-black/40 border border-white/20 text-transparent group-hover:border-white/50'
        }`}
      >
        <Check className="w-3.5 h-3.5 stroke-[3]" />
      </div>

      {/* Image container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#0C0A09]">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Eyebrow Region */}
          <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C89B68] font-medium mb-1.5">
            {destination.region}
          </div>

          {/* Name */}
          <h3 className="text-xl sm:text-2xl font-serif font-normal text-safari-cream tracking-tight group-hover:text-white transition-colors">
            {destination.name}
          </h3>

          {/* Tagline */}
          <p className="mt-2 text-xs sm:text-sm text-safari-muted leading-relaxed line-clamp-2">
            {destination.tagline}
          </p>
        </div>

        {/* Price Tag */}
        <div className="mt-5 pt-3.5 border-t border-[#23201A] flex items-center justify-between text-xs font-mono text-[#8E867A]">
          <span className="tracking-wider">
            ₹{destination.price_per_day.toLocaleString('en-IN')} / DAY · PER PERSON
          </span>
        </div>
      </div>
    </div>
  );
};
