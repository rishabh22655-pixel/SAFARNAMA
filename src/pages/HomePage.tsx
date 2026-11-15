import React from 'react';
import { Link } from 'react-router-dom';
import { Film, ArrowRight, Compass, ShieldCheck, CloudRain, Sparkles, MapPin } from 'lucide-react';
import { SEED_DESTINATIONS } from '../data/seedData';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0C0A09] text-[#EDE5DB]">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-[#1C1814]">
        {/* Background visual: High Himalaya stone and dawn light */}
        <img
          src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2600&q=85"
          alt="Safarnama Kedarnath Dawn"
          className="absolute inset-0 w-full h-full object-cover filter brightness-[0.70] contrast-[1.1]"
        />

        {/* Cinematic Vignette */}
        <div className="absolute inset-0 bg-radial-vignette opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-transparent to-[#0C0A09]/70" />

        {/* Center Editorial Title */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-safari-copper/40 bg-[#141210]/80 backdrop-blur-md mb-8 animate-fadeIn">
            <Film className="w-3.5 h-3.5 text-safari-amber" />
            <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-safari-copper">
              Travel Startup · Project Safarnama
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-normal text-safari-cream tracking-tight leading-[1.04]">
            New Journey <br />
            <span className="italic font-light text-safari-amber">Beyond Travelling</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-safari-muted max-w-2xl mx-auto leading-relaxed font-sans">
            We only travel when a place is worth filming. Fixed seasonal windows, capped cohorts, and intelligent replanning when mountain weather shifts.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/planner"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-[0_4px_24px_rgba(245,166,91,0.3)] transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Hold a Seat in the Window</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#scenes"
              className="w-full sm:w-auto px-8 py-4 rounded-full text-xs font-mono uppercase tracking-wider border border-[#2E2922] bg-[#141210]/60 hover:bg-[#1E1A16] hover:border-safari-copper text-safari-cream transition-all flex items-center justify-center"
            >
              Explore Film Scenes
            </a>
          </div>
        </div>
      </section>

      {/* 2. VALUE PILLARS */}
      <section className="py-20 border-b border-[#1A1713] bg-[#0E0C0A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#141210] border border-[#23201A]">
              <div className="w-12 h-12 rounded-xl bg-amber-950/40 border border-amber-900/50 flex items-center justify-center text-safari-amber mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-safari-cream font-medium">Two Yearly Windows</h3>
              <p className="mt-2 text-sm text-safari-muted leading-relaxed">
                No daily departures. Every valley has two brief moments per year where light, mist and weather align into pure cinema.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#141210] border border-[#23201A]">
              <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-900/50 flex items-center justify-center text-emerald-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-safari-cream font-medium">Capped Small Cohorts</h3>
              <p className="mt-2 text-sm text-safari-muted leading-relaxed">
                Strict database constraints guarantee groups never exceed 6–12 travellers. Presence over crowds.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-[#141210] border border-[#23201A]">
              <div className="w-12 h-12 rounded-xl bg-sky-950/40 border border-sky-900/50 flex items-center justify-center text-sky-400 mb-6">
                <CloudRain className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif text-safari-cream font-medium">Meteorological Safeguard</h3>
              <p className="mt-2 text-sm text-safari-muted leading-relaxed">
                Live Open-Meteo satellite surveillance paired with Gemini dynamic replanning swaps disrupted routes before you encounter them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SCENES ANCHOR SECTION (/#scenes) */}
      <section id="scenes" className="py-24 sm:py-32 border-b border-[#1A1713]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.25em] text-safari-copper font-medium mb-2">
                FRAMED PERSPECTIVES
              </div>
              <h2 className="text-4xl sm:text-5xl font-serif font-normal text-safari-cream tracking-tight">
                Cinematic Scenes & Portals
              </h2>
            </div>
            <p className="text-sm text-safari-muted max-w-md font-sans">
              Each destination is shot on a fixed seasonal schedule. These are the portals open for 2027 reservations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SEED_DESTINATIONS.slice(0, 4).map((dest, i) => (
              <div
                key={dest.id}
                className="group relative rounded-2xl overflow-hidden border border-[#26231E] bg-[#141210] flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0C0A09]">
                  <img
                    src={dest.image_url}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141210] via-transparent to-transparent" />
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest bg-black/60 border border-white/10 text-white backdrop-blur-md">
                    Scene 0{i + 1}
                  </span>
                </div>

                <div className="p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#C89B68] mb-1">
                      {dest.region}
                    </div>
                    <h3 className="text-2xl font-serif text-safari-cream font-medium">
                      {dest.name}
                    </h3>
                    <p className="mt-2 text-sm text-safari-muted leading-relaxed">
                      {dest.tagline}
                    </p>
                    <p className="mt-3 text-xs text-zinc-400 font-sans leading-relaxed">
                      {dest.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#23201A] flex items-center justify-between">
                    <span className="text-xs font-mono text-safari-copper">
                      ₹{dest.price_per_day.toLocaleString('en-IN')} / day
                    </span>
                    <Link
                      to="/planner"
                      className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-safari-amber hover:text-white transition-colors"
                    >
                      <span>Hold Seat</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. OFFBEAT INDIA ANCHOR SECTION (/#offbeat) */}
      <section id="offbeat" className="py-24 sm:py-32 bg-[#0A0908] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-safari-copper">
                <Sparkles className="w-3.5 h-3.5 text-safari-amber" />
                <span>Special Cohort</span>
              </div>

              <h2 className="text-4xl sm:text-6xl font-serif text-safari-cream tracking-tight leading-[1.08]">
                Offbeat India: <br />
                <span className="italic text-safari-amber">Western Ghats & Cold Desert</span>
              </h2>

              <p className="text-sm sm:text-base text-safari-muted leading-relaxed">
                A hidden waterfall discovered only through local foragers, a morning spice market before dawn awakens, and woodsmoke curling under the unfiltered Milky Way.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-sm text-zinc-300">
                  <MapPin className="w-4 h-4 text-safari-amber mt-1 shrink-0" />
                  <span>Western Ghats Monsoon Run: Bioluminescent moss and cascading mountain passes.</span>
                </div>
                <div className="flex items-start gap-3 text-sm text-zinc-300">
                  <MapPin className="w-4 h-4 text-safari-amber mt-1 shrink-0" />
                  <span>Cold Desert Starfire: Sub-zero night astrophotography in remote trans-Himalayan plateaus.</span>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  to="/planner"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-lg transition-transform active:scale-95"
                >
                  <span>Build Offbeat Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border border-[#2E2922] shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?auto=format&fit=crop&w=1600&q=85"
                  alt="Offbeat India Starry Campfire"
                  className="w-full h-[450px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#E5984A]">
                    Fixed Cohort · Capped at 6 Seats
                  </div>
                  <div className="text-xl font-serif text-safari-cream mt-1">
                    "Pilgrims arrive before the light does. Stone, snow and a bell."
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
