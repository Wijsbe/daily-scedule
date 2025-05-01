import { DienstDag, SportType } from '../types';

// Functie om het sporttype te bepalen op basis van de datum
// Implementeert een simpel rotatiesysteem voor sporttypen
export const getSportTypeVoorDatum = (datum: Date, dienstDagen: DienstDag[]): SportType => {
  // Bepaal welke dag van de week het is (0 = zondag, 1 = maandag, etc.)
  const dagVanDeWeek = datum.getDay();
  
  // Bepaal welke week van de maand het is (1-5)
  const weekVanDeMaand = Math.ceil(datum.getDate() / 7);
  
  // Combineer dag en week voor een unieke waarde (0-34)
  const combinatie = (weekVanDeMaand - 1) * 7 + dagVanDeWeek;
  
  // Roteer door de verschillende sporttypen
  const sportTypes: SportType[] = ['Push', 'Pull', 'Full Body', 'Cardio + Core', 'Mobility'];
  
  return sportTypes[combinatie % sportTypes.length];
};
