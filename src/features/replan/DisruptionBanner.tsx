import React, { useState } from 'react';
import { Alert, ItineraryItem } from '../../types';
import { AlertTriangle, CloudLightning, RefreshCw, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../components/Badge';

interface DisruptionBannerProps {
  alerts: Alert[];
  disruptedItems: ItineraryItem[];
  isChecking: boolean;
  onCheckNow: () => void;
  onViewAlternatives: () => void;
  lastCheckedAt?: string;
}

export const DisruptionBanner: React.FC<DisruptionBannerProps> = ({
  alerts,
  disruptedItems,
  isChecking,
  onCheckNow,
  onViewAlternatives,
  lastCheckedAt
}) => {
  const weatherAlerts = alerts.filter((a) => a.type === 'weather_disruption' && !a.resolved);
  const hasDisruptions = weatherAlerts.length > 0 || disruptedItems.length > 0;

  return (
    <div className="w-full mb-8">
      {hasDisruptions ? (
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-800/60 shadow-[0_0_30px_rgba(244,63,94,0.15)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-rose-900/50 text-rose-300 border border-rose-700/60 shrink-0">
              <CloudLightning className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-sm font-semibold font-serif text-white tracking-wide">
                  Weather Disruptions Detected
                </span>
                <Badge
                  type="LIVE"
                  source="Open-Meteo Meteorology Satellite"
                  timestamp={lastCheckedAt || new Date().toISOString()}
                />
              </div>

              <p className="mt-1 text-xs sm:text-sm text-rose-200/90 leading-relaxed max-w-2xl">
                {weatherAlerts[0]?.reason ||
                  `${disruptedItems.length} outdoor stop(s) flagged due to rain probability > 70% or extreme wind gusts.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={onCheckNow}
              disabled={isChecking}
              className="px-4 py-2.5 rounded-full text-xs font-mono uppercase tracking-wider text-rose-200 hover:text-white bg-rose-900/30 border border-rose-800 hover:border-rose-600 transition-all flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Scanning...' : 'Check Live'}</span>
            </button>

            <button
              onClick={onViewAlternatives}
              className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-lg transition-all flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>View Replanning Alternatives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="px-6 py-4 rounded-xl bg-[#141210] border border-[#23201A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-safari-cream">
              Meteorological Surveillance: All upcoming outdoor routes clear & within safe parameters.
            </span>
            <Badge
              type="LIVE"
              source="Open-Meteo Forecast"
              timestamp={lastCheckedAt}
            />
          </div>

          <button
            onClick={onCheckNow}
            disabled={isChecking}
            className="text-xs font-mono text-safari-copper hover:text-safari-amber flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking...' : 'Check Now'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
