import React, { useEffect, useState } from 'react';
import { playCosmicChime, playMysticGong } from '../utils/sound';
import { FastForward } from 'lucide-react';

interface CelestialLoadingModalProps {
  isOpen: boolean;
  onComplete: () => void;
  title?: string;
  subtitle?: string;
  mode?: 'natal' | 'synastry';
}

export const CelestialLoadingModal: React.FC<CelestialLoadingModalProps> = ({
  isOpen,
  onComplete,
  title = 'СИНТЕЗ НАТАЛЬНЫХ ЭФЕМЕРИД',
  subtitle = 'Калибровка небесных координат по широте, долготе и часу',
  mode = 'natal',
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const natalSteps = [
    'СИНХРОНИЗАЦИЯ ЮЛИАНСКОГО ДНЯ И ЗВЕЗДНОГО ВРЕМЕНИ (GST)',
    'ВЫЧИСЛЕНИЕ ВОСХОДЯЩЕГО ГРАДУСА ГОРИЗОНТА (ASCENDANT)',
    'ОПРЕДЕЛЕНИЕ ЭКЛИПТИЧЕСКИХ ДОЛГОТ 11 НЕБЕСНЫХ ТЕЛ',
    'ТОПОЦЕНТРИЧЕСКАЯ ТРИАНГУЛЯЦИЯ ДОМОВ И СТИХИЙ',
    'ГАРМОНИЗАЦИЯ 22 САКРАЛЬНЫХ АРХЕТИПОВ МАТРИЦЫ',
  ];

  const synastrySteps = [
    'СОПОСТАВЛЕНИЕ ГЕОЦЕНТРИЧЕСКИХ КООРДИНАТ ДВУХ СУБЪЕКТОВ',
    'ВЫЧИСЛЕНИЕ ВЕНЕРИАНСКО-МАРСИАНСКОГО ВЕКТОРА ПОЛЯРНОСТИ',
    'АНАЛИЗ МЕНТАЛЬНОГО РЕЗОНАНСА МЕРКУРИЯ И СОЛНЦА',
    'РАСЧЕТ ЛУННОГО ПСИХИЧЕСКОГО КОМФОРТА И БЕЗОПАСНОСТИ',
    'СИНТЕЗ КАРМИЧЕСКОГО АРХЕТИПА И ГРАВИТАЦИОННОГО ИНДЕКСА',
  ];

  const steps = mode === 'synastry' ? synastrySteps : natalSteps;

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setCurrentStepIndex(0);
      return;
    }

    playMysticGong();

    let currentP = 0;
    const interval = setInterval(() => {
      // Natural organic pacing: slower around 35%, 68%, 88%
      let increment = Math.floor(Math.random() * 3) + 2; // 2-4%
      if (currentP > 30 && currentP < 38) increment = 1;
      if (currentP > 60 && currentP < 70) increment = 1;
      if (currentP > 86 && currentP < 94) increment = 1;

      currentP += increment;

      if (currentP >= 100) {
        currentP = 100;
        setProgress(100);
        setCurrentStepIndex(steps.length - 1);
        clearInterval(interval);
        setTimeout(() => {
          playCosmicChime(1.3);
          onComplete();
        }, 600);
      } else {
        setProgress(currentP);
        const nextStep = Math.min(
          steps.length - 1,
          Math.floor((currentP / 100) * steps.length)
        );
        setCurrentStepIndex(nextStep);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isOpen, steps.length, onComplete, mode]);

  const handleAccelerate = () => {
    playCosmicChime(1.4);
    setProgress(100);
    setTimeout(() => {
      onComplete();
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl animate-fade-in p-4 select-none">
      <div className="relative max-w-lg w-full bg-[#0b0b0f] border border-white/15 rounded-3xl p-8 sm:p-10 shadow-[0_0_80px_rgba(0,0,0,0.9)] text-center space-y-8 overflow-hidden">
        {/* Subtle background astrolabe watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-96 h-96 rounded-full border border-white animate-spin-slow" />
        </div>

        {/* Top Monospace Tag */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono tracking-widest uppercase text-brass-300">
            <span className="w-1.5 h-1.5 rounded-full bg-brass-400 animate-pulse" />
            CALCULATING EPHEMERIS
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white tracking-wide">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-neutral-300 font-sans max-w-md mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Central Rotating Astrolabe Instrument */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-white/20 animate-spin-slow" />
          {/* Middle dashed ring */}
          <div className="absolute inset-4 rounded-full border border-dashed border-brass-400/40 animate-spin-reverse-slow" />
          {/* Inner ring */}
          <div className="absolute inset-10 rounded-full border border-white/30" />
          {/* Center core with percentage */}
          <div className="flex flex-col items-center justify-center z-10">
            <span className="font-serif text-3xl font-light text-white tracking-tight">
              {progress}<span className="text-sm font-mono text-brass-300">%</span>
            </span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400 mt-0.5">
              SYNTHESIS
            </span>
          </div>
        </div>

        {/* Progress Bar & Current Phase Log */}
        <div className="space-y-3">
          <div className="w-full bg-white/[0.06] rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-neutral-300 via-brass-300 to-white transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="min-h-[38px] flex items-center justify-center">
            <p className="text-xs sm:text-sm font-mono tracking-wider transition-all animate-fade-in text-neutral-200">
              {progress >= 100 ? (
                <span className="text-brass-300 font-medium">✓ СИНТЕЗ ЗАВЕРШЕН · ИНИЦИАЛИЗАЦИЯ ЭФЕМЕРИД...</span>
              ) : (
                <span>[{currentStepIndex + 1}/5] {steps[currentStepIndex]}</span>
              )}
            </p>
          </div>
        </div>

        {/* Interactive button to accelerate */}
        <div className="pt-1">
          <button
            onClick={handleAccelerate}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-xs font-mono tracking-wider uppercase text-neutral-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
          >
            <FastForward className="w-3.5 h-3.5" />
            Ускорить синтез
          </button>
        </div>
      </div>
    </div>
  );
};
