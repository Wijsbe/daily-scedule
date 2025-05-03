import React from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { DienstDag, DienstType } from '../types';
import './Kalender.css';

interface KalenderProps {
  dienstDagen: DienstDag[];
  updateDienst: (datum: Date, dienst: DienstType) => void; // Behouden voor mogelijke toekomstige functionaliteit
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
  updateDienst, // Niet gebruikt, maar behouden voor toekomstige functionaliteit
  geselecteerdeDatum,
  setGeselecteerdeDatum
}) => {
  const getDienstVoorDatum = (datum: Date): DienstType | null => {
    // Hulpfunctie om te controleren of twee datums dezelfde dag zijn
    const isSameDay = (date1: Date, date2: Date): boolean => {
      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
    };

    // Zoek de dienst voor de gegeven datum
    const gevondenDag = dienstDagen.find(dag => isSameDay(dag.datum, datum));

    // Geef de dienst terug als deze is gevonden, anders null
    return gevondenDag ? gevondenDag.dienst : null;
  };

  const handleDagKlik = (datum: Date) => {
    // Alleen de geselecteerde datum bijwerken, geen dienst wijzigen
    setGeselecteerdeDatum(datum);
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