import React from 'react';
import { Trip, ItineraryItem } from '../../types';
import { X, ExternalLink, ShieldAlert, Bed, Car, Compass, Info } from 'lucide-react';
import { Badge } from '../../components/Badge';

interface BookingAssistanceModalProps {
  isOpen: boolean;
  trip: Trip;
  items: ItineraryItem[];
  onClose: () => void;
}

export const BookingAssistanceModal: React.FC<BookingAssistanceModalProps> = ({
  isOpen,
  trip,
  items,
  onClose,
}) => {
  if (!isOpen) return null;

  const stayItems = items.filter((i) => i.category === 'accommodation');
  const transportItems = items.filter((i) => i.category === 'transport');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-[#141210] border border-[#2E2922] rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] text-[#EDE5DB]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#23201A]">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-safari-copper">
              Direct Provider Links Only
            </div>
            <h3 className="text-2xl font-serif text-safari-cream font-medium">
              Booking Assistance & Logistics
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Transparency & Safety Notice */}
        <div className="mt-4 p-4 rounded-xl bg-amber-950/30 border border-amber-900/60 flex items-start gap-3 text-xs text-amber-200/90 leading-relaxed">
          <Info className="w-4 h-4 text-safari-amber shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-safari-amber">Provider API Disclosure:</span> No direct payment gateway or third-party booking provider API is currently configured for autonomous charges. Safarnama provides verified outbound links directly to reputable local operators.
            <br />
            <strong>Safety Guarantee:</strong> We never charge or execute transactions without an explicit manual confirmation dialog.
          </div>
        </div>

        {/* Booking Links Directory */}
        <div className="mt-6 overflow-y-auto flex-1 space-y-6">
          {/* Accommodations */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-safari-copper mb-3 flex items-center gap-2">
              <Bed className="w-4 h-4 text-safari-amber" />
              <span>Verified Heritage Accommodations</span>
            </h4>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#26231E] flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-serif text-safari-cream font-medium">
                    GMVN Himalayan Base Camp (Kedarnath Valley)
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Government high-altitude stone resthouse · Fixed rate
                  </div>
                </div>
                <a
                  href="https://gmvnonline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-safari-amber border border-safari-amber/40 transition-colors shrink-0"
                >
                  <span>Operator</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#26231E] flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-serif text-safari-cream font-medium">
                    Nilgiri Shola Heritage Tea Estate Bungalow (Ooty)
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Colonial stone fireplace · Tea planter private suites
                  </div>
                </div>
                <a
                  href="https://www.incredibleindia.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-safari-amber border border-safari-amber/40 transition-colors shrink-0"
                >
                  <span>Operator</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Transport */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-safari-copper mb-3 flex items-center gap-2">
              <Car className="w-4 h-4 text-safari-amber" />
              <span>Mountain Transit & Permits</span>
            </h4>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#26231E] flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-serif text-safari-cream font-medium">
                    IRCTC Nilgiri Mountain Toy Train Heritage Carriage
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    UNESCO World Heritage steam rack railway reservation portal
                  </div>
                </div>
                <a
                  href="https://www.irctc.co.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-safari-amber border border-safari-amber/40 transition-colors shrink-0"
                >
                  <span>IRCTC Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#26231E] flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-serif text-safari-cream font-medium">
                    Uttarakhand Char Dham Devasthanam Registration
                  </div>
                  <div className="text-xs text-zinc-400 mt-0.5">
                    Mandatory biometric portal pass for Kedarnath valley entry
                  </div>
                </div>
                <a
                  href="https://registrationandtouristcare.uk.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider bg-zinc-800 hover:bg-zinc-700 text-safari-amber border border-safari-amber/40 transition-colors shrink-0"
                >
                  <span>Govt Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#23201A] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
