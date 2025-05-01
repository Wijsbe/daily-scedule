import React from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { DienstDag, DienstType } from '../types';
import './Kalender.css';

interface KalenderProps {
  dienstDagen: DienstDag[];
  updateDienst: (datum: Date, dienst: DienstType) => void;
  geselecteerdeDatum: Date | null;
  setGeselecteerdeDatum: (datum: Date) => void;
}

const dienstKleuren: Record<DienstType, string> = {
  'Ochtend': '#ffcc80', // licht oranje
  'Middag': '#80cbc4', // licht teal
  'Nacht': '#9fa8da', // licht indigo
  'Vrij': '#c5e1a5', // licht groen
};

const dienstAfkortingen: Record<DienstType, string> = {
  'Ochtend': 'O',
  'Middag': 'M',
  'Nacht': 'N',
  'Vrij': 'V',
};

const Kalender: React.FC<KalenderProps> = ({
  dienstDagen,
  updateDienst,
  geselecteerdeDatum,
  setGeselecteerdeDatum
}) => {
  const getDienstVoorDatum = (datum: Date): DienstType | null => {
    const gevondenDag = dienstDagen.find(dag =>
      dag.datum.getDate() === datum.getDate() &&
      dag.datum.getMonth() === datum.getMonth() &&
      dag.datum.getFullYear() === datum.getFullYear()
    );

    return gevondenDag ? gevondenDag.dienst : null;
  };

  const handleDagKlik = (datum: Date) => {
    setGeselecteerdeDatum(datum);

    // Toggle door diensten bij klik
    const huidigeDienst = getDienstVoorDatum(datum);

    let volgendeDienst: DienstType = 'Ochtend';

    if (huidigeDienst === 'Ochtend') {
      volgendeDienst = 'Middag';
    } else if (huidigeDienst === 'Middag') {
      volgendeDienst = 'Nacht';
    } else if (huidigeDienst === 'Nacht') {
      volgendeDienst = 'Vrij';
    } else if (huidigeDienst === 'Vrij') {
      volgendeDienst = 'Ochtend';
    }

    updateDienst(datum, volgendeDienst);
  };

  const tileContent = ({ date, view }: { date: Date, view: string }) => {
    if (view !== 'month') return null;

    const dienst = getDienstVoorDatum(date);
    if (!dienst) return null;

    return (
      <div
        className="dienst-indicator"
        style={{ backgroundColor: dienstKleuren[dienst] }}
      >
        {dienstAfkortingen[dienst]}
      </div>
    );
  };

  return (
    <div className="kalender-container">
      <Calendar
        onChange={(value: any) => {
          if (value instanceof Date) {
            handleDagKlik(value);
          }
        }}
        value={geselecteerdeDatum}
        locale="nl"
        tileContent={tileContent}
        formatDay={(_, date) => format(date, 'd', { locale: nl })}
        formatMonthYear={(_, date) =>
          format(date, 'MMMM yyyy', { locale: nl })
        }
        next2Label={null}
        prev2Label={null}
        nextLabel="Volgende"
        prevLabel="Vorige"
      />
    </div>
  );
};

export default Kalender;