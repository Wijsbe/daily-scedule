import React, { useState } from 'react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import { DienstDag, DienstSchema, DienstType, SportType } from '../types';
import { getSportTypeVoorDatum } from '../utils/sportUtils';
import SportDagSchema from './SportDagSchema';
import './DagWeergave.css';

interface DagWeergaveProps {
  datum: Date;
  dienstDagen: DienstDag[];
  dienstSchema: DienstSchema;
}

const DagWeergave: React.FC<DagWeergaveProps> = ({
  datum,
  dienstDagen,
  dienstSchema
}) => {
  const [geselecteerdeSport, setGeselecteerdeSport] = useState<SportType | null>(null);

  const getDienstVoorDatum = (datum: Date): DienstType => {
    const gevondenDag = dienstDagen.find(dag =>
      dag.datum.getDate() === datum.getDate() &&
      dag.datum.getMonth() === datum.getMonth() &&
      dag.datum.getFullYear() === datum.getFullYear()
    );

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
                <strong>{activiteit.type}</strong>
                {activiteit.sportType && activiteit.type === 'Sport' && (
                  <span
                    className="sport-type clickable"
                    onClick={() => handleSportClick(activiteit.sportType as SportType)}
                  >
                    ({activiteit.sportType})
                  </span>
                )}
              </div>
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