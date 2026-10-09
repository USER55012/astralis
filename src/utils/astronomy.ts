import {
  AspectInfo,
  ElementType,
  HouseCusp,
  ModalityType,
  NatalChartData,
  PlanetName,
  PlanetPosition,
  ZodiacSignName,
} from '../types/astrology';
import { ZODIAC_LIST, ZODIAC_SIGNS } from '../data/zodiacData';
import { calculateNumerology } from './numerology';

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

function normalizeDeg(deg: number): number {
  let d = deg % 360;
  if (d < 0) d += 360;
  return d;
}

export function degToZodiac(deg: number): {
  sign: ZodiacSignName;
  signRu: string;
  degreeInSign: number;
  minuteInSign: number;
} {
  const norm = normalizeDeg(deg);
  const signIndex = Math.floor(norm / 30);
  const signName = ZODIAC_LIST[signIndex % 12];
  const totalDegInSign = norm - signIndex * 30;
  const degreeInSign = Math.floor(totalDegInSign);
  const minuteInSign = Math.floor((totalDegInSign - degreeInSign) * 60);

  return {
    sign: signName,
    signRu: ZODIAC_SIGNS[signName].nameRu,
    degreeInSign,
    minuteInSign,
  };
}

// Convert date + time + tz to Julian Date
function getJulianDate(year: number, month: number, day: number, hour: number, minute: number, tz: number): number {
  let utHour = hour + minute / 60 - tz;
  let d = day + utHour / 24;
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

// Calculate Ascendant using local sidereal time and latitude (Meeus / Astrodienst spherical model)
function calculateAscendantDegree(jd: number, lat: number, lon: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  // Greenwich Mean Sidereal Time in degrees (IAU formula)
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000;
  gmst = normalizeDeg(gmst);

  // Local Sidereal Time
  const lst = normalizeDeg(gmst + lon);
  const ramc = lst * DEG2RAD;
  const eps = (23.4392911 - 0.0130042 * T) * DEG2RAD;
  const phi = lat * DEG2RAD;

  // Exact Ascendant formula: intersection of eastern horizon with the ecliptic
  // tan(ASC) = cos(RAMC) / (-sin(RAMC)*cos(eps) - tan(phi)*sin(eps))
  const y = Math.cos(ramc);
  const x = -Math.sin(ramc) * Math.cos(eps) - Math.tan(phi) * Math.sin(eps);
  let asc = Math.atan2(y, x) * RAD2DEG;
  asc = normalizeDeg(asc);

  return asc;
}

// Sun longitude (True geocentric ecliptic longitude)
function calculateSunDegree(d: number): number {
  const g = normalizeDeg(357.528 + 0.9856003 * d) * DEG2RAD;
  const q = normalizeDeg(280.460 + 0.9856474 * d);
  const L = q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g);
  return normalizeDeg(L);
}

// Moon longitude (Meeus truncated model with evection, variation & annual equation)
function calculateMoonDegree(d: number): number {
  const L0 = normalizeDeg(218.316 + 13.176396 * d);
  const M = normalizeDeg(134.963 + 13.064993 * d) * DEG2RAD;
  const F = normalizeDeg(93.272 + 13.229350 * d) * DEG2RAD;
  const D = normalizeDeg(297.850 + 12.190749 * d) * DEG2RAD;

  const lon = L0
    + 6.289 * Math.sin(M)
    + 1.274 * Math.sin(2 * D - M)
    + 0.658 * Math.sin(2 * D)
    + 0.214 * Math.sin(2 * M)
    - 0.186 * Math.sin(M - 2 * D)
    - 0.114 * Math.sin(2 * F);

  return normalizeDeg(lon);
}

