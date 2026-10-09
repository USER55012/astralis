import React, { useState } from 'react';
import { getFullMatrixDestinyReport, MatrixDestinyReport } from '../utils/numerology';
import { MAJOR_ARCANA } from '../data/tarotData';
import { playCosmicChime } from '../utils/sound';

interface NumerologyMatrixViewProps {
  birthDate: string;
}

export const NumerologyMatrixView: React.FC<NumerologyMatrixViewProps> = ({ birthDate }) => {
  const [date, setDate] = useState(birthDate || '1998-05-14');
  const [selectedArcanaId, setSelectedArcanaId] = useState<number | null>(null);

  const [yStr, mStr, dStr] = date.split('-');
  const year = parseInt(yStr, 10) || 1998;
  const month = parseInt(mStr, 10) || 5;
  const day = parseInt(dStr, 10) || 14;

  const report: MatrixDestinyReport = getFullMatrixDestinyReport(day, month, year);
  const activeArcanaCard = selectedArcanaId
    ? MAJOR_ARCANA.find((a) => a.id === selectedArcanaId)
    : MAJOR_ARCANA.find((a) => a.id === report.personalArcana);

  const handleSelectArcana = (id: number) => {
    playCosmicChime(1.1);
    setSelectedArcanaId(id);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 block">
          SACRED GEOMETRY & 22 ARCHETYPES
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-wide">
          Матрица Судьбы: Сакральная Геометрия
        </h2>
        <p className="text-base sm:text-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed font-sans">
          Матричная октаграмма 22 универсальных энергий бытия: персональный архетип, глубинная природа души, кармический вызов и ресурсная зона комфорта.
        </p>

        {/* Date Input */}
        <div className="inline-flex items-center gap-3 pt-2">
          <span className="text-xs font-mono text-neutral-300">ДАТА РОЖДЕНИЯ:</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-brass-400/50 font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Octagram Diagram */}
        <div className="lg:col-span-6 editorial-card rounded-2xl p-6 sm:p-8 flex flex-col items-center">
          <div className="w-full flex items-center justify-between border-b border-white/[0.08] pb-3 mb-4">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
              OCTAGRAMMA ARCHETYPICA
            </span>
            <span className="text-[10px] font-mono text-brass-300">22 КЛЮЧА</span>
          </div>

          <div className="relative w-full max-w-[360px] aspect-square flex items-center justify-center my-4">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Outer rotated square */}
              <polygon
                points="200,35 365,200 200,365 35,200"
                fill="none"
                stroke="rgba(197, 168, 128, 0.45)"
                strokeWidth="1.2"
              />
              {/* Straight square */}
              <rect
                x="83"
                y="83"
                width="234"
                height="234"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              />
              {/* Center crosshair */}
              <line x1="200" y1="35" x2="200" y2="365" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="35" y1="200" x2="365" y2="200" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="83" y1="83" x2="317" y2="317" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <line x1="83" y1="317" x2="317" y2="83" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />

              {/* Center disk */}
              <circle cx="200" cy="200" r="32" fill="#0d0d11" stroke="#c5a880" strokeWidth="1.5" />
            </svg>

            {/* Nodes */}
            <button
              onClick={() => handleSelectArcana(report.soulArcana)}
              className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#18181f] border border-white/20 text-white font-mono font-bold text-xs flex items-center justify-center hover:border-brass-400 hover:scale-105 transition-all cursor-pointer shadow-md"
              title="Аркан Души"
            >
              {report.soulArcana}
            </button>

            <button
              onClick={() => handleSelectArcana(report.personalArcana)}
              className="absolute top-1/2 left-2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#18181f] border border-white/20 text-white font-mono font-bold text-xs flex items-center justify-center hover:border-brass-400 hover:scale-105 transition-all cursor-pointer shadow-md"
              title="Личный Аркан"
            >
              {report.personalArcana}
            </button>

            <button
              onClick={() => handleSelectArcana(report.karmicArcana)}
              className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#18181f] border border-white/20 text-white font-mono font-bold text-xs flex items-center justify-center hover:border-brass-400 hover:scale-105 transition-all cursor-pointer shadow-md"
              title="Кармический Аркан"
            >
              {report.karmicArcana}
            </button>

            <button
              onClick={() => handleSelectArcana(report.centralComfortArcana)}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-13 h-13 rounded-full bg-[#1a1724] border-2 border-brass-400 text-brass-300 font-mono font-bold text-sm flex flex-col items-center justify-center hover:scale-105 transition-all cursor-pointer shadow-lg"
              title="Зона Комфорта Души"
            >
              <span>{report.centralComfortArcana}</span>
              <span className="text-[8px] font-sans text-neutral-400 uppercase tracking-tighter">Центр</span>
            </button>

            <button
              onClick={() => handleSelectArcana(report.moneyArcana)}
              className="absolute top-1/2 right-2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#18181f] border border-white/20 text-white font-mono font-bold text-xs flex items-center justify-center hover:border-brass-400 hover:scale-105 transition-all cursor-pointer shadow-md"
              title="Денежный Ключ"
            >
              {report.moneyArcana}
            </button>
          </div>

          <p className="text-xs font-mono text-neutral-300 text-center tracking-wider mt-3">
            ВЫБЕРИТЕ УЗЕЛ МАТРИЦЫ ДЛЯ РАСШИФРОВКИ АРХЕТИПА
          </p>
        </div>

        {/* Right: Active Arcana Detail */}
        <div className="lg:col-span-6 space-y-4">
          {activeArcanaCard && (
            <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-5 border-brass-400/25">
              <div className="flex items-start justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-brass-300 block">
                    АРКАН {activeArcanaCard.romanNumeral}
                  </span>
                  <h3 className="font-serif text-3xl font-normal text-white mt-0.5">
                    {activeArcanaCard.nameRu}
                  </h3>
                  <span className="text-xs text-neutral-400 font-mono">{activeArcanaCard.nameEn}</span>
                </div>
                <span className="font-serif text-3xl text-brass-300 font-light">
                  {activeArcanaCard.number}
                </span>
              </div>

              <blockquote className="text-sm sm:text-base text-neutral-200 italic border-l-2 border-brass-400/60 pl-4 py-1.5 leading-relaxed">
                {activeArcanaCard.quote}
              </blockquote>

              <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
                {activeArcanaCard.meaning}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-4 rounded-xl bg-[#121217] border border-white/[0.06] space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    ОТНОШЕНИЯ & СОЮЗ
                  </div>
                  <p className="text-neutral-200 text-sm sm:text-[15px] leading-relaxed font-sans">
                    {activeArcanaCard.loveMeaning}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#121217] border border-white/[0.06] space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    РЕСУРС & ДЕЯТЕЛЬНОСТЬ
                  </div>
                  <p className="text-neutral-200 text-sm sm:text-[15px] leading-relaxed font-sans">
                    {activeArcanaCard.workMeaning}
                  </p>
                </div>
              </div>

              <div className="p-4 sm:p-5 rounded-xl bg-[#121217] border border-brass-400/20 text-sm sm:text-[15px] text-neutral-200 font-sans leading-relaxed">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brass-300 block mb-1.5">
                  ФИЛОСОФСКИЙ ОРИЕНТИР
                </span>
                {activeArcanaCard.advice}
              </div>
            </div>
          )}

          {/* Life Path */}
          <div className="editorial-card rounded-2xl p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                ЧИСЛО ЖИЗНЕННОГО ПУТИ
              </span>
              <span className="font-mono text-base font-bold text-white">
                {report.lifePathNumber}
              </span>
            </div>
            <h4 className="font-serif text-xl text-white font-medium">{report.lifePathTitle}</h4>
            <p className="text-sm sm:text-base text-neutral-200 leading-relaxed font-sans">{report.lifePathDescription}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
