import React, { useState } from 'react';
import { NatalChartData, SynastryResult } from '../types/astrology';
import { calculateSynastry } from '../utils/synastry';
import { POPULAR_CITIES } from '../data/cities';
import { calculateNatalChart } from '../utils/astronomy';
import { playStardustHarp, playCosmicChime } from '../utils/sound';
import { Copy, Check, ArrowRight } from 'lucide-react';
import { CelestialLoadingModal } from './CelestialLoadingModal';

interface SynastryViewProps {
  initialPerson1?: NatalChartData;
}

export const SynastryView: React.FC<SynastryViewProps> = ({ initialPerson1 }) => {
  // Person 1 (He / User)
  const [p1Name, setP1Name] = useState(initialPerson1?.name || 'Ты');
  const [p1Date, setP1Date] = useState(initialPerson1?.birthDate || '1998-05-14');
  const [p1Time, setP1Time] = useState(initialPerson1?.birthTime || '14:30');
  const [p1City, setP1City] = useState(initialPerson1?.cityName || 'Москва');

  // Person 2 (She / Colleague)
  const [p2Name, setP2Name] = useState('Она');
  const [p2Date, setP2Date] = useState('1999-09-21');
  const [p2Time, setP2Time] = useState('10:15');
  const [p2City, setP2City] = useState('Лотошино');

  const [isLoading, setIsLoading] = useState(false);

  const [synastryResult, setSynastryResult] = useState<SynastryResult | null>(() => {
    if (initialPerson1) {
      const cityP2 = POPULAR_CITIES.find((c) => c.name === 'Лотошино') || POPULAR_CITIES[0];
      const p2Chart = calculateNatalChart({
        name: 'Она',
        birthDate: '1999-09-21',
        birthTime: '10:15',
        cityName: cityP2.name,
        latitude: cityP2.lat,
        longitude: cityP2.lon,
        timezone: cityP2.tz,
      });
      return calculateSynastry(initialPerson1, p2Chart);
    }
    return null;
  });

  const [copied, setCopied] = useState(false);

  const handleCalculate = () => {
    setIsLoading(true);
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
    playStardustHarp();

    const city1 = POPULAR_CITIES.find((c) => c.name === p1City) || POPULAR_CITIES[0];
    const city2 = POPULAR_CITIES.find((c) => c.name === p2City) || POPULAR_CITIES[0];

    const chart1 = calculateNatalChart({
      name: p1Name,
      birthDate: p1Date,
      birthTime: p1Time || '12:00',
      cityName: city1.name,
      latitude: city1.lat,
      longitude: city1.lon,
      timezone: city1.tz,
    });

    const chart2 = calculateNatalChart({
      name: p2Name,
      birthDate: p2Date,
      birthTime: p2Time || '12:00',
      cityName: city2.name,
      latitude: city2.lat,
      longitude: city2.lon,
      timezone: city2.tz,
    });

    const res = calculateSynastry(chart1, chart2);
    setSynastryResult(res);
  };

  const handleCopyVerdict = () => {
    if (!synastryResult) return;
    playCosmicChime();

    const textToCopy = `ASTRALIS · СИНАСТРИЧЕСКИЙ РЕЗОНАНС (${synastryResult.totalScore}%)
${synastryResult.person1.name} (${synastryResult.person1.sunSign.nameRu}) × ${synastryResult.person2.name} (${synastryResult.person2.sunSign.nameRu})

· Полярность и притяжение (Венера/Марс): ${synastryResult.chemistryScore}%
· Ментальный ритм и диалог (Меркурий): ${synastryResult.mindScore}%
· Эмоциональная глубина (Луна/Солнце): ${synastryResult.soulScore}%
· Архитипический союз: ${synastryResult.pairArcana.title}

«${synastryResult.overallVerdict}»

P.S. Звезды редко сходятся в столь выверенную геометрию. Предлагаю обсудить координаты за кофе.`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 block">
          SYNASTRIC COUPLING & POLARITY
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-wide">
          Синастрия: Геометрия Двух Орбит
        </h2>
        <p className="text-base sm:text-lg text-neutral-200 max-w-2xl mx-auto leading-relaxed font-sans">
          Анализ взаимного гравитационного притяжения двух карт: вектор эротического магнетизма, когнитивная совместимость и глубинная полярность.
        </p>
      </div>

      {/* Dual Input Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Person 1 */}
        <div className="editorial-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-200">
              01 · СУБЪЕКТ I ({p1Name})
            </span>
            <span className="text-[10px] font-mono text-brass-300">ПЕРВИЧНАЯ КАРТА</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1">
                Имя
              </label>
              <input
                type="text"
                value={p1Name}
                onChange={(e) => setP1Name(e.target.value)}
                className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1">
                  Дата
                </label>
                <input
                  type="date"
                  value={p1Date}
                  onChange={(e) => setP1Date(e.target.value)}
                  className="w-full bg-[#121217] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1">
                  Время (Асцендент)
                </label>
                <input
                  type="time"
                  value={p1Time}
                  onChange={(e) => setP1Time(e.target.value)}
                  className="w-full bg-[#121217] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1">
                Город
              </label>
              <select
                value={p1City}
                onChange={(e) => setP1City(e.target.value)}
                className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50"
              >
                {POPULAR_CITIES.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#121217] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Person 2 */}
        <div className="editorial-card rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <span className="font-mono text-xs uppercase tracking-wider text-neutral-200">
              02 · СУБЪЕКТ II ({p2Name})
            </span>
            <span className="text-[10px] font-mono text-brass-300">ВТОРИЧНАЯ КАРТА</span>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1">
                Имя
              </label>
              <input
                type="text"
                value={p2Name}
                onChange={(e) => setP2Name(e.target.value)}
                className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1">
                  Дата
                </label>
                <input
                  type="date"
                  value={p2Date}
                  onChange={(e) => setP2Date(e.target.value)}
                  className="w-full bg-[#121217] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1">
                  Время (по возможности)
                </label>
                <input
                  type="time"
                  value={p2Time}
                  onChange={(e) => setP2Time(e.target.value)}
                  className="w-full bg-[#121217] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50 font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-neutral-300 mb-1">
                Город
              </label>
              <select
                value={p2City}
                onChange={(e) => setP2City(e.target.value)}
                className="w-full bg-[#121217] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-brass-400/50"
              >
                {POPULAR_CITIES.map((c) => (
                  <option key={c.name} value={c.name} className="bg-[#121217] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={handleCalculate}
          className="px-8 py-3 rounded-xl bg-white text-black font-mono text-xs tracking-widest uppercase font-semibold hover:bg-neutral-200 transition-all cursor-pointer shadow-lg inline-flex items-center gap-2"
        >
          <span>Рассчитать Синастрический Резонанс</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Results */}
      {synastryResult && (
        <div className="space-y-8 animate-fade-in">
          {/* Main Score Index Card */}
          <div className="editorial-card rounded-2xl p-8 sm:p-10 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 text-[10px] font-mono tracking-widest uppercase text-neutral-400">
              RESONANCE INDEX
            </div>

            <div>
              <div className="font-serif text-6xl sm:text-7xl font-light text-white tracking-tight">
                {synastryResult.totalScore}<span className="text-3xl text-brass-400 font-mono">%</span>
              </div>
              <div className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400 mt-2">
                ГРАВИТАЦИОННЫЙ РЕЗОНАНС ОРБИТ
              </div>
            </div>

            <div className="font-serif text-xl sm:text-2xl text-neutral-200 max-w-2xl mx-auto leading-relaxed font-normal">
              {synastryResult.person1.name} ({synastryResult.person1.sunSign.nameRu}) & {synastryResult.person2.name} ({synastryResult.person2.sunSign.nameRu})
            </div>

            <p className="text-base sm:text-lg text-neutral-100 max-w-2xl mx-auto leading-relaxed font-sans border-t border-b border-white/[0.08] py-4">
              {synastryResult.overallVerdict}
            </p>

            <button
              onClick={handleCopyVerdict}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs tracking-wider uppercase transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Скопировано в буфер' : 'Экспортировать текст для диалога'}
            </button>
          </div>

          {/* 4 Architectural Dimension Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Erotic/Polarity */}
            <div className="editorial-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                  01 · ПОЛЯРНОСТЬ
                </span>
                <span className="font-mono text-xs text-brass-300 font-medium">
                  {synastryResult.chemistryScore}%
                </span>
              </div>
              <h4 className="font-serif text-lg sm:text-xl text-white font-medium">Венера ♀ & Марс ♂</h4>
              <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
                Вектор влечения и невербального магнетизма. Сочетание планет создает отчетливое чувственное напряжение при зрительном контакте.
              </p>
            </div>

            {/* 2. Cognitive */}
            <div className="editorial-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                  02 · ДИАЛОГ
                </span>
                <span className="font-mono text-xs text-neutral-200 font-medium">
                  {synastryResult.mindScore}%
                </span>
              </div>
              <h4 className="font-serif text-lg sm:text-xl text-white font-medium">Меркурий ☿</h4>
              <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
                Синхронность когнитивных ритмов. Одинаковое чувство подтекста, легкое считывание иронии и отсутствие затяжных пауз в общении.
              </p>
            </div>

            {/* 3. Emotional */}
            <div className="editorial-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                  03 · БЕЗОПАСНОСТЬ
                </span>
                <span className="font-mono text-xs text-neutral-200 font-medium">
                  {synastryResult.soulScore}%
                </span>
              </div>
              <h4 className="font-serif text-lg sm:text-xl text-white font-medium">Луна ☽ & Солнце ☉</h4>
              <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
                Психический комфорт. Способность расслабляться в присутствии друг друга без необходимости поддерживать фасад социального статуса.
              </p>
            </div>

            {/* 4. Karmic */}
            <div className="editorial-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400">
                  04 · АРХЕТИП
                </span>
                <span className="font-mono text-xs text-brass-300 font-medium">
                  {synastryResult.karmicScore}%
                </span>
              </div>
              <h4 className="font-serif text-lg sm:text-xl text-white font-medium">{synastryResult.pairArcana.title}</h4>
              <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
                Философский вектор пары. Союз стимулирует творческую автономию и подталкивает к взаимному личностному росту.
              </p>
            </div>
          </div>

          {/* Deep Psychological Insight */}
          <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-3 border-brass-400/20">
            <span className="text-[10px] font-mono tracking-widest uppercase text-brass-300 block">
              PSYCHOLOGICAL ANCHOR · ОПТИКА ЕЁ ЗНАКА ({synastryResult.person2.sunSign.nameRu})
            </span>
            <h4 className="font-serif text-2xl text-white font-normal">
              Архитектура контакта и точки входа
            </h4>
            <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-sans">
              {synastryResult.flirtKey}
            </p>
          </div>
        </div>
      )}

      <CelestialLoadingModal
        isOpen={isLoading}
        onComplete={handleLoadingComplete}
        mode="synastry"
        title="СИНАСТРИЧЕСКАЯ ИНТЕГРАЦИЯ"
        subtitle={`Сопоставление орбитальных эфемерид: ${p1Name} × ${p2Name}`}
      />
    </div>
  );
};
