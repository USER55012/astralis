import React from 'react';

interface ElementalBalanceProps {
  elements: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  modalities: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
}

export const ElementalBalance: React.FC<ElementalBalanceProps> = ({ elements, modalities }) => {
  const elementItems = [
    {
      name: 'Огонь (Ignis)',
      symbol: '△',
      percent: elements.fire,
      desc: 'Волевой импульс, витальность, инициатива',
    },
    {
      name: 'Земля (Terra)',
      symbol: '▽',
      percent: elements.earth,
      desc: 'Материализация, опора, прагматизм',
    },
    {
      name: 'Воздух (Aer)',
      symbol: '△̄',
      percent: elements.air,
      desc: 'Концептуализация, язык, ментальная подвижность',
    },
    {
      name: 'Вода (Aqua)',
      symbol: '▽̄',
      percent: elements.water,
      desc: 'Глубинная перцепция, эмпатия, бессознательное',
    },
  ];

  return (
    <div className="editorial-card rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 block">
            ELEMENTAL DISTRIBUTION
          </span>
          <h4 className="font-serif text-2xl text-white font-normal mt-0.5">
            Баланс Первичных Стихий
          </h4>
        </div>
        <span className="text-[11px] font-mono text-neutral-400">
          ТЕМПЕРАМЕНТ
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {elementItems.map((item) => (
          <div
            key={item.name}
            className="p-5 rounded-xl bg-[#121217] border border-white/[0.06] space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-lg text-white font-medium flex items-center gap-2">
                <span className="text-brass-300 font-mono text-sm">{item.symbol}</span> {item.name}
              </span>
              <span className="font-mono text-sm text-neutral-200 font-medium">{item.percent}%</span>
            </div>
            <div className="w-full bg-white/[0.06] rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-neutral-300 rounded-full transition-all duration-700"
                style={{ width: `${Math.max(4, item.percent)}%` }}
              />
            </div>
            <p className="text-sm sm:text-[15px] text-neutral-300 font-sans leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Modalities */}
      <div className="pt-2 border-t border-white/[0.06]">
        <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 mb-3">
          MODAL DYNAMICS · СТРАТЕГИЯ ДЕЙСТВИЯ
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-[#121217] border border-white/[0.06] text-center space-y-0.5">
            <div className="font-mono text-sm font-medium text-white">{modalities.cardinal}%</div>
            <div className="text-xs sm:text-sm font-serif text-neutral-200">Кардинальный</div>
            <div className="text-xs text-neutral-400">Инициация</div>
          </div>
          <div className="p-4 rounded-xl bg-[#121217] border border-white/[0.06] text-center space-y-0.5">
            <div className="font-mono text-sm font-medium text-white">{modalities.fixed}%</div>
            <div className="text-xs sm:text-sm font-serif text-neutral-200">Фиксированный</div>
            <div className="text-xs text-neutral-400">Концентрация</div>
          </div>
          <div className="p-4 rounded-xl bg-[#121217] border border-white/[0.06] text-center space-y-0.5">
            <div className="font-mono text-sm font-medium text-white">{modalities.mutable}%</div>
            <div className="text-xs sm:text-sm font-serif text-neutral-200">Мутабельный</div>
            <div className="text-xs text-neutral-400">Адаптация</div>
          </div>
        </div>
      </div>
    </div>
  );
};