// High-accuracy Geocentric Planetary Longitudes (Keplerian orbits + Earth vector subtraction)
function calculatePlanetDegrees(d: number): Record<PlanetName, number> {
  const sunDeg = calculateSunDegree(d);
  const moonDeg = calculateMoonDegree(d);

  // Earth/Sun orbital plane elements
  const wSun = 282.9404 + 4.70935e-5 * d;
  const eSun = 0.016709 - 1.151e-9 * d;
  const MSun = normalizeDeg(356.0470 + 0.9856002585 * d);
  const ESun = MSun + RAD2DEG * eSun * Math.sin(MSun * DEG2RAD) * (1 + eSun * Math.cos(MSun * DEG2RAD));
  const xSun = Math.cos(ESun * DEG2RAD) - eSun;
  const ySun = Math.sin(ESun * DEG2RAD) * Math.sqrt(1 - eSun * eSun);
  const rSun = Math.sqrt(xSun * xSun + ySun * ySun);
  const vSun = RAD2DEG * Math.atan2(ySun, xSun);
  const lonSun = normalizeDeg(vSun + wSun);
  const xs = rSun * Math.cos(lonSun * DEG2RAD);
  const ys = rSun * Math.sin(lonSun * DEG2RAD);

  function getGeocentricPlanet(
    a: number,
    e0: number,
    de: number,
    M0: number,
    dM: number,
    w0: number,
    dw: number
  ): number {
    const e = e0 + de * d;
    const M = normalizeDeg(M0 + dM * d);
    const w = normalizeDeg(w0 + dw * d);
    const E = M + RAD2DEG * e * Math.sin(M * DEG2RAD) * (1 + e * Math.cos(M * DEG2RAD));
    const xv = a * (Math.cos(E * DEG2RAD) - e);
    const yv = a * (Math.sqrt(1 - e * e) * Math.sin(E * DEG2RAD));
    const v = RAD2DEG * Math.atan2(yv, xv);
    const r = Math.sqrt(xv * xv + yv * yv);
    const l = (v + w) * DEG2RAD;
    const xh = r * Math.cos(l);
    const yh = r * Math.sin(l);
    return normalizeDeg(RAD2DEG * Math.atan2(yh + ys, xh + xs));
  }

  // Mercury (Strict inner orbit, max elongation 28°)
  const mercury = getGeocentricPlanet(0.387098, 0.205635, 5.59e-10, 168.6562, 4.0923344368, 29.1241, 1.01444e-5);
  // Venus (Strict inner orbit, max elongation 47°)
  const venus = getGeocentricPlanet(0.723330, 0.006773, -1.302e-9, 48.0052, 1.6021302244, 54.8910, 1.38374e-5);
  // Mars
  const mars = getGeocentricPlanet(1.523688, 0.093405, 2.516e-9, 18.6021, 0.5240207766, 286.5016, 2.92961e-5);
  // Jupiter
  const jupiter = getGeocentricPlanet(5.20256, 0.048498, 4.469e-9, 19.8950, 0.0830853001, 273.8777, 1.64505e-5);
  // Saturn
  const saturn = getGeocentricPlanet(9.55475, 0.055546, -9.499e-9, 316.9670, 0.0334442282, 339.3939, 2.97661e-5);
  // Uranus
  const uranus = getGeocentricPlanet(19.18171, 0.047318, 7.45e-9, 142.5905, 0.011725806, 170.9542, 2.334e-5);
  // Neptune
  const neptune = getGeocentricPlanet(30.05826, 0.008606, 2.15e-9, 260.2471, 0.005995147, 44.9713, -1.502e-5);
  // Pluto
  const pluto = getGeocentricPlanet(39.48168, 0.248807, 0, 14.882, 0.00396, 224.14, 0);

  return {
    Sun: sunDeg,
    Moon: moonDeg,
    Ascendant: 0,
    Mercury: mercury,
    Venus: venus,
    Mars: mars,
    Jupiter: jupiter,
    Saturn: saturn,
    Uranus: uranus,
    Neptune: neptune,
    Pluto: pluto,
  };
}

const PLANET_METADATA: Record<PlanetName, { nameRu: string; symbol: string; meaningRu: string; vibe: string }> = {
  Sun: {
    nameRu: 'Солнце',
    symbol: '☉',
    meaningRu: 'Ядро личности, эго, творческая искра и жизненная сила',
    vibe: 'Твое истинное «Я» и то, как ты светишь в этом мире',
  },
  Moon: {
    nameRu: 'Луна',
    symbol: '☽',
    meaningRu: 'Внутренний мир, подсознание, эмоции и зона комфорта',
    vibe: 'Что тебя по-настоящему согревает и расслабляет наедине с собой',
  },
  Ascendant: {
    nameRu: 'Асцендент',
    symbol: 'ASC',
    meaningRu: 'Восходящий знак: первое впечатление, манера общения, аура при встрече',
    vibe: 'Каким тебя впервые видят другие люди и твой стиль подачи',
  },
  Mercury: {
    nameRu: 'Меркурий',
    symbol: '☿',
    meaningRu: 'Интеллект, речь, логика, чувство юмора и обмен идеями',
    vibe: 'Как ты шутишь, учишься и находишь общий язык с людьми',
  },
  Venus: {
    nameRu: 'Венера',
    symbol: '♀',
    meaningRu: 'Любовь, эстетика, стиль флирта, чувственность и ценности',
    vibe: 'Что для тебя красиво, как ты проявляешь симпатию и что тебя пленяет',
  },
  Mars: {
    nameRu: 'Марс',
    symbol: '♂',
    meaningRu: 'Энергия, страсть, инициатива, смелость и драйв',
    vibe: 'Твоя скорость принятия решений, спортивный азарт и огонь действий',
  },
  Jupiter: {
    nameRu: 'Юпитер',
    symbol: '♃',
    meaningRu: 'Удача, масштабирование, оптимизм, мудрость и щедрость',
    vibe: 'Где вселенная открывает перед тобой зеленый свет и дарит бонусы',
  },
  Saturn: {
    nameRu: 'Сатурн',
    symbol: '♄',
    meaningRu: 'Внутренний стержень, дисциплина, мудрость и кармический опыт',
    vibe: 'Твоя суперсила ответственности и долгосрочные великие цели',
  },
  Uranus: {
    nameRu: 'Уран',
    symbol: '♅',
    meaningRu: 'Инсайты, озарения, свобода мышления и креативный бунт',
    vibe: 'Твоя эксцентричность, неординарность и любовь к будущему',
  },
  Neptune: {
    nameRu: 'Нептун',
    symbol: '♆',
    meaningRu: 'Интуиция, сны, музыкальное чувствование и вдохновение',
    vibe: 'Глубина романтических грез и способность чувствовать без слов',
  },
  Pluto: {
    nameRu: 'Плутон',
    symbol: '♇',
    meaningRu: 'Внутренний магнетизм, глубинная трансформация и несгибаемая воля',
    vibe: 'Твой скрытый гипнотический потенциал и способность возрождаться',
  },
};

