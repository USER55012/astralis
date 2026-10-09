import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { toggleMute, getMuteState, playCosmicChime } from '../utils/sound';

export type ActiveTab = 'natal' | 'synastry' | 'matrix' | 'tarot';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const [muted, setMuted] = useState(getMuteState());

  const handleTabClick = (tab: ActiveTab) => {
    playCosmicChime();
    onTabChange(tab);
  };

  const handleSoundToggle = () => {
    const nextState = toggleMute();
    setMuted(nextState);
    if (!nextState) {
      playCosmicChime(1.2);
    }
  };

  const navItems: { id: ActiveTab; label: string; sub: string }[] = [
    { id: 'natal', label: 'NATALIS', sub: 'Натальная карта' },
    { id: 'synastry', label: 'SYNASTRIA', sub: 'Синастрия союза' },
    { id: 'matrix', label: 'NUMERIS', sub: 'Матрица 22' },
    { id: 'tarot', label: 'ORACULUM', sub: 'Карта дня' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070709]/90 border-b border-white/[0.08] px-4 sm:px-8 py-4 transition-all">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6">
        {/* Brandmark */}
        <div
          onClick={() => handleTabClick('natal')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center font-serif text-xs text-brass-300 group-hover:border-brass-400 transition-colors">
            ☉
          </div>
          <div>
            <div className="font-serif font-medium text-lg tracking-[0.2em] text-white">
              ASTRALIS
            </div>
            <div className="text-[9px] uppercase font-mono tracking-widest text-neutral-400">
              Celestial Ephemeris & Synastry
            </div>
          </div>
        </div>

        {/* Minimalist Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer whitespace-nowrap flex flex-col items-center ${
                  isActive
                    ? 'text-white'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <span className="font-medium">{item.label}</span>
                <span className="text-[9px] text-neutral-500 font-sans tracking-normal hidden md:inline">
                  {item.sub}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-[1.5px] bg-brass-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Utility: Audio */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSoundToggle}
            title={muted ? 'Включить атмосферный звук' : 'Выключить звук'}
            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            {muted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-brass-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
