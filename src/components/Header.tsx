import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Sparkles, LogOut, Compass } from 'lucide-react';
import { getCurrentUser, setCurrentUser, UserSession, migrateLocalPlansToAccount } from '../lib/storage';

export const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<UserSession>(getCurrentUser());
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    const newUser: UserSession = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      email: authEmail,
      name: authName || authEmail.split('@')[0],
      isGuest: false
    };
    setCurrentUser(newUser);
    setUser(newUser);
    setShowAuthModal(false);

    // Trigger local plan migration
    const migrated = await migrateLocalPlansToAccount(newUser);
    if (migrated > 0) {
      setSyncStatus(`Synced ${migrated} offline plan(s) to your account!`);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  const handleLogout = () => {
    const guest: UserSession = {
      id: 'guest-' + Math.random().toString(36).substring(2, 9),
      email: 'guest@safarnama.film',
      name: 'Guest Traveler',
      isGuest: true
    };
    setCurrentUser(guest);
    setUser(guest);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#0C0A09]/90 backdrop-blur-md border-b border-[#26231E]/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl sm:text-3xl font-serif font-medium tracking-tight text-safari-cream group-hover:text-safari-amber transition-colors">
              Safarnama
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-[0.2em] text-safari-muted">
            <a
              href="/#scenes"
              className="hover:text-safari-cream transition-colors duration-200"
            >
              Scenes
            </a>
            <a
              href="/#offbeat"
              className="hover:text-safari-cream transition-colors duration-200"
            >
              Offbeat India
            </a>
            <Link
              to="/planner"
              className={`hover:text-safari-cream transition-colors duration-200 ${
                location.pathname === '/planner' ? 'text-safari-amber font-semibold' : ''
              }`}
            >
              Planner
            </Link>
            <Link
              to="/trips"
              className={`hover:text-safari-cream transition-colors duration-200 ${
                location.pathname.startsWith('/trips') ? 'text-safari-amber font-semibold' : ''
              }`}
            >
              My Trips
            </Link>
          </nav>

          {/* Right actions: CTA button & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {/* Account pill */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border border-[#2E2922] bg-[#141210] hover:border-safari-copper text-safari-muted hover:text-safari-cream transition-all"
              title={user.isGuest ? 'Guest session (Saved locally)' : user.email}
            >
              <User className="w-3.5 h-3.5 text-safari-amber" />
              <span className="max-w-[100px] truncate">{user.isGuest ? 'Guest' : user.name}</span>
              {user.isGuest ? (
                <span className="text-[10px] text-amber-500/80 font-sans tracking-wide">● offline</span>
              ) : (
                <span className="text-[10px] text-emerald-400 font-sans tracking-wide">● cloud</span>
              )}
            </button>

            {/* CTA Button */}
            <Link
              to="/planner"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-[0_2px_12px_rgba(245,166,91,0.25)] transition-all transform active:scale-95"
            >
              Plan Your Trip
            </Link>
          </div>

          {/* Mobile hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-safari-cream hover:text-safari-amber"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#12100E] border-b border-[#26231E] px-6 py-6 space-y-4 animate-fadeIn">
            <nav className="flex flex-col space-y-3 text-xs uppercase tracking-[0.2em] text-safari-muted">
              <a
                href="/#scenes"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                Scenes
              </a>
              <a
                href="/#offbeat"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white"
              >
                Offbeat India
              </a>
              <Link
                to="/planner"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white text-safari-cream"
              >
                Planner
              </Link>
              <Link
                to="/trips"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-white text-safari-cream"
              >
                My Trips
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#26231E] flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowAuthModal(true);
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg bg-[#181512] border border-[#2E2922] text-xs text-safari-cream"
              >
                <span>{user.isGuest ? 'Guest Traveler (Offline)' : user.name}</span>
                <span className="text-safari-amber">{user.isGuest ? 'Sign In / Sync' : 'Account'}</span>
              </button>

              <Link
                to="/planner"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber text-black"
              >
                Plan Your Trip
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Sync notification toast */}
      {syncStatus && (
        <div className="fixed top-24 right-4 z-50 bg-emerald-950/90 border border-emerald-600 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn backdrop-blur-md text-xs">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Auth / Account Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#141210] border border-[#2E2922] rounded-2xl p-6 text-[#EDE5DB]">
            <div className="flex items-center justify-between pb-4 border-b border-[#26231E]">
              <div>
                <h3 className="font-serif text-xl text-safari-cream">
                  {user.isGuest ? 'Safarnama Membership' : 'Account Details'}
                </h3>
                <p className="text-xs text-safari-muted mt-0.5">
                  {user.isGuest
                    ? 'Sign in to sync offline plans across your devices and coordinate group journeys.'
                    : 'Your cloud account is active.'}
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {user.isGuest ? (
              <form onSubmit={handleLogin} className="mt-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-safari-copper mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="e.g. Maya Sen"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0C0A09] border border-[#2E2922] text-sm text-safari-cream focus:outline-none focus:border-safari-amber transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-safari-copper mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="traveler@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0C0A09] border border-[#2E2922] text-sm text-safari-cream focus:outline-none focus:border-safari-amber transition-colors"
                  />
                </div>

                <div className="p-3 rounded-lg bg-[#181512] border border-[#26231E] text-xs text-zinc-400 leading-relaxed">
                  <span className="text-safari-amber font-medium">Automatic Migration:</span> Any itineraries planned as a guest will be automatically saved and bound to this email.
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="px-4 py-2 text-xs uppercase tracking-wider text-zinc-400 hover:text-white"
                  >
                    Keep as Guest
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-amber hover:bg-safari-amber-hover text-black shadow-lg"
                  >
                    Sign In & Sync
                  </button>
                </div>
              </form>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="p-4 rounded-xl bg-[#0C0A09] border border-[#26231E]">
                  <div className="text-xs text-safari-muted">Signed in as</div>
                  <div className="text-base font-medium text-safari-cream">{user.name}</div>
                  <div className="text-xs font-mono text-zinc-400 mt-0.5">{user.email}</div>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign out to Guest
                  </button>
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-safari-card border border-[#3A352E] text-safari-cream hover:border-safari-copper"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
