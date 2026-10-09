import React, { useState } from 'react';
import { StarfieldCanvas } from './components/StarfieldCanvas';
import { Navbar, ActiveTab } from './components/Navbar';
import { NatalForm } from './components/NatalForm';
import { NatalWheel } from './components/NatalWheel';
import { NatalSphere3D } from './components/NatalSphere3D';
import { BigThreeCard } from './components/BigThreeCard';
import { ElementalBalance } from './components/ElementalBalance';
import { PlanetPositionsTable } from './components/PlanetPositionsTable';
import { PsychologicalPortrait } from './components/PsychologicalPortrait';
import { SynastryView } from './components/SynastryView';
import { NumerologyMatrixView } from './components/NumerologyMatrixView';
import { TarotDailyView } from './components/TarotDailyView';
import { calculateNatalChart } from './utils/astronomy';
import { POPULAR_CITIES } from './data/cities';
import { NatalChartData } from './types/astrology';
import { ArrowRight } from 'lucide-react';
import { playCosmicChime } from './utils/sound';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('natal');
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  // Default initial chart
  const defaultCity = POPULAR_CITIES.find((c) => c.name === 'Москва') || POPULAR_CITIES[0];
  const [chart, setChart] = useState<NatalChartData>(() =>
    calculateNatalChart({
      name: 'Ты',
      birthDate: '1998-05-14',
      birthTime: '14:30',
      cityName: defaultCity.name,
      latitude: defaultCity.lat,
      longitude: defaultCity.lon,
      timezone: defaultCity.tz,
    })
  );

  const handleCalculateNatal = (params: {
    name: string;
    birthDate: string;
    birthTime: string;
    cityName: string;
    latitude: number;
    longitude: number;
    timezone: number;
  }) => {
    const newChart = calculateNatalChart(params);
    setChart(newChart);
  };

  const handleGoToSynastry = () => {
    playCosmicChime();
    setActiveTab('synastry');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#e4e4e7] flex flex-col relative selection:bg-[#c5a880]/30 selection:text-white">
      {/* Background Stardust */}
      <StarfieldCanvas />

      {/* Top Navbar */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-10">
        {/* TAB 1: NATAL CHART */}
        {activeTab === 'natal' && (
          <div className="space-y-10 animate-fade-in">
            {/* Editorial Hero Header */}
            <div className="text-center space-y-3 pt-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 block">
                CELESTIAL EPHEMERIS · {chart.cityName.toUpperCase()} ({chart.birthDate})
              </span>
              <h1 className="font-serif text-3xl sm:text-5xl text-white tracking-wide font-normal">
                Натальный Синтез: {chart.name}
              </h1>
              <div className="text-sm sm:text-base font-mono text-neutral-200 tracking-wider">
                ☉ {chart.sunSign.nameRu.toUpperCase()} · ☽ {chart.moonSign.nameRu.toUpperCase()} · ASC {chart.ascendantSign.nameRu.toUpperCase()} ({chart.birthTime})
              </div>
            </div>

            {/* Input Form */}
            <NatalForm
              onCalculate={handleCalculateNatal}
              currentValues={{
                name: chart.name,
                birthDate: chart.birthDate,
                birthTime: chart.birthTime,
                cityName: chart.cityName,
              }}
            />

            {/* Big Three (Sun, Moon, Ascendant) */}
            <BigThreeCard chart={chart} />

            {/* Interactive Visualizer Section (3D WebGL vs 2D) */}
            <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                    CELESTIAL INSTRUMENTATION
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-white mt-0.5">
                    {viewMode === '3d' ? '3D Армиллярная Сфера Небес' : 'Геоцентрическое Колесо Зодиака 2D'}
                  </h3>
                  <p className="text-base sm:text-lg text-neutral-200 mt-2 font-sans leading-relaxed">
                    {viewMode === '3d'
                      ? 'Вращайте сферу в 3D пространстве мышью, масштабируйте колесиком и исследуйте реальные углы небесных тел.'
                      : 'Плоская геоцентрическая проекция астрологических домов и долгот планет.'}
                  </p>
                </div>

                {/* 3D vs 2D Toggle */}
                <div className="inline-flex items-center gap-1 p-1 bg-[#121217] rounded-xl border border-white/10 self-start sm:self-auto font-mono text-xs">
                  <button
                    onClick={() => {
                      playCosmicChime(1.1);
                      setViewMode('3d');
                    }}
                    className={`px-3 py-1.5 rounded-lg tracking-wider transition-all cursor-pointer ${
                      viewMode === '3d'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    СФЕРА 3D
                  </button>
                  <button
                    onClick={() => {
                      playCosmicChime(1.0);
                      setViewMode('2d');
                    }}
                    className={`px-3 py-1.5 rounded-lg tracking-wider transition-all cursor-pointer ${
                      viewMode === '2d'
                        ? 'bg-white text-black font-semibold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    КОЛЕСО 2D
                  </button>
                </div>
              </div>

              {/* Visualizer Display */}
              {viewMode === '3d' ? (
                <NatalSphere3D chart={chart} />
              ) : (
                <div className="flex justify-center py-4">
                  <NatalWheel chart={chart} />
                </div>
              )}

              {/* Synastry Teaser Banner */}
              <div className="p-5 sm:p-6 rounded-xl bg-[#121217] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brass-300 block">
                    COUPLED DYNAMICS
                  </span>
                  <div className="font-serif text-xl sm:text-2xl text-white font-medium">
                    Анализ Синастрии & Совместимости
                  </div>
                  <p className="text-base sm:text-lg text-neutral-200 max-w-2xl font-sans leading-relaxed">
                    Коллега уточнила дату и точный час рождения? Рассчитайте взаимную гравитацию ваших карт и оптику её психотипа.
                  </p>
                </div>
                <button
                  onClick={handleGoToSynastry}
                  className="px-5 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-mono text-xs tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer shrink-0 inline-flex items-center gap-2"
                >
                  <span>Перейти к синастрии</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Elemental Balance */}
            <ElementalBalance
              elements={chart.elementsBalance}
              modalities={chart.modalitiesBalance}
            />

            {/* Psychological Portrait */}
            <PsychologicalPortrait chart={chart} />

            {/* Detailed Planet Positions Table */}
            <PlanetPositionsTable planets={chart.planets} />
          </div>
        )}

        {/* TAB 2: SYNASTRY & COMPATIBILITY */}
        {activeTab === 'synastry' && (
          <div className="animate-fade-in">
            <SynastryView initialPerson1={chart} />
          </div>
        )}

        {/* TAB 3: NUMEROLOGY & MATRIX OF DESTINY */}
        {activeTab === 'matrix' && (
          <div className="animate-fade-in">
            <NumerologyMatrixView birthDate={chart.birthDate} />
          </div>
        )}

        {/* TAB 4: TAROT DAILY & ORACLE */}
        {activeTab === 'tarot' && (
          <div className="animate-fade-in">
            <TarotDailyView />
          </div>
        )}
      </main>

      {/* Editorial Minimalist Footer */}
      <footer className="border-t border-white/[0.08] bg-[#070709] py-8 px-4 text-xs text-neutral-400 relative z-10 mt-16 font-mono">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-serif text-sm">
            <span>ASTRALIS · CELESTIAL EPHEMERIS</span>
          </div>
          <div className="text-[11px] text-neutral-500">
            ASTRONOMIA NATURALIS & DEPTH PSYCHOLOGY
          </div>
          <div className="text-[11px] text-neutral-400">
            {chart.name} · {chart.cityName}
          </div>
        </div>
      </footer>
    </div>
  );
};
