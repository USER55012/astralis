import React from 'react';
import { NatalChartData } from '../types/astrology';

interface PsychologicalPortraitProps {
  chart: NatalChartData;
}

export const PsychologicalPortrait: React.FC<PsychologicalPortraitProps> = ({ chart }) => {
  const sunSign = chart.sunSign;
  const venusPos = chart.planets.find((p) => p.name === 'Venus');
  const marsPos = chart.planets.find((p) => p.name === 'Mars');
  const mercPos = chart.planets.find((p) => p.name === 'Mercury');

  return (
    <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="border-b border-white/[0.08] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
            PSYCHOLOGICAL COMPASS
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-white mt-0.5">
            Психологический Портрет: {chart.name}
          </h3>
        </div>
        <div className="text-[11px] font-mono text-neutral-400">
          СИНТЕЗ {sunSign.nameRu} × {chart.moonSign.nameRu}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Work / Execution */}
        <div className="p-6 rounded-xl bg-[#121217] border border-white/[0.06] space-y-2.5">
          <div className="text-[10px] font-mono tracking-wider uppercase text-neutral-400">
            01 · РЕАЛИЗАЦИЯ & ПРОФЕССИЯ
          </div>
          <h4 className="font-serif text-lg sm:text-xl text-white font-medium">Марс ♂ в {marsPos?.signRu}</h4>
          <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
            Высокий порог толерантности к сложным нетривиальным задачам. Не переносит бюрократический формализм: раскрывает потенциал там, где есть свобода решений и качественный осязаемый результат.
          </p>
        </div>

        {/* Flirt & Relational */}
        <div className="p-6 rounded-xl bg-[#121217] border border-white/[0.06] space-y-2.5">
          <div className="text-[10px] font-mono tracking-wider uppercase text-brass-300">
            02 · ЧУВСТВЕННОСТЬ & СТИЛЬ
          </div>
          <h4 className="font-serif text-lg sm:text-xl text-white font-medium">Венера ♀ в {venusPos?.signRu}</h4>
          <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
            Влечение формируется через интеллект и взаимную деликатность. Не склонен к демонстративным эффектам: симпатию проявляет через внимательность к деталям, тонкую иронию и преданность.
          </p>
        </div>

        {/* Mind & Communication */}
        <div className="p-6 rounded-xl bg-[#121217] border border-white/[0.06] space-y-2.5">
          <div className="text-[10px] font-mono tracking-wider uppercase text-neutral-400">
            03 · КОГНИТИВНЫЙ РИТМ
          </div>
          <h4 className="font-serif text-lg sm:text-xl text-white font-medium">Меркурий ☿ в {mercPos?.signRu}</h4>
          <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
            Быстрое схватывание структуры в хаотичной информации. Умение формулировать мысль емко и точно, удерживая баланс между логикой и интуитивным чутьем.
          </p>
        </div>

        {/* Mental Recharging */}
        <div className="p-6 rounded-xl bg-[#121217] border border-white/[0.06] space-y-2.5">
          <div className="text-[10px] font-mono tracking-wider uppercase text-neutral-400">
            04 · РЕКУПЕРАЦИЯ ЭНЕРГИИ
          </div>
          <h4 className="font-serif text-lg sm:text-xl text-white font-medium">Луна ☽ в {chart.moonSign.nameRu}</h4>
          <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
            Перезагрузка требует приватного пространства без сенсорного шума: глубокая музыка, качественный кофе или камерный разговор с близким человеком.
          </p>
        </div>

        {/* What resonates deeply */}
        <div className="p-6 rounded-xl bg-[#121217] border border-brass-400/20 space-y-2.5 md:col-span-2">
          <div className="text-[10px] font-mono tracking-wider uppercase text-brass-300">
            05 · ТОЧКА РЕЗОНАНСА
          </div>
          <h4 className="font-serif text-lg sm:text-xl text-white font-medium">Аутентичный интерес и уважение</h4>
          <p className="text-base sm:text-[16px] text-neutral-200 leading-relaxed font-sans">
            Высоко ценит подлинный интерес к его взглядам и уважение к личным границам. Спонтанное приглашение обсудить интересную тему в спокойной обстановке считывается как искренний и точный шаг.
          </p>
        </div>
      </div>
    </div>
  );
};
