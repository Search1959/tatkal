import React, { useState, useEffect } from 'react';
import { 
  Train, 
  Clock, 
  ExternalLink, 
  Globe, 
  ShieldCheck, 
  Bell, 
  Settings,
  Menu,
  X,
  Cloud,
  Lock,
  LogOut
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  pendingAlertsCount: number;
  onOpenSyncModal?: () => void;
  isCloudConnected?: boolean;
  isAdmin?: boolean;
  onOpenAdminLogin?: () => void;
  onAdminLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  pendingAlertsCount,
  onOpenSyncModal,
  isCloudConnected = true,
  isAdmin = false,
  onOpenAdminLogin,
  onAdminLogout
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [istTime, setIstTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Synchronize Indian Standard Time (IST - UTC+05:30)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format in IST
      const istString = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      setIstTime(istString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Passenger-facing main navigation (Admin removed as requested)
  const navItems = [
    { id: 'dashboard', label: t.home },
    { id: 'search', label: t.findTrains },
    { id: 'planner', label: t.tatkalPlanner },
    { id: 'journeys', label: t.myJourneys },
    { id: 'passengers', label: t.passengerProfiles },
    { id: 'pnr', label: t.pnrStatus },
    { id: 'alerts', label: t.alerts, badge: pendingAlertsCount }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0A1D37] border-b border-[#1E3A5F] text-white">
      {/* Top micro disclaimer & Staff Admin Access */}
      <div className="bg-[#071324] px-4 py-1 text-xs text-slate-300 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">{t.disclaimerBanner}</span>
        </div>
        <div className="hidden sm:flex items-center gap-3 shrink-0 text-slate-400 text-xs">
          <span>Official IRCTC Safe Companion</span>
          <span aria-hidden="true">·</span>
          {isAdmin ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('admin')}
                className="text-amber-300 font-bold hover:underline flex items-center gap-1 bg-amber-950/60 border border-amber-600/40 px-2 py-0.5 rounded text-[11px]"
              >
                <Settings className="w-3 h-3" />
                <span>Admin Console (Active)</span>
              </button>
              <button
                onClick={onAdminLogout}
                className="text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold text-[11px]"
                title="Log out of Administrator Session"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1 font-medium hover:underline text-[11px]"
              title="System Administrator Login"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Admin Portal</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-lg bg-[#9B111E] flex items-center justify-center text-white shadow-md shadow-[#9B111E]/30">
              <Train className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">{t.appName}</span>
                <span className="text-[10px] tracking-wider font-semibold uppercase text-amber-400 bg-amber-950/60 border border-amber-600/40 px-1.5 py-0.2 rounded">
                  TATKAL
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block leading-none mt-0.5">
                {t.appTagline}
              </p>
            </div>
          </div>

          {/* Center: Live Indian Standard Time (IST) Clock */}
          <div className="hidden md:flex items-center gap-2 bg-[#102A4C] border border-[#1E3E68] px-3 py-1.5 rounded-lg text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="text-slate-300 font-medium">Railway Clock (IST):</span>
            <span className="font-mono font-bold text-amber-300 text-sm tracking-widest">{istTime || '--:--:--'}</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Cloud Sync Button */}
            {onOpenSyncModal && (
              <button
                onClick={onOpenSyncModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#143156] hover:bg-[#1C4170] text-xs font-semibold text-emerald-300 transition-colors border border-emerald-500/30"
                title="Internet Cloud Database & Cross-Device Sync"
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Cloud Sync</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#143156] hover:bg-[#1C4170] text-xs font-medium text-slate-200 transition-colors border border-white/10"
              title="Toggle Language (English / हिंदी)"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Official IRCTC Button */}
            <a
              href="https://www.irctc.co.in/nget/train-search"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9B111E] hover:bg-[#B91C1C] text-xs font-semibold text-white shadow-sm transition-colors border border-red-400/20"
              title="Open Official IRCTC Website"
            >
              <span>IRCTC Official</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#143156]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 border-t border-[#1E3A5F]/70 py-1 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-3 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#193B64] text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-[#132E50]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D2444] border-b border-[#1E3A5F] px-4 pt-2 pb-4 space-y-1">
          <div className="flex items-center justify-between py-2 border-b border-white/10 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Railway Clock (IST):
            </span>
            <span className="font-mono font-bold text-amber-300">{istTime}</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center justify-between ${
                  activeTab === item.id
                    ? 'bg-[#193B64] text-white font-semibold'
                    : 'text-slate-300 hover:bg-[#143156]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-[10px] font-bold text-slate-950 flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="pt-2 space-y-1.5">
            {isAdmin ? (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setActiveTab('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2 px-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </button>
                <button
                  onClick={() => {
                    onAdminLogout?.();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2 px-3 rounded-lg bg-red-900/60 text-red-200 border border-red-500/30 text-xs font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAdminLogin?.();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-medium flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>System Admin Portal</span>
              </button>
            )}

            <a
              href="https://www.irctc.co.in/nget/train-search"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#9B111E] text-xs font-semibold text-white"
            >
              <span>{t.proceedToIrctc}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