// Calculate Aspects
function calculateAspects(planets: PlanetPosition[]): AspectInfo[] {
  const aspects: AspectInfo[] = [];
  const checked = new Set<string>();

  const ASPECT_TYPES = [
    { type: 'Conjunction' as const, typeRu: 'Соединение', symbol: '☌', angle: 0, orb: 8, nature: 'neutral' as const, desc: 'Слияние энергий и мощный резонанс' },
    { type: 'Sextile' as const, typeRu: 'Секстиль', symbol: '⚹', angle: 60, orb: 6, nature: 'harmonious' as const, desc: 'Легкие возможности и взаимная поддержка' },
    { type: 'Square' as const, typeRu: 'Квадратура', symbol: '□', angle: 90, orb: 7, nature: 'tense' as const, desc: 'Динамическая искра и стимул к росту' },
    { type: 'Trine' as const, typeRu: 'Трин', symbol: '△', angle: 120, orb: 8, nature: 'harmonious' as const, desc: 'Природная гармония, удача и благородство' },
    { type: 'Opposition' as const, typeRu: 'Оппозиция', symbol: '☍', angle: 180, orb: 8, nature: 'tense' as const, desc: 'Магнетическое притяжение противоположностей' },
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      const pairKey = `${p1.name}-${p2.name}`;
      if (checked.has(pairKey)) continue;
      checked.add(pairKey);

      let diff = Math.abs(p1.degree - p2.degree);
      if (diff > 180) diff = 360 - diff;

      for (const asp of ASPECT_TYPES) {
        const delta = Math.abs(diff - asp.angle);
        if (delta <= asp.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            aspectType: asp.type,
            aspectTypeRu: asp.typeRu,
            symbol: asp.symbol,
            angle: asp.angle,
            exactAngle: diff,
            orb: Math.round(delta * 10) / 10,
            nature: asp.nature,
            descriptionRu: `${asp.desc}: ${p1.nameRu} и ${p2.nameRu}`,
          });
          break;
        }
      }
    }
  }

  return aspects;
}

// Calculate Equal Houses from Ascendant
function calculateHouses(ascDeg: number): HouseCusp[] {
  const HOUSE_MEANINGS = [
    'I Дом: Личность, образ себя, харизма',
    'II Дом: Ресурсы, таланты, материальный достаток',
    'III Дом: Общение, идеи, остроумие, близкий круг',
    'IV Дом: Род, уютный дом, внутренний корень',
    'V Дом: Любовь, творчество, флирт, радость жизни',
    'VI Дом: Профессионализм, забота, мастерство деталей',
    'VII Дом: Партнерство, гармония союза, любовь',
    'VIII Дом: Страсть, трансформация, общие ресурсы, тайна',
    'IX Дом: Философия, путешествия, высшие горизонты',
    'X Дом: Карьера, статус, призвание и признание',
    'XI Дом: Мечты, единомышленники, вдохновение будущего',
    'XII Дом: Интуиция, глубинная духовность, магия снов',
  ];

  const houses: HouseCusp[] = [];
  for (let i = 0; i < 12; i++) {
    const cuspDeg = normalizeDeg(ascDeg + i * 30);
    const zodiac = degToZodiac(cuspDeg);
    houses.push({
      houseNumber: i + 1,
      sign: zodiac.sign,
      degree: cuspDeg,
      meaningRu: HOUSE_MEANINGS[i],
    });
  }
  return houses;
}

