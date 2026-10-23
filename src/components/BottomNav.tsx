import React from 'react';
import { Home, Search, Calendar, Users, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
  const { t } = useLanguage();

  const items = [
    { id: 'dashboard', label: t.home, icon: Home },
    { id: 'search', label: t.findTrains, icon: Search },
    { id: 'planner', label: t.tatkalPlanner, icon: Calendar },
    { id: 'passengers', label: t.passengerProfiles, icon: Users },
    { id: 'pnr', label: t.pnrStatus, icon: FileText }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#0A1D37] border-t border-[#1E3A5F] px-2 py-1 safe-bottom">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg transition-colors min-h-[48px] min-w-[56px] ${
                isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 whitespace-nowrap leading-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
