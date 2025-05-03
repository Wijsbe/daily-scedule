export type DienstType = 'Ochtend' | 'Middag' | 'Nacht' | 'Vrij';

export type SportType = 'Push' | 'Pull' | 'Full Body' | 'Cardio + Core' | 'Mobility';

export type ActiviteitType = 'Werk' | 'Slaap' | 'Sport' | 'Hobby/Studie' | 'Gezinstijd' | string;

export interface DagActiviteit {
  startTijd: string; // format: "HH:MM"
  eindTijd: string; // format: "HH:MM"
  type: ActiviteitType;
  sportType?: SportType; // alleen ingevuld als type === 'Sport'
  isCustomType?: boolean; // geeft aan of dit een aangepast type is
}

export interface DagSchema {
  activiteiten: DagActiviteit[];
}

export interface DienstSchema {
  [key: string]: DagSchema; // key is DienstType
}

export interface DienstDag {
  datum: Date;
  dienst: DienstType;
  isHandmatigAangepast: boolean;
}