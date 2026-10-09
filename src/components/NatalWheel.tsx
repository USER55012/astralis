import React, { useState } from 'react';
import { AspectInfo, NatalChartData, PlanetPosition } from '../types/astrology';
import { ZODIAC_LIST, ZODIAC_SIGNS } from '../data/zodiacData';

interface NatalWheelProps {
  chart: NatalChartData;
}

export const NatalWheel: React.FC<NatalWheelProps> = ({ chart }) => {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetPosition | null>(null);
  const [hoveredAspect, setHoveredAspect] = useState<AspectInfo | null>(null);

  const size = 520;
  const center = size / 2;
  const radius = size * 0.44;
  const innerRadius = radius * 0.76;
  const centerCoreRadius = radius * 0.46;

  const ascDegree = chart.planets.find((p) => p.name === 'Ascendant')?.degree || 0;
  const rotationOffset = 180 - ascDegree;

  const degToAngle = (deg: number) => {
    return ((deg + rotationOffset) % 360) * (Math.PI / 180);
  };

  const getCoordinates = (deg: number, r: number) => {
    const angle = degToAngle(deg);
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center p-2">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
        >
          {/* Background circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="#0b0b0f"
            stroke="rgba(197, 168, 128, 0.4)"
            strokeWidth="1.2"
          />

          {/* 12 Zodiac Sectors */}
          {ZODIAC_LIST.map((signKey, i) => {
            const startAngle = degToAngle(i * 30);
            const endAngle = degToAngle((i + 1) * 30);
            const midAngle = degToAngle(i * 30 + 15);

            const signInfo = ZODIAC_SIGNS[signKey];

            const x1 = center + radius * Math.cos(startAngle);
            const y1 = center + radius * Math.sin(startAngle);
            const x2 = center + radius * Math.cos(endAngle);
            const y2 = center + radius * Math.sin(endAngle);

            const ix1 = center + innerRadius * Math.cos(startAngle);
            const iy1 = center + innerRadius * Math.sin(startAngle);
            const ix2 = center + innerRadius * Math.cos(endAngle);
            const iy2 = center + innerRadius * Math.sin(endAngle);

            const arcPath = `
              M ${x1} ${y1}
              A ${radius} ${radius} 0 0 1 ${x2} ${y2}
              L ${ix2} ${iy2}
              A ${innerRadius} ${innerRadius} 0 0 0 ${ix1} ${iy1}
              Z
            `;

            const glyphR = (radius + innerRadius) / 2;
            const gx = center + glyphR * Math.cos(midAngle);
            const gy = center + glyphR * Math.sin(midAngle);

            const isSunSign = chart.sunSign.name === signKey;

            return (
              <g key={signKey} className="group cursor-pointer">
                <path
                  d={arcPath}
                  fill={isSunSign ? 'rgba(197, 168, 128, 0.12)' : 'rgba(255, 255, 255, 0.01)'}
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="0.8"
                  className="transition-colors duration-200 group-hover:fill-white/[0.06]"
                />

                <line
                  x1={ix1}
                  y1={iy1}
                  x2={x1}
                  y2={y1}
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="0.8"
                />

                <text
                  x={gx}
                  y={gy + 5}
                  textAnchor="middle"
                  fill="#e4e4e7"
                  fontSize="16"
                  fontFamily="serif"
                >
                  {signInfo.symbol}
                </text>
              </g>
            );
          })}

          {/* Inner ring circle */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
          />

          {/* Central core circle */}
          <circle
            cx={center}
            cy={center}
            r={centerCoreRadius}
            fill="#070709"
            stroke="rgba(197, 168, 128, 0.3)"
            strokeWidth="1"
          />

          {/* Ascendant Marker (Horizontal 9:00 axis) */}
          <g>
            <line
              x1={center - radius}
              y1={center}
              x2={center - centerCoreRadius}
              y2={center}
              stroke="#c5a880"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
            <rect
              x={center - radius - 24}
              y={center - 9}
              width="22"
              height="18"
              rx="3"
              fill="#18181b"
              stroke="#c5a880"
              strokeWidth="0.8"
            />
            <text
              x={center - radius - 13}
              y={center + 3}
              textAnchor="middle"
              fill="#dfcaa7"
              fontSize="8"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ASC
            </text>
          </g>

          {/* Aspect Lines between planets */}
          {chart.aspects.map((asp, idx) => {
            const p1 = chart.planets.find((p) => p.name === asp.planet1);
            const p2 = chart.planets.find((p) => p.name === asp.planet2);
            if (!p1 || !p2) return null;

            const c1 = getCoordinates(p1.degree, centerCoreRadius - 4);
            const c2 = getCoordinates(p2.degree, centerCoreRadius - 4);
            const isHovered = hoveredAspect === asp || selectedPlanet?.name === asp.planet1 || selectedPlanet?.name === asp.planet2;

            const strokeColor = asp.nature === 'harmonious' ? '#d4d4d8' : asp.nature === 'tense' ? '#a1a1aa' : '#c5a880';

            return (
              <line
                key={idx}
                x1={c1.x}
                y1={c1.y}
                x2={c2.x}
                y2={c2.y}
                stroke={strokeColor}
                strokeWidth={isHovered ? 1.8 : 0.6}
                strokeOpacity={isHovered ? 0.9 : 0.22}
                strokeDasharray={asp.nature === 'tense' ? '2 2' : undefined}
                className="cursor-pointer transition-all"
                onMouseEnter={() => setHoveredAspect(asp)}
                onMouseLeave={() => setHoveredAspect(null)}
              />
            );
          })}

          {/* Center Title */}
          <text
            x={center}
            y={center - 4}
            textAnchor="middle"
            fill="#c5a880"
            fontSize="14"
            fontFamily="serif"
          >
            ☉
          </text>
          <text
            x={center}
            y={center + 12}
            textAnchor="middle"
            fill="#a1a1aa"
            fontSize="9"
            fontFamily="monospace"
            letterSpacing="2"
          >
            ASTRALIS
          </text>

          {/* Planet Markers along the wheel */}
          {chart.planets.map((planet) => {
            const planetR = innerRadius - 18;
            const pos = getCoordinates(planet.degree, planetR);
            const isSelected = selectedPlanet?.name === planet.name;

            return (
              <g
                key={planet.name}
                className="cursor-pointer"
                onClick={() => setSelectedPlanet(isSelected ? null : planet)}
                onMouseEnter={() => setSelectedPlanet(planet)}
              >
                {/* Connector tick */}
                {(() => {
                  const tickInner = getCoordinates(planet.degree, innerRadius);
                  const tickOuter = getCoordinates(planet.degree, innerRadius + 5);
                  return (
                    <line
                      x1={tickInner.x}
                      y1={tickInner.y}
                      x2={tickOuter.x}
                      y2={tickOuter.y}
                      stroke="#c5a880"
                      strokeWidth={isSelected ? 1.5 : 0.8}
                    />
                  );
                })()}

                {/* Planet Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 13 : 10}
                  fill="#121217"
                  stroke={isSelected ? '#dfcaa7' : '#71717a'}
                  strokeWidth={isSelected ? 1.8 : 1}
                  className="transition-all"
                />

                {/* Planet Glyph */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize={planet.name === 'Ascendant' ? '7' : '10'}
                  fontFamily="serif"
                >
                  {planet.symbol}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Active Planet Card */}
        {selectedPlanet && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#0e0e13]/95 border border-white/15 rounded-xl px-4 py-2.5 shadow-2xl text-center pointer-events-none transition-all max-w-[280px] w-full">
            <div className="flex items-center justify-center gap-2 mb-0.5">
              <span className="font-serif text-lg text-brass-300">{selectedPlanet.symbol}</span>
              <span className="font-serif text-white text-base font-medium">{selectedPlanet.nameRu}</span>
              <span className="text-xs text-neutral-300 font-mono">в {selectedPlanet.signRu}</span>
            </div>
            <p className="text-xs text-neutral-300 font-mono">
              {selectedPlanet.degreeInSign}°{selectedPlanet.minuteInSign}′ • {selectedPlanet.house} Дом
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-5 mt-2 text-xs font-mono text-neutral-300">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neutral-200" /> Гармония (Трин/Секстиль)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-neutral-400" /> Полярность (Квадрат/Оппозиция)
        </span>
      </div>
    </div>
  );
};