// Full Natal Chart Calculation
export function calculateNatalChart(params: {
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthTime: string; // HH:MM
  cityName: string;
  latitude: number;
  longitude: number;
  timezone: number;
}): NatalChartData {
  const [yStr, mStr, dStr] = params.birthDate.split('-');
  const [hStr, minStr] = params.birthTime.split(':');

  const year = parseInt(yStr, 10) || 2000;
  const month = parseInt(mStr, 10) || 1;
  const day = parseInt(dStr, 10) || 1;
  const hour = parseInt(hStr, 10) || 12;
  const minute = parseInt(minStr, 10) || 0;

  const jd = getJulianDate(year, month, day, hour, minute, params.timezone);
  const d = jd - 2451545.0;

  const ascDeg = calculateAscendantDegree(jd, params.latitude, params.longitude);
  const rawDegrees = calculatePlanetDegrees(d);
  rawDegrees.Ascendant = ascDeg;

  // Build planet position list
  const planetNames: PlanetName[] = [
    'Sun', 'Moon', 'Ascendant', 'Mercury', 'Venus',
    'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'
  ];

  const planets: PlanetPosition[] = planetNames.map((pName) => {
    const deg = rawDegrees[pName];
    const zodiac = degToZodiac(deg);
    const meta = PLANET_METADATA[pName];
    // Find house
    let houseNum = Math.floor(normalizeDeg(deg - ascDeg) / 30) + 1;
    if (houseNum > 12) houseNum -= 12;

    return {
      name: pName,
      nameRu: meta.nameRu,
      symbol: meta.symbol,
      sign: zodiac.sign,
      signRu: zodiac.signRu,
      degree: deg,
      degreeInSign: zodiac.degreeInSign,
      minuteInSign: zodiac.minuteInSign,
      house: houseNum,
      meaningRu: meta.meaningRu,
      vibe: meta.vibe,
    };
  });

  const sunZodiac = degToZodiac(rawDegrees.Sun);
  const moonZodiac = degToZodiac(rawDegrees.Moon);
  const ascZodiac = degToZodiac(ascDeg);

  const sunSign = ZODIAC_SIGNS[sunZodiac.sign];
  const moonSign = ZODIAC_SIGNS[moonZodiac.sign];
  const ascendantSign = ZODIAC_SIGNS[ascZodiac.sign];

  const houses = calculateHouses(ascDeg);
  const aspects = calculateAspects(planets);

  // Calculate Element and Modality weights
  const weights: Record<PlanetName, number> = {
    Sun: 3,
    Moon: 3,
    Ascendant: 3,
    Venus: 2,
    Mars: 2,
    Mercury: 2,
    Jupiter: 1,
    Saturn: 1,
    Uranus: 1,
    Neptune: 1,
    Pluto: 1,
  };

  const elemCounts: Record<ElementType, number> = { Fire: 0, Earth: 0, Air: 0, Water: 0 };
  const modCounts: Record<ModalityType, number> = { Cardinal: 0, Fixed: 0, Mutable: 0 };
  let totalWeight = 0;

  planets.forEach((p) => {
    const sign = ZODIAC_SIGNS[p.sign];
    const w = weights[p.name] || 1;
    elemCounts[sign.element] += w;
    modCounts[sign.modality] += w;
    totalWeight += w;
  });

  const elementsBalance = {
    fire: Math.round((elemCounts.Fire / totalWeight) * 100),
    earth: Math.round((elemCounts.Earth / totalWeight) * 100),
    air: Math.round((elemCounts.Air / totalWeight) * 100),
    water: Math.round((elemCounts.Water / totalWeight) * 100),
  };

  const modalitiesBalance = {
    cardinal: Math.round((modCounts.Cardinal / totalWeight) * 100),
    fixed: Math.round((modCounts.Fixed / totalWeight) * 100),
    mutable: Math.round((modCounts.Mutable / totalWeight) * 100),
  };

  const numerology = calculateNumerology(day, month, year);

  return {
    name: params.name || 'Наблюдатель',
    birthDate: params.birthDate,
    birthTime: params.birthTime,
    cityName: params.cityName,
    latitude: params.latitude,
    longitude: params.longitude,
    timezone: params.timezone,
    sunSign,
    moonSign,
    ascendantSign,
    planets,
    houses,
    aspects,
    elementsBalance,
    modalitiesBalance,
    numerology,
  };
}
