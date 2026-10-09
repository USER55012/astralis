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
      title: 'Магнетическая искра и флирт',
      icon: '✨',
      type: 'passion',
      description: `Связка ${p1.sunSign.nameRu} + ${p2.sunSign.nameRu} создает мощный эмоциональный импульс. Между вами есть то самое неуловимое электричество, когда случайный взгляд задерживается чуть дольше обычного.`,
    },
    {
      title: 'Легкость в диалоге и общий юмор',
      icon: '💬',
      type: 'intellect',
      description: `Ментальный контакт на уровне ${mindScore}%. Вам легко шутить, обсуждать забавные рабочие моменты, сплетничать про знаки зодиака или часами делиться мыслями обо всем на свете без неловких пауз.`,
    },
    {
      title: 'Уют и ощущение «своего человека»',
      icon: '🌙',
      type: 'harmony',
      description: `Положение Луны (${p1.moonSign.nameRu} у ${p1.name} и ${p2.moonSign.nameRu} у ${p2.name}) показывает, что рядом друг с другом снижается уровень тревоги. Это редкое чувство, когда можно быть собой без масок.`,
    },
    {
      title: `Совместный Аркан Пары: ${pairCard.romanNumeral} — ${pairCard.nameRu}`,
      icon: '🔮',
      type: 'karmic',
      description: `${pairCard.quote} Вселенная свела вас не случайно: эта энергия призвана раскрыть лучшие творческие стороны каждого из вас и подарить вдохновение.`,
    },
  ];

  // Growth areas
  const growthAreas: string[] = [
    `Учитывайте разницу стихий: ${p1.sunSign.elementRu} дает больше спонтанности, а ${p2.sunSign.elementRu} требует времени для осмысления.`,
    'Не бойтесь открыто говорить о симпатии — полунамеки прекрасны, но искренний комплимент творит настоящие чудеса.',
    'Находите время для совместного отдыха за пределами работы — чашка кофе в уютном месте раскроет этот союз на 100%.',
  ];

  // Secret flirt key based on Person 2's sign
  const flirtKeys: Record<string, string> = {
    Aries: 'Обожает смелость и азарт. Не бойся спонтанно позвать ее выпить кофе или пошутить дерзко и с огоньком — она оценит решительность!',
    Taurus: 'Ценит красивую эстетику, вкусные десерты и уют. Пригласи ее в красивое место с приятным интерьером или подари что-то эстетичное и тактильное.',
    Gemini: 'Влюбляется через уши и мозг! Делись с ней интересными фактами, мемами, спрашивай ее мнение и отправляй забавные аудиосообщения.',
    Cancer: 'Сердце тает от искренней заботы и душевного тепла. Спроси, как прошел ее день, заметь ее настроение и предложи согревающий чай.',
    Leo: 'Любит быть в центре внимания и обожает искреннее восхищение. Подчеркни ее безупречный стиль, улыбку или как круто она справилась с задачей.',
    Virgo: 'Ценит внимание к деталям и ум. Запомни то, что она случайно упомянула неделю назад, и удиви ее своей памятью — это покорит ее мгновенно.',
    Libra: 'Обожает романтику, тонкий флирт, искусство и красивую вежливость. Будь галантен, говори утонченные комплименты и выбирай стильные локации.',
    Scorpio: 'Чувствует людей насквозь и ценит смелый контакт глазами. Будь искренним, не бойся смотреть прямо в глаза и делись сокровенными мыслями.',
    Sagittarius: 'Загорается от духа приключений и искрометного юмора. Предложи спонтанную прогулку в необычное место или обсуди планы на путешествия.',
    Capricorn: 'Уважает людей дела, надежность и тонкое чувство юмора с ноткой сарказма. Покажи, что на тебя можно положиться, и цени ее время.',
    Aquarius: 'Обожает нестандартных людей и глубокие разговоры под звездами. Обсуждай с ней космос, странные теории и покажи, что ты тоже мыслишь свободно.',
    Pisces: 'Погружается в романтику и музыку. Отправь ей красивый атмосферный трек, заметь ее мечтательный взгляд и говори о сокровенных мечтах.',
  };

  const flirtKey = flirtKeys[p2.sunSign.name] || 'Проявляй искренний интерес к ее миру и не скрывай улыбку!';

  // Cosmic Verdict
  let overallVerdict = '';
  if (totalScore >= 90) {
    overallVerdict = '🌟 Космический Резонанс (Редкое совпадение): Звезды буквально кричат о том, что между вами невероятное притяжение! Химия, ментальный вайб и кармическая глубина сошлись в одной точке. Такую искру грех игнорировать.';
  } else if (totalScore >= 82) {
    overallVerdict = '✨ Гармоничный Звездный Союз: У вас потрясающее сочетание энергий. Общий юмор, взаимный интерес и ощущение легкого волшебства в воздухе. Вы идеально дополняете сильные стороны друг друга.';
  } else {
    overallVerdict = '💫 Интригующее Притяжение Противоположностей: В вас заложена та самая загадочная искра, которая держит в приятном напряжении. Каждый разговор — это открытие, а взаимный магнетизм только усиливается со временем.';
  }

  const secretCosmicAdvice = `Асцендент ${p1.name} в знаке ${p1.ascendantSign.nameRu} прекрасно гармонирует с энергетикой ${p2.name}. Самое время обсудить эти результаты за чашкой кофе!`;

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
