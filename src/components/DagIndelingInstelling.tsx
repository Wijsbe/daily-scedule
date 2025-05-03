import React, { useState } from 'react';
import { DienstSchema, DienstType, DagActiviteit, SportType, ActiviteitType, HerhaalOptie } from '../types';
import NieuweActiviteitModal from './NieuweActiviteitModal';
import './DagIndelingInstelling.css';

interface DagIndelingInstellingProps {
  dienstSchema: DienstSchema;
  setDienstSchema: React.Dispatch<React.SetStateAction<DienstSchema>>;
  sluiten: () => void;
  teBewerkenActiviteit?: {
    datum: Date;
    activiteit: any;
    index: number;
  } | null;
}

const DagIndelingInstelling: React.FC<DagIndelingInstellingProps> = ({
  dienstSchema,
  setDienstSchema,
  sluiten,
  teBewerkenActiviteit
}) => {
  const [geselecteerdeDienst, setGeselecteerdeDienst] = useState<DienstType>('Ochtend');
  const [activiteiten, setActiviteiten] = useState<DagActiviteit[]>(
    dienstSchema[geselecteerdeDienst]?.activiteiten || []
  );
  const [toonNieuweActiviteitModal, setToonNieuweActiviteitModal] = useState<boolean>(false);

  // Update activiteiten wanneer geselecteerde dienst verandert
  React.useEffect(() => {
    setActiviteiten(dienstSchema[geselecteerdeDienst]?.activiteiten || []);
  }, [geselecteerdeDienst, dienstSchema]);

  // Laad de te bewerken activiteit als deze is meegegeven
  React.useEffect(() => {
    if (teBewerkenActiviteit) {
      // Bepaal de dienst van de te bewerken activiteit
      const dienst = getDienstVoorDatum(teBewerkenActiviteit.datum);
      setGeselecteerdeDienst(dienst);

      // Scroll naar de te bewerken activiteit
      setTimeout(() => {
        const element = document.getElementById(`activiteit-${teBewerkenActiviteit.index}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight');
          setTimeout(() => {
            element.classList.remove('highlight');
          }, 2000);
        }
      }, 500);
    }
  }, [teBewerkenActiviteit]);

  // Hulpfunctie om de dienst voor een datum te bepalen
  const getDienstVoorDatum = (datum: Date): DienstType => {
    // Hulpfunctie om te controleren of twee datums dezelfde dag zijn
    const isSameDay = (date1: Date, date2: Date): boolean => {
      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
    };

    // Zoek in de dienstSchema welke dienst overeenkomt met de activiteit
    for (const [dienstType, schema] of Object.entries(dienstSchema)) {
      const activiteitGevonden = schema.activiteiten.some(act =>
        act.startTijd === teBewerkenActiviteit?.activiteit.startTijd &&
        act.eindTijd === teBewerkenActiviteit?.activiteit.eindTijd &&
        act.type === teBewerkenActiviteit?.activiteit.type
      );

      if (activiteitGevonden) {
        return dienstType as DienstType;
      }
    }

    // Fallback naar de huidige geselecteerde dienst
    return geselecteerdeDienst;
  };

  const voegActiviteitToe = () => {
    setToonNieuweActiviteitModal(true);
  };

  const handleNieuweActiviteit = (nieuweActiviteit: DagActiviteit, herhaalOptie: HerhaalOptie) => {
    // Voeg de activiteit toe aan de huidige dienst
    setActiviteiten([...activiteiten, nieuweActiviteit]);

    // Verwerk de herhaaloptie
    if (herhaalOptie.type !== 'Geen') {
      // Maak een kopie van het huidige schema
      const nieuwSchema = { ...dienstSchema };

      // Voeg de activiteit toe aan alle diensten van het gespecificeerde type
      const dienstType = herhaalOptie.type; // 'Ochtend', 'Middag', of 'Nacht'

      if (!nieuwSchema[dienstType]) {
        nieuwSchema[dienstType] = { activiteiten: [] };
      }

      nieuwSchema[dienstType].activiteiten = [
        ...nieuwSchema[dienstType].activiteiten,
        {
          ...nieuweActiviteit,
          herhaalOptie // Bewaar de herhaaloptie in de activiteit voor toekomstige verwerking
        }
      ];

      // Update het schema
      setDienstSchema(nieuwSchema);
    }

    setToonNieuweActiviteitModal(false);
  };

  const sluitNieuweActiviteitModal = () => {
    setToonNieuweActiviteitModal(false);
  };

  const verwijderActiviteit = (index: number) => {
    const nieuweActiviteiten = [...activiteiten];
    nieuweActiviteiten.splice(index, 1);
    setActiviteiten(nieuweActiviteiten);
  };

  const updateActiviteit = (index: number, veld: keyof DagActiviteit, waarde: string) => {
    const nieuweActiviteiten = [...activiteiten];

    if (veld === 'type') {
      // Controleer of de waarde een geldige activiteittype is
      const activiteitType = waarde as ActiviteitType;
      nieuweActiviteiten[index] = {
        ...nieuweActiviteiten[index],
        type: activiteitType,
        // Verwijder sportType als het type niet Sport is
        ...(activiteitType !== 'Sport' && { sportType: undefined })
      };
    } else if (veld === 'sportType') {
      nieuweActiviteiten[index] = {
        ...nieuweActiviteiten[index],
        [veld]: waarde as SportType
      };
    } else {
      nieuweActiviteiten[index] = {
        ...nieuweActiviteiten[index],
        [veld]: waarde
      };
    }

    setActiviteiten(nieuweActiviteiten);
  };

  const toepassen = () => {
    // Sorteer activiteiten op starttijd
    const gesorteerdeActiviteiten = [...activiteiten].sort((a, b) => {
      return a.startTijd.localeCompare(b.startTijd);
    });

    const nieuwSchema = {
      ...dienstSchema,
      [geselecteerdeDienst]: {
        activiteiten: gesorteerdeActiviteiten
      }
    };

    setDienstSchema(nieuwSchema);
    sluiten();
  };

  return (
    <div className="dagindeling-instelling-overlay">
      <div className="dagindeling-instelling-container">
        <h2>Dagindeling Instellen</h2>

        <div className="dienst-selector">
          <label htmlFor="dienst-select">Dienst:</label>
          <select
            id="dienst-select"
            value={geselecteerdeDienst}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setGeselecteerdeDienst(e.target.value as DienstType)}
          >
            <option value="Ochtend">Ochtend</option>
            <option value="Middag">Middag</option>
            <option value="Nacht">Nacht</option>
            <option value="Vrij">Vrij</option>
          </select>
        </div>

        <div className="activiteiten-lijst">
          <h3>Activiteiten:</h3>

          {activiteiten.length === 0 ? (
            <p className="geen-activiteiten">Geen activiteiten ingesteld</p>
          ) : (
            activiteiten.map((activiteit, index) => (
              <div key={index} id={`activiteit-${index}`} className={`activiteit-item ${teBewerkenActiviteit?.index === index ? 'highlight' : ''}`}>
                <div className="activiteit-tijden">
                  <div className="tijd-veld">
                    <label htmlFor={`start-tijd-${index}`}>Start:</label>
                    <input
                      type="time"
                      id={`start-tijd-${index}`}
                      value={activiteit.startTijd}
                      onChange={(e) => updateActiviteit(index, 'startTijd', e.target.value)}
                    />
                  </div>
                  <div className="tijd-veld">
                    <label htmlFor={`eind-tijd-${index}`}>Eind:</label>
                    <input
                      type="time"
                      id={`eind-tijd-${index}`}
                      value={activiteit.eindTijd}
                      onChange={(e) => updateActiviteit(index, 'eindTijd', e.target.value)}
                    />
                  </div>
                </div>

                <div className="activiteit-type">
                  <label htmlFor={`type-${index}`}>Type:</label>
                  <select
                    id={`type-${index}`}
                    value={activiteit.type}
                    onChange={(e) => updateActiviteit(index, 'type', e.target.value)}
                  >
                    <option value="Werk">Werk</option>
                    <option value="Slaap">Slaap</option>
                    <option value="Sport">Sport</option>
                    <option value="Hobby/Studie">Hobby/Studie</option>
                    <option value="Gezinstijd">Gezinstijd</option>
                  </select>
                </div>

                {activiteit.type === 'Sport' && (
                  <div className="sport-type">
                    <label htmlFor={`sport-type-${index}`}>Sport type:</label>
                    <select
                      id={`sport-type-${index}`}
                      value={activiteit.sportType || 'Push'}
                      onChange={(e) => updateActiviteit(index, 'sportType', e.target.value)}
                    >
                      <option value="Push">Push</option>
                      <option value="Pull">Pull</option>
                      <option value="Full Body">Full Body</option>
                      <option value="Cardio + Core">Cardio + Core</option>
                      <option value="Mobility">Mobility</option>
                    </select>
                  </div>
                )}

                <button
                  className="verwijder-activiteit"
                  onClick={() => verwijderActiviteit(index)}
                >
                  ×
                </button>
              </div>
            ))
          )}

          <button className="voeg-activiteit-toe" onClick={voegActiviteitToe}>
            + Activiteit Toevoegen
          </button>
        </div>

        <div className="dagindeling-knoppen">
          <button onClick={sluiten}>Annuleren</button>
          <button onClick={toepassen}>Toepassen</button>
        </div>
      </div>

      {toonNieuweActiviteitModal && (
        <NieuweActiviteitModal
          toevoegen={handleNieuweActiviteit}
          annuleren={sluitNieuweActiviteitModal}
          geselecteerdeDienst={geselecteerdeDienst}
        />
      )}
    </div>
  );
};

export default DagIndelingInstelling;
