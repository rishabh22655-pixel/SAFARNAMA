import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Film, Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#080706] border-t border-[#1F1B16] text-safari-muted pt-16 pb-12 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#1C1814]">
          
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-serif font-medium text-safari-cream">
                Safarnama
              </span>
            </Link>
            <p className="text-xs uppercase tracking-[0.25em] text-safari-copper font-medium">
              New Journey Beyond Travelling
            </p>
            <p className="text-sm text-safari-muted max-w-md leading-relaxed">
              We travel strictly when a landscape is worth filming. Two seasonal windows per destination, small group capacities, and cinematic pacing designed for unhurried presence.
            </p>
            <div className="flex items-center gap-6 pt-2 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Film className="w-4 h-4 text-safari-amber" /> 35mm Pacing
              </span>
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" /> Capped Cohorts
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-safari-copper" /> Live Weather Guard
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-safari-copper mb-4">
              Seasonal Portals
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><Link to="/planner" className="hover:text-safari-cream transition-colors">Bali — Tegalalang</Link></li>
              <li><Link to="/planner" className="hover:text-safari-cream transition-colors">Ooty — The Nilgiris</Link></li>
              <li><Link to="/planner" className="hover:text-safari-cream transition-colors">Kedarnath · 3,583 m</Link></li>
              <li><Link to="/planner" className="hover:text-safari-cream transition-colors">Mussoorie — Camel's Back</Link></li>
              <li><Link to="/planner" className="hover:text-safari-cream transition-colors">Offbeat India (Cold Desert & Ghats)</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-safari-copper mb-4">
              Intelligence
            </h4>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li><span className="text-emerald-400 font-mono text-xs">LIVE</span> Open-Meteo Meteorology</li>
              <li><span className="text-emerald-400 font-mono text-xs">LIVE</span> OSRM Routing Engine</li>
              <li><span className="text-safari-amber font-mono text-xs">AI</span> Gemini Dynamic Replanning</li>
              <li><span className="text-safari-copper font-mono text-xs">MATH</span> Minimal Settlement Engine</li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-600 gap-4">
          <div>
            © {new Date().getFullYear()} Safarnama. All seasonal windows strictly enforced.
          </div>
          <div className="font-mono text-[11px] text-zinc-500">
            Crafted for explorers who seek stone, snow and a bell.
          </div>
        </div>
      </div>
    </footer>
  );
};
