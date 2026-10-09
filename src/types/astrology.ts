export type ZodiacSignName =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ModalityType = 'Cardinal' | 'Fixed' | 'Mutable';

export interface ZodiacSignInfo {
  name: ZodiacSignName;
  nameRu: string;
  symbol: string;
  element: ElementType;
  elementRu: string;
  modality: ModalityType;
  ruler: string;
  rulerRu: string;
  startDegree: number;
  dates: string;
  tagline: string;
  description: string;
  strengths: string[];
  inLove: string;
  vibeColor: string;
}

export type PlanetName =
  | 'Sun'
  | 'Moon'
  | 'Ascendant'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto';

export interface PlanetPosition {
  name: PlanetName;
  nameRu: string;
  symbol: string;
  sign: ZodiacSignName;
  signRu: string;
  degree: number;
  degreeInSign: number;
  minuteInSign: number;
  house: number;
  isRetrograde?: boolean;
  meaningRu: string;
  vibe: string;
}

export interface AspectInfo {
  planet1: PlanetName;
  planet2: PlanetName;
  aspectType: 'Conjunction' | 'Sextile' | 'Square' | 'Trine' | 'Opposition';
  aspectTypeRu: string;
  symbol: string;
  angle: number;
  exactAngle: number;
  orb: number;
  nature: 'harmonious' | 'tense' | 'neutral';
  descriptionRu: string;
}

export interface HouseCusp {
  houseNumber: number;
  sign: ZodiacSignName;
  degree: number;
  meaningRu: string;
}

export interface NatalChartData {
  name: string;
  birthDate: string;
  birthTime: string;
  cityName: string;
  latitude: number;
  longitude: number;
  timezone: number;
  sunSign: ZodiacSignInfo;
  moonSign: ZodiacSignInfo;
  ascendantSign: ZodiacSignInfo;
  planets: PlanetPosition[];
  houses: HouseCusp[];
  aspects: AspectInfo[];
  elementsBalance: {
    fire: number;
    earth: number;
    air: number;
    water: number;
  };
  modalitiesBalance: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
  numerology: {
    lifePathNumber: number;
    destinyNumber: number;
    dayNumber: number;
    personalArcana: number;
    soulArcana: number;
    karmicArcana: number;
  };
}

export interface SynastryResult {
  person1: NatalChartData;
  person2: NatalChartData;
  totalScore: number;
  chemistryScore: number;
  mindScore: number;
  soulScore: number;
  karmicScore: number;
  overallVerdict: string;
  pairArcana: {
    number: number;
    title: string;
    description: string;
  };
  highlights: {
    title: string;
    icon: string;
    description: string;
    type: 'passion' | 'harmony' | 'intellect' | 'karmic';
  }[];
  growthAreas: string[];
  flirtKey: string;
  secretCosmicAdvice: string;
}

export interface TarotCard {
  id: number;
  number: number;
  romanNumeral: string;
  nameRu: string;
  nameEn: string;
  keywords: string[];
  element: ElementType;
  quote: string;
  meaning: string;
  loveMeaning: string;
  workMeaning: string;
  energyVibe: string;
  advice: string;
}

export interface CityOption {
  name: string;
  country: string;
  lat: number;
  lon: number;
  tz: number;
}
