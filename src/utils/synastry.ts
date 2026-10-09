import { NatalChartData, SynastryResult } from '../types/astrology';
import { MAJOR_ARCANA } from '../data/tarotData';
import { reduceToArcana22 } from './numerology';

// Element compatibility matrix
const ELEMENT_HARMONY: Record<string, Record<string, number>> = {
  Fire: { Fire: 90, Air: 95, Earth: 70, Water: 65 },
  Earth: { Earth: 92, Water: 96, Fire: 70, Air: 72 },
  Air: { Air: 91, Fire: 95, Water: 68, Earth: 72 },
  Water: { Water: 94, Earth: 96, Fire: 65, Air: 68 },
};

export function calculateSynastry(p1: NatalChartData, p2: NatalChartData): SynastryResult {
  const p1SunElem = p1.sunSign.element;
  const p2SunElem = p2.sunSign.element;

  const p1MoonElem = p1.moonSign.element;
  const p2MoonElem = p2.moonSign.element;

  // 1. Chemistry: Venus & Mars
  const p1Venus = p1.planets.find((p) => p.name === 'Venus')!;
  const p1Mars = p1.planets.find((p) => p.name === 'Mars')!;
  const p2Venus = p2.planets.find((p) => p.name === 'Venus')!;
  const p2Mars = p2.planets.find((p) => p.name === 'Mars')!;

  // Cross Venus-Mars angle check
  const angle1 = Math.abs(p1Venus.degree - p2Mars.degree);
  const normAngle1 = angle1 > 180 ? 360 - angle1 : angle1;

  const angle2 = Math.abs(p2Venus.degree - p1Mars.degree);
  const normAngle2 = angle2 > 180 ? 360 - angle2 : angle2;

  let chemBase = (ELEMENT_HARMONY[p1SunElem]?.[p2SunElem] || 80);
  if (normAngle1 < 15 || normAngle2 < 15) chemBase += 10;
  if ((normAngle1 >= 50 && normAngle1 <= 70) || (normAngle2 >= 50 && normAngle2 <= 70)) chemBase += 8;
  if ((normAngle1 >= 110 && normAngle1 <= 130) || (normAngle2 >= 110 && normAngle2 <= 130)) chemBase += 9;

  const chemistryScore = Math.min(99, Math.max(78, Math.round(chemBase)));

  // 2. Mind & Vibe: Mercury & Sun
  const p1Merc = p1.planets.find((p) => p.name === 'Mercury')!;
  const p2Merc = p2.planets.find((p) => p.name === 'Mercury')!;
  const mercDiff = Math.abs(p1Merc.degree - p2Merc.degree);
  const normMerc = mercDiff > 180 ? 360 - mercDiff : mercDiff;

  let mindBase = 82;
  if (normMerc < 20) mindBase += 12; // Conjunction of minds!
  else if (normMerc >= 50 && normMerc <= 70) mindBase += 10;
  else if (normMerc >= 110 && normMerc <= 130) mindBase += 12;
  else mindBase += 5;

  const mindScore = Math.min(98, Math.max(76, Math.round(mindBase)));

  // 3. Emotional Depth & Soul: Moon & Sun & Ascendant
  const moonHarmony = ELEMENT_HARMONY[p1MoonElem]?.[p2MoonElem] || 82;
  const sunMoonCross = ELEMENT_HARMONY[p1SunElem]?.[p2MoonElem] || 80;
  const soulScore = Math.min(99, Math.max(75, Math.round((moonHarmony + sunMoonCross) / 2)));

  // 4. Karmic Score: Personal arcana combination
  const p1Arcana = p1.numerology.personalArcana;
  const p2Arcana = p2.numerology.personalArcana;
  const pairArcanaNum = reduceToArcana22(p1Arcana + p2Arcana);
  const pairCard = MAJOR_ARCANA.find((c) => c.id === pairArcanaNum) || MAJOR_ARCANA[5]; // Lovers as fallback

  const karmicScore = Math.min(99, Math.max(80, 84 + (pairArcanaNum % 14)));

  // Total weighted score
  const totalScore = Math.round(
    chemistryScore * 0.3 +
    mindScore * 0.25 +
    soulScore * 0.25 +
    karmicScore * 0.2
  );

  // Generate highlights
  const highlights: SynastryResult['highlights'] = [
    {
      title: 'Магнетическая искра и полярность',
      icon: '✨',
      type: 'passion',
      description: `Связка планет ${p1.sunSign.nameRu} и ${p2.sunSign.nameRu} формирует отчетливый вектор притяжения. Между картами возникает устойчивое невербальное напряжение, в котором взгляды задерживаются дольше обычного.`,
    },
    {
      title: 'Интеллектуальная синхронность и юмор',
      icon: '💬',
      type: 'intellect',
      description: `Ментальный контакт на уровне ${mindScore}%. Синхронность интеллектуального ритма: способность улавливать тонкую иронию, обсуждать нетривиальные идеи и вести живой диалог без затянутых пауз.`,
    },
    {
      title: 'Психическая безопасность и доверие',
      icon: '🌙',
      type: 'harmony',
      description: `Конфигурация Луны (${p1.moonSign.nameRu} у ${p1.name} и ${p2.moonSign.nameRu} у ${p2.name}) свидетельствует о внутреннем созвучии. Взаимное присутствие снижает фоновую тревожность, создавая ощущение душевного спокойствия.`,
    },
    {
      title: `Совместный Аркан Пары: ${pairCard.romanNumeral} — ${pairCard.nameRu}`,
      icon: '🔮',
      type: 'karmic',
      description: `${pairCard.quote} Архетипический вектор союза стимулирует раскрытие творческой автономии и поддерживает взаимный личностный рост.`,
    },
  ];

  // Growth areas
  const growthAreas: string[] = [
    `Учитывайте разницу стихий: ${p1.sunSign.elementRu} дает больше динамики, а ${p2.sunSign.elementRu} требует времени для взвешенного осмысления.`,
    'Не бойтесь переходить от полунамеков к открытому диалогу — искреннее признание достоинств собеседника создает надежную почву для доверия.',
    'Спонтанная встреча за пределами рабочего контекста (чашка хорошего кофе в спокойной обстановке) раскроет потенциал союза наиболее естественно.',
  ];

  // Secret flirt key based on Person 2's sign
  const flirtKeys: Record<string, string> = {
    Aries: 'Реагирует на здоровую инициативу и внутреннюю смелость. Прямота и открытое предложение провести время вместе воспринимаются с максимальным энтузиазмом.',
    Taurus: 'Восприимчива к эстетике, тактильному комфорту и качеству деталей. Идеальная точка входа — атмосферное пространство с безупречным кофе и ненавязчивой беседой.',
    Gemini: 'Контакт выстраивается через интеллект, парадоксальные мысли и обмен идеями. Ценит живой ум, эрудицию и способность переключаться между глубокими темами и тонкой иронией.',
    Cancer: 'Тонко считывает искренность и эмоциональную деликатность. Ценит неподдельный интерес к ее самочувствию, ненавязчивую заботу и спокойную душевную теплоту.',
    Leo: 'Откликается на подлинное признание ее индивидуальности и вкуса. Заметьте ее авторский взгляд на вещи или профессиональное мастерство — искреннее уважение она оценит высоко.',
    Virgo: 'Фокусируется на содержательности, логике и внимании к нюансам. Точная деталь из ранее сказанного ею, подмеченная вовремя, произведет неизгладимое впечатление.',
    Libra: 'Ценит баланс, галантность и утонченное чувство такта. Влечение стимулируется культурой диалога, эстетической гармонией и отсутствием грубого давления.',
    Scorpio: 'Мгновенно сканирует скрытые мотивы и фальшь. Доверяет только абсолютной психологической аутентичности, уверенному взгляду глаза в глаза и смелости быть собой.',
    Sagittarius: 'Вдохновляется широтой кругозора, оптимизмом и духом открытий. Разговор о путешествиях, концепциях будущего и необычных маршрутах запускает живой резонанс.',
    Capricorn: 'Уважает внутренний стержень, надежность слова и профессиональную глубину. Надежность и отсутствие пустых обещаний привлекают ее сильнее любых внешних эффектов.',
    Aquarius: 'Ищет интеллектуального единомышленника с независимым мышлением. Разговор о космосе, парадоксах времени и философских теориях станет идеальным мостом.',
    Pisces: 'Воспринимает мир через интуицию, тонкие эмоциональные полутона и музыку. Деликатность, атмосферный саундтрек и умение слушать между строк откроют ее сердце.',
  };

  const flirtKey = flirtKeys[p2.sunSign.name] || 'Проявляйте искренний интерес к ее мировоззрению и сохраняйте открытость в диалоге.';

  // Cosmic Verdict
  let overallVerdict = '';
  if (totalScore >= 90) {
    overallVerdict = 'Высокий гравитационный резонанс орбит. Редкая конфигурация взаимных аспектов: баланс чувственного магнетизма, синхронности когнитивных ритмов и глубинного доверия. Астрономическая геометрия союза указывает на взаимное раскрытие потенциала.';
  } else if (totalScore >= 82) {
    overallVerdict = 'Гармоничный синастрический баланс. Устойчивое совпадение ключевых векторов: взаимопонимание на уровне мысли, естественный психологический комфорт и взаимный интерес, не требующий искусственных стимулов.';
  } else {
    overallVerdict = 'Динамическая полярность противоположностей. Союз основан на интригующем контрасте темпераментов. Взаимное различие не разделяет, а создает устойчивое магнетическое притяжение и импульс к взаимному познанию.';
  }

  const secretCosmicAdvice = `Асцендент ${p1.name} в знаке ${p1.ascendantSign.nameRu} превосходно дополняет оптику ${p2.name}. Самое время обсудить эти координаты за чашкой кофе.`;

  return {
    person1: p1,
    person2: p2,
    totalScore,
    chemistryScore,
    mindScore,
    soulScore,
    karmicScore,
    overallVerdict,
    pairArcana: {
      number: pairArcanaNum,
      title: `${pairCard.romanNumeral} — ${pairCard.nameRu}`,
      description: pairCard.meaning,
    },
    highlights,
    growthAreas,
    flirtKey,
    secretCosmicAdvice,
  };
}
