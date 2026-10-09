import React, { useState } from 'react';
import { MAJOR_ARCANA } from '../data/tarotData';
import { TarotCard } from '../types/astrology';
import { playMysticGong, playCosmicChime } from '../utils/sound';
import { RefreshCw } from 'lucide-react';

export const TarotDailyView: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const drawCard = (cardIndex?: number) => {
    playMysticGong();
    setIsFlipped(false);

    setTimeout(() => {
      const idx = typeof cardIndex === 'number'
        ? cardIndex
        : Math.floor(Math.random() * MAJOR_ARCANA.length);
      setSelectedCard(MAJOR_ARCANA[idx]);
      setIsFlipped(true);
    }, 400);
  };

  const handleReset = () => {
    playCosmicChime();
    setIsFlipped(false);
    setSelectedCard(null);
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto text-center">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 block">
          ORACULUM COELESTE · АРХЕТИП ДНЯ
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-wide">
          Оракул: Архетипическая Карта
        </h2>
        <p className="text-base sm:text-lg text-neutral-200 max-w-xl mx-auto leading-relaxed font-sans">
          Сформулируйте мысленный фокус (контакт, важное решение, внутреннее состояние) и извлеките карту 22 Старших Арканов.
        </p>
      </div>

      {/* Deck Selection Fan */}
      {!selectedCard ? (
        <div className="py-8 space-y-8">
          <div className="flex items-center justify-center gap-4 py-4">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                onClick={() => drawCard()}
                className={`w-36 sm:w-44 h-56 sm:h-64 rounded-xl bg-[#0e0e13] border border-white/15 shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:border-brass-400/60 flex flex-col items-center justify-center p-3 relative group ${
                  idx === 0 ? '-rotate-3' : idx === 2 ? 'rotate-3' : 'rotate-0'
                }`}
              >
                <div className="w-full h-full border border-white/[0.08] rounded-lg flex flex-col items-center justify-center p-2 relative bg-[radial-gradient(rgba(197,168,128,0.15)_1px,transparent_1px)] [background-size:16px_16px]">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-brass-300 font-serif text-lg">
                    ☉
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 mt-4 group-hover:text-white transition-colors">
                    ИЗВЛЕЧЬ КАРТУ
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => drawCard()}
            className="px-6 py-2.5 rounded-xl bg-white text-black font-mono text-xs tracking-wider uppercase font-semibold hover:bg-neutral-200 transition-all cursor-pointer shadow-md"
          >
            Извлечь карту наугад
          </button>
        </div>
      ) : (
        <div className="py-4 space-y-6">
          <div
            className={`max-w-md mx-auto editorial-card rounded-2xl p-6 sm:p-8 space-y-5 text-left border-brass-400/30 transition-all duration-500 ${
              isFlipped ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brass-300">
                  АРКАН {selectedCard.romanNumeral}
                </span>
                <h3 className="font-serif text-3xl font-normal text-white mt-0.5">
                  {selectedCard.nameRu}
                </h3>
                <span className="text-xs text-neutral-400 font-mono">{selectedCard.nameEn}</span>
              </div>
              <div className="w-10 h-10 rounded-lg border border-white/15 flex items-center justify-center font-serif text-lg text-brass-300">
                {selectedCard.number}
              </div>
            </div>

            <blockquote className="text-sm sm:text-base text-neutral-200 italic border-l-2 border-brass-400/60 pl-4 py-1.5 leading-relaxed">
              {selectedCard.quote}
            </blockquote>

            <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
              {selectedCard.meaning}
            </p>

            <div className="space-y-3 pt-1 text-xs">
              <div className="p-4 rounded-xl bg-[#121217] border border-white/[0.06] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  ВЗАИМОДЕЙСТВИЕ & КОНТАКТ
                </span>
                <p className="text-neutral-200 text-sm sm:text-[15px] leading-relaxed font-sans">
                  {selectedCard.loveMeaning}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#121217] border border-white/[0.06] space-y-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  ДЕЛА & ФОКУС
                </span>
                <p className="text-neutral-200 text-sm sm:text-[15px] leading-relaxed font-sans">
                  {selectedCard.workMeaning}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 rounded-xl bg-[#121217] border border-brass-400/20 text-sm sm:text-[15px] text-neutral-200 font-sans leading-relaxed">
              <span className="text-[10px] font-mono uppercase tracking-wider text-brass-300 block mb-1.5">
                ОРИЕНТИР ВСЕЛЕННОЙ
              </span>
              {selectedCard.advice}
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-xs font-mono text-neutral-400 hover:text-white transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                ВЫТЯНУТЬ ДРУГУЮ КАРТУ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
