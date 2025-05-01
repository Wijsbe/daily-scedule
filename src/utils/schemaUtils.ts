import { DienstSchema } from '../types';

export const getStandaardDagSchema = (): DienstSchema => {
  return {
    'Ochtend': {
      activiteiten: [
        {
          startTijd: '05:30',
          eindTijd: '06:00',
          type: 'Gezinstijd'
        },
        {
          startTijd: '06:00',
          eindTijd: '14:00',
          type: 'Werk'
        },
        {
          startTijd: '15:00',
          eindTijd: '16:00',
          type: 'Sport',
          sportType: 'Push'
        },
        {
          startTijd: '16:30',
          eindTijd: '21:30',
          type: 'Gezinstijd'
        },
        {
          startTijd: '22:00',
          eindTijd: '05:00',
          type: 'Slaap'
        }
      ]
    },
    'Middag': {
      activiteiten: [
        {
          startTijd: '07:00',
          eindTijd: '08:00',
          type: 'Sport',
          sportType: 'Pull'
        },
        {
          startTijd: '08:30',
          eindTijd: '13:00',
          type: 'Gezinstijd'
        },
        {
          startTijd: '14:00',
          eindTijd: '22:00',
          type: 'Werk'
        },
        {
          startTijd: '23:00',
          eindTijd: '06:30',
          type: 'Slaap'
        }
      ]
    },
    'Nacht': {
      activiteiten: [
        {
          startTijd: '12:00',
          eindTijd: '15:00',
          type: 'Gezinstijd'
        },
        {
          startTijd: '15:30',
          eindTijd: '16:30',
          type: 'Sport',
          sportType: 'Full Body'
        },
        {
          startTijd: '17:00',
          eindTijd: '21:00',
          type: 'Gezinstijd'
        },
        {
          startTijd: '22:00',
          eindTijd: '06:00',
          type: 'Werk'
        },
        {
          startTijd: '07:00',
          eindTijd: '11:30',
          type: 'Slaap'
        }
      ]
    },
    'Vrij': {
      activiteiten: [
        {
          startTijd: '08:00',
          eindTijd: '09:00',
          type: 'Sport',
          sportType: 'Cardio + Core'
        },
        {
          startTijd: '09:30',
          eindTijd: '12:00',
          type: 'Hobby/Studie'
        },
        {
          startTijd: '12:30',
          eindTijd: '21:00',
          type: 'Gezinstijd'
        },
        {
          startTijd: '22:00',
          eindTijd: '07:30',
          type: 'Slaap'
        }
      ]
    }
  };
};
