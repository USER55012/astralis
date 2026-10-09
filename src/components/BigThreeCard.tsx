import React from 'react';
import { NatalChartData } from '../types/astrology';

interface BigThreeCardProps {
  chart: NatalChartData;
}

export const BigThreeCard: React.FC<BigThreeCardProps> = ({ chart }) => {
  const sunPos = chart.planets.find((p) => p.name === 'Sun');
  const moonPos = chart.planets.find((p) => p.name === 'Moon');
  const ascPos = chart.planets.find((p) => p.name === 'Ascendant');

  return (
    <div className="space-y-4">
      {/* Editorial Header note regarding exact birth hour */}
      <div className="p-4 sm:p-5 rounded-xl bg-obsidian-850 border border-white/[0.08] text-sm text-neutral-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-brass-400 shrink-0" />
          <span className="font-mono text-xs uppercase tracking-wider text-neutral-300">
            ФАКТОР ВРЕМЕНИ РОЖДЕНИЯ ({chart.birthTime || '12:00'})
          </span>
        </div>
        <p className="text-sm sm:text-base text-neutral-200 max-w-2xl sm:text-right font-sans leading-relaxed">
          Асцендент смещается на один знак каждые ~120 минут. Именно точный час определяет внешнюю оптику, манеру держаться и первичное впечатление при контакте.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sun Card */}
        <div className="editorial-card rounded-2xl p-6 sm:p-7 space-y-4 transition-all hover:border-white/20">
          <div className="flex items-start justify-between border-b border-white/[0.06] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block">
                01 · ЯДРО ЛИЧНОСТИ
              </span>
              <span className="text-xs font-mono text-brass-300/90">☉ СОЛНЦЕ</span>
            </div>
            <span className="font-serif text-2xl text-neutral-200">{chart.sunSign.symbol}</span>
          </div>

          <div>
            <h3 className="font-serif text-3xl font-medium text-white tracking-wide">
              {chart.sunSign.nameRu}
            </h3>
            <div className="text-xs font-mono text-neutral-400 mt-0.5">
              {sunPos?.degreeInSign}°{sunPos?.minuteInSign}′ • {chart.sunSign.elementRu} • {chart.sunSign.dates}
            </div>
          </div>

          <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
            {chart.sunSign.tagline}. {chart.sunSign.description}
          </p>
        </div>

        {/* Moon Card */}
        <div className="editorial-card rounded-2xl p-6 sm:p-7 space-y-4 transition-all hover:border-white/20">
          <div className="flex items-start justify-between border-b border-white/[0.06] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 block">
                02 · ВНУТРЕННИЙ МИР
              </span>
              <span className="text-xs font-mono text-neutral-300">☽ ЛУНА</span>
            </div>
            <span className="font-serif text-2xl text-neutral-200">{chart.moonSign.symbol}</span>
          </div>

          <div>
            <h3 className="font-serif text-3xl font-medium text-white tracking-wide">
              {chart.moonSign.nameRu}
            </h3>
            <div className="text-xs font-mono text-neutral-400 mt-0.5">
              {moonPos?.degreeInSign}°{moonPos?.minuteInSign}′ • {chart.moonSign.elementRu}
            </div>
          </div>

          <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
            Подсознательные паттерны, потребность в душевной безопасности и то, как человек восстанавливает ресурс наедине с собой. В близких отношениях: {chart.moonSign.inLove}
          </p>
        </div>

        {/* Ascendant Card */}
        <div className="editorial-card rounded-2xl p-6 sm:p-7 space-y-4 transition-all hover:border-white/20 border-brass-400/20">
          <div className="flex items-start justify-between border-b border-white/[0.06] pb-3">
            <div>
              <span className="text-[10px] font-mono tracking-widest uppercase text-brass-300/80 block">
                03 · СОЦИАЛЬНЫЙ ГОРИЗОНТ
              </span>
              <span className="text-xs font-mono text-brass-300">ASC · АСЦЕНДЕНТ</span>
            </div>
            <span className="font-serif text-2xl text-brass-300">{chart.ascendantSign.symbol}</span>
          </div>

          <div>
            <h3 className="font-serif text-3xl font-medium text-white tracking-wide">
              {chart.ascendantSign.nameRu}
            </h3>
            <div className="text-xs font-mono text-brass-300/80 mt-0.5">
              {ascPos?.degreeInSign}°{ascPos?.minuteInSign}′ • {chart.birthTime} ({chart.cityName})
            </div>
          </div>

          <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
            Оптика первого восприятия: то, как вас считывают со стороны до глубокого знакомства. {chart.ascendantSign.tagline}. {chart.ascendantSign.description}
          </p>
        </div>
      </div>
    </div>
  );
};
