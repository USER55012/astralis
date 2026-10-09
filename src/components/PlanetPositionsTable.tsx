import React, { useState } from 'react';
import { PlanetPosition } from '../types/astrology';

interface PlanetPositionsTableProps {
  planets: PlanetPosition[];
}

export const PlanetPositionsTable: React.FC<PlanetPositionsTableProps> = ({ planets }) => {
  const [filter, setFilter] = useState<'all' | 'personal' | 'social'>('all');

  const personalPlanets = ['Sun', 'Moon', 'Ascendant', 'Mercury', 'Venus', 'Mars'];
  const filteredPlanets = planets.filter((p) => {
    if (filter === 'personal') return personalPlanets.includes(p.name);
    if (filter === 'social') return !personalPlanets.includes(p.name);
    return true;
  });

  return (
    <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
            EPHEMERIS LOG
          </span>
          <h4 className="font-serif text-2xl text-white font-normal mt-0.5">
            Точные Координаты Небесных Тел
          </h4>
        </div>

        <div className="flex items-center gap-1 bg-[#121217] p-1 rounded-xl border border-white/10 self-start">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-black font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ВСЕ
          </button>
          <button
            onClick={() => setFilter('personal')}
            className={`px-3 py-1 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
              filter === 'personal'
                ? 'bg-white text-black font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ЛИЧНЫЕ
          </button>
          <button
            onClick={() => setFilter('social')}
            className={`px-3 py-1 rounded-lg text-xs font-mono tracking-wider transition-all cursor-pointer ${
              filter === 'social'
                ? 'bg-white text-black font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ВЫСШИЕ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredPlanets.map((planet) => (
          <div
            key={planet.name}
            className="p-4 rounded-xl bg-[#121217] border border-white/[0.06] hover:border-white/15 transition-all space-y-2"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center font-serif text-lg text-brass-300">
                  {planet.symbol}
                </span>
                <div>
                  <div className="font-serif font-medium text-base text-white">
                    {planet.nameRu}{' '}
                    <span className="text-xs font-sans text-neutral-400 font-normal">
                      в {planet.signRu}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-neutral-400">
                    {planet.degreeInSign}°{planet.minuteInSign}′ · {planet.house} Дом
                  </div>
                </div>
              </div>
            </div>

            <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans pl-11">
              {planet.vibe}
            </p>

            <div className="text-sm font-mono text-neutral-300 pl-11 tracking-wide">
              {planet.meaningRu}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
