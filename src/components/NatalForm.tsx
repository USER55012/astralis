import React, { useState } from 'react';
import { POPULAR_CITIES } from '../data/cities';
import { playStardustHarp } from '../utils/sound';

import { CelestialLoadingModal } from './CelestialLoadingModal';

interface NatalFormProps {
  onCalculate: (params: {
    name: string;
    birthDate: string;
    birthTime: string;
    cityName: string;
    latitude: number;
    longitude: number;
    timezone: number;
  }) => void;
  currentValues: {
    name: string;
    birthDate: string;
    birthTime: string;
    cityName: string;
  };
}

export const NatalForm: React.FC<NatalFormProps> = ({ onCalculate, currentValues }) => {
  const [name, setName] = useState(currentValues.name || 'Ты');
  const [birthDate, setBirthDate] = useState(currentValues.birthDate || '1998-05-14');
  const [birthTime, setBirthTime] = useState(currentValues.birthTime || '14:30');
  const [cityName, setCityName] = useState(currentValues.cityName || 'Москва');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    playStardustHarp();
    const city = POPULAR_CITIES.find((c) => c.name === cityName) || POPULAR_CITIES[0];
    onCalculate({
      name,
      birthDate,
      birthTime,
      cityName: city.name,
      latitude: city.lat,
      longitude: city.lon,
      timezone: city.tz,
    });
  };

  const handleFillDemo = () => {
    setName('Алекс');
    setBirthDate('1997-07-28');
    setBirthTime('11:45');
    setCityName('Санкт-Петербург');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="editorial-card rounded-2xl p-6 sm:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
            GEOCENTRIC PARAMETERS
          </span>
          <h3 className="font-serif text-2xl font-normal text-white mt-0.5">
            Астрономические Координаты Рождения
          </h3>
        </div>
        <button
          type="button"
          onClick={handleFillDemo}
          className="text-[11px] font-mono tracking-wider text-neutral-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-lg transition-colors self-start cursor-pointer"
        >
          ЗАПОЛНИТЬ ПРИМЕР
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Name */}
        <div>
          <label className="block text-xs font-mono tracking-wider uppercase text-neutral-300 mb-1.5">
            Имя / Идентификатор
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50 font-sans"
            placeholder="Имя"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-mono tracking-wider uppercase text-neutral-300 mb-1.5">
            Дата Рождения
          </label>
          <input
            type="date"
            required
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50 font-mono"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-xs font-mono tracking-wider uppercase text-neutral-300 mb-1.5 flex items-center justify-between">
            <span>Время (чч:мм)</span>
            <span className="text-[11px] text-brass-300">★ Асцендент</span>
          </label>
          <input
            type="time"
            required
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50 font-mono"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-mono tracking-wider uppercase text-neutral-300 mb-1.5">
            Локация (Широта / Долгота)
          </label>
          <select
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50 font-sans"
          >
            {POPULAR_CITIES.map((c) => (
              <option key={c.name} value={c.name} className="bg-[#121217] text-white">
                {c.name} ({c.country})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-white text-black font-mono text-xs tracking-wider uppercase font-semibold hover:bg-neutral-200 transition-all cursor-pointer shadow-md"
        >
          Синтезировать Эфемериды
        </button>
      </div>

      <CelestialLoadingModal
        isOpen={isLoading}
        onComplete={handleLoadingComplete}
        mode="natal"
        title="СИНТЕЗ НАТАЛЬНЫХ ЭФЕМЕРИД"
        subtitle={`Топоцентрический расчет пространственных координат для ${name} (${cityName})`}
      />
    </form>
  );
};
