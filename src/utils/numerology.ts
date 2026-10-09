import { MAJOR_ARCANA } from '../data/tarotData';

export interface MatrixDestinyReport {
  personalArcana: number;
  personalArcanaTitle: string;
  soulArcana: number;
  soulArcanaTitle: string;
  karmicArcana: number;
  karmicArcanaTitle: string;
  centralComfortArcana: number;
  centralComfortTitle: string;
  moneyArcana: number;
  moneyArcanaTitle: string;
  loveArcana: number;
  loveArcanaTitle: string;
  lifePathNumber: number;
  lifePathTitle: string;
  lifePathDescription: string;
}

export function reduceDigits(num: number, keepMaster = true): number {
  if (keepMaster && (num === 11 || num === 22 || num === 33)) return num;
  let current = num;
  while (current > 9) {
    if (keepMaster && (current === 11 || current === 22 || current === 33)) break;
    current = String(current)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return current;
}

export function reduceToArcana22(num: number): number {
  let val = num;
  while (val > 22) {
    val = String(val)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  }
  return val === 0 ? 22 : val;
}

export const LIFE_PATH_DESCRIPTIONS: Record<number, { title: string; desc: string }> = {
  1: {
    title: 'Первопроходец и Лидер',
    desc: 'Твой путь — вести за собой, генерировать смелые идеи и задавать тренды. Обладаешь редкой независимостью и несгибаемой силой воли.',
  },
  2: {
    title: 'Дипломат и Эмпат',
    desc: 'Мастер создания гармонии, чуткости и тонких связей. Твоя сила — в интуиции, миротворчестве и умении чувствовать людей сердцем.',
  },
  3: {
    title: 'Творец и Маг Слова',
    desc: 'Остроумие, легкость, артистизм и радость жизни. Ты вдохновляешь окружающих своим оптимизмом, стилем и ярким творческим самовыражением.',
  },
  4: {
    title: 'Архитектор и Опора',
    desc: 'Надежность высшей пробы, острый практический ум и способность превращать хаос в стабильную, процветающую систему.',
  },
  5: {
    title: 'Искатель Свободы и Приключений',
    desc: 'Динамичный визионер, обожающий перемены, путешествия и новые впечатления. Заряжаешь всех вокруг своей энергией и смелостью.',
  },
  6: {
    title: 'Хранитель Гармонии и Любви',
    desc: 'Глубокая эстетика, забота, душевное благородство и умение создавать вокруг себя атмосферу безусловной любви и уюта.',
  },
  7: {
    title: 'Философ и Мистик-Аналитик',
    desc: 'Глубокий исследователь тайн мироздания, человеческой психологии и скрытых истин. Обладаешь уникальным интеллектом и мощной интуицией.',
  },
  8: {
    title: 'Повелитель Энергии и Масштаба',
    desc: 'Финансовый авторитет, грандиозный масштаб мышления, умение управлять ресурсами и добиваться впечатляющего материального триумфа.',
  },
  9: {
    title: 'Мудрец и Гуманист',
    desc: 'Широта души, вселенское понимание, мудрость и стремление сделать этот мир лучше. Твое призвание — вдохновлять и вести к свету.',
  },
  11: {
    title: 'Мастер-Число: Духовный Проводник',
    desc: 'Высочайшая интуиция, мистический дар и озарения. Ты чувствуешь пространство на тончайшем уровне и являешься маяком для других.',
  },
  22: {
    title: 'Мастер-Число: Великий Созидатель',
    desc: 'Способность воплощать самые грандиозные мечты в физическую реальность. Соединение высокой духовности с практической мощью.',
  },
  33: {
    title: 'Мастер-Число: Учитель Безусловной Любви',
    desc: 'Редчайшая вибрация целительного сострадания, мудрости и вдохновения миллионов людей через чистое сердце.',
  },
};

export function calculateNumerology(day: number, month: number, year: number) {
  // Day arcana (Matrix of Destiny)
  const personalArcana = day > 22 ? day - 22 : day;
  const soulArcana = month;
  const yearSum = String(year).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
  const karmicArcana = reduceToArcana22(yearSum);

  // Life Path
  const dayRed = reduceDigits(day, false);
  const monthRed = reduceDigits(month, false);
  const yearRed = reduceDigits(yearSum, false);
  const lifePathNumber = reduceDigits(dayRed + monthRed + yearRed, true);

  const destinyNumber = reduceDigits(day + month + year, false);

  return {
    lifePathNumber,
    destinyNumber,
    dayNumber: day,
    personalArcana,
    soulArcana,
    karmicArcana,
  };
}

export function getFullMatrixDestinyReport(day: number, month: number, year: number): MatrixDestinyReport {
  const num = calculateNumerology(day, month, year);

  const personalArcanaCard = MAJOR_ARCANA.find((a) => a.id === num.personalArcana) || MAJOR_ARCANA[0];
  const soulArcanaCard = MAJOR_ARCANA.find((a) => a.id === num.soulArcana) || MAJOR_ARCANA[1];
  const karmicArcanaCard = MAJOR_ARCANA.find((a) => a.id === num.karmicArcana) || MAJOR_ARCANA[2];

  const centralComfort = reduceToArcana22(num.personalArcana + num.soulArcana + num.karmicArcana);
  const centralCard = MAJOR_ARCANA.find((a) => a.id === centralComfort) || MAJOR_ARCANA[3];

  const moneyArcana = reduceToArcana22(centralComfort + num.karmicArcana);
  const moneyCard = MAJOR_ARCANA.find((a) => a.id === moneyArcana) || MAJOR_ARCANA[4];

  const loveArcana = reduceToArcana22(centralComfort + num.soulArcana);
  const loveCard = MAJOR_ARCANA.find((a) => a.id === loveArcana) || MAJOR_ARCANA[5];

  const lpInfo = LIFE_PATH_DESCRIPTIONS[num.lifePathNumber] || LIFE_PATH_DESCRIPTIONS[reduceDigits(num.lifePathNumber, false)] || {
    title: 'Звездный Путник',
    desc: 'Уникальный жизненный путь познания и раскрытия потенциала.',
  };

  return {
    personalArcana: num.personalArcana,
    personalArcanaTitle: `${personalArcanaCard.romanNumeral} — ${personalArcanaCard.nameRu}`,
    soulArcana: num.soulArcana,
    soulArcanaTitle: `${soulArcanaCard.romanNumeral} — ${soulArcanaCard.nameRu}`,
    karmicArcana: num.karmicArcana,
    karmicArcanaTitle: `${karmicArcanaCard.romanNumeral} — ${karmicArcanaCard.nameRu}`,
    centralComfortArcana: centralComfort,
    centralComfortTitle: `${centralCard.romanNumeral} — ${centralCard.nameRu}`,
    moneyArcana,
    moneyArcanaTitle: `${moneyCard.romanNumeral} — ${moneyCard.nameRu}`,
    loveArcana,
    loveArcanaTitle: `${loveCard.romanNumeral} — ${loveCard.nameRu}`,
    lifePathNumber: num.lifePathNumber,
    lifePathTitle: lpInfo.title,
    lifePathDescription: lpInfo.desc,
  };
}
