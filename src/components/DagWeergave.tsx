import React, { useState } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { DienstDag, DienstSchema, DienstType, SportType, ActiviteitType } from '../types';
import { getSportTypeVoorDatum } from '../utils/sportUtils';
import SportDagSchema from './SportDagSchema';
import './DagWeergave.css';

interface DagWeergaveProps {
  datum: Date;
  dienstDagen: DienstDag[];
  dienstSchema: DienstSchema;
  bewerkenActiviteit?: (datum: Date, activiteit: any, index: number) => void;
}

const DagWeergave: React.FC<DagWeergaveProps> = ({
  datum,
  dienstDagen,
  dienstSchema,
  bewerkenActiviteit
}) => {
  const [geselecteerdeSport, setGeselecteerdeSport] = useState<SportType | null>(null);

  const getDienstVoorDatum = (datum: Date): DienstType => {
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

    // Geef de dienst terug als deze is gevonden, anders 'Vrij' als standaard
    return gevondenDag ? gevondenDag.dienst : 'Vrij';
  };

  const dienst = getDienstVoorDatum(datum);
  const dagSchema = dienstSchema[dienst] || { activiteiten: [] };

  // Sorteer activiteiten op starttijd
  const gesorteerdeActiviteiten = [...dagSchema.activiteiten].sort((a, b) => {
    return a.startTijd.localeCompare(b.startTijd);
  });

  // Voeg sporttype toe aan sportactiviteiten
  const activiteitenMetSport = gesorteerdeActiviteiten.map(activiteit => {
    if (activiteit.type === 'Sport') {
      return {
        ...activiteit,
        sportType: getSportTypeVoorDatum(datum, dienstDagen)
      };
    }
    return activiteit;
  });

  const handleSportClick = (sportType: SportType) => {
    setGeselecteerdeSport(sportType);
  };

  const sluitSportSchema = () => {
    setGeselecteerdeSport(null);
  };

  return (
    <div className="dag-weergave">
      <h2>
        {format(datum, 'EEEE d MMMM yyyy', { locale: nl })}
      </h2>
      <div className="dienst-badge" data-dienst={dienst}>
        {dienst}
      </div>

      <div className="activiteiten-lijst">
        {activiteitenMetSport.length > 0 ? (
          activiteitenMetSport.map((activiteit, index) => (
            <div key={index} className={`activiteit-item ${activiteit.type.toLowerCase()}`}>
              <div className="activiteit-tijd">
                {activiteit.startTijd} - {activiteit.eindTijd}
              </div>
              <div className="activiteit-info">
                <strong className={activiteit.isCustomType ? 'custom-type' : ''}>
                  {activiteit.type}
                </strong>
                {activiteit.sportType && activiteit.type === 'Sport' && (
                  <span
                    className="sport-type clickable"
                    onClick={() => handleSportClick(activiteit.sportType as SportType)}
                  >
                    ({activiteit.sportType})
                  </span>
                )}
              </div>
              {bewerkenActiviteit && (
                <button
                  className="bewerk-activiteit-knop"
                  onClick={() => bewerkenActiviteit(datum, activiteit, index)}
                  title="Bewerk deze activiteit"
                >
                  <span role="img" aria-label="Bewerken">✏️</span>
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="geen-planning">
            Geen dagindeling beschikbaar voor {dienst}dienst.
            Stel een schema in via "Dagindeling Instellen".
          </p>
        )}
      </div>

      {geselecteerdeSport && (
        <SportDagSchema
          sportType={geselecteerdeSport}
          onClose={sluitSportSchema}
        />
      )}
    </div>
  );
};

export default DagWeergave;