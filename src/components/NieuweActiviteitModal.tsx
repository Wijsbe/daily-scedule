import React, { useState, useEffect } from 'react';
import { DagActiviteit, SportType, ActiviteitType, HerhaalOptie } from '../types';
import { getAlleActiviteitTypes, voegActiviteitTypeToe, verwijderActiviteitType } from '../utils/schemaUtils';
import './NieuweActiviteitModal.css';

interface NieuweActiviteitModalProps {
  toevoegen: (activiteit: DagActiviteit, herhaalOptie: HerhaalOptie) => void;
  annuleren: () => void;
  geselecteerdeDienst?: string;
}

const NieuweActiviteitModal: React.FC<NieuweActiviteitModalProps> = ({
  toevoegen,
  annuleren,
  geselecteerdeDienst
}) => {
  const [startTijd, setStartTijd] = useState<string>('08:00');
  const [eindTijd, setEindTijd] = useState<string>('09:00');
  const [type, setType] = useState<ActiviteitType>('Werk');
  const [sportType, setSportType] = useState<SportType>('Push');
  const [nieuwType, setNieuwType] = useState<string>('');
  const [activiteitTypes, setActiviteitTypes] = useState<ActiviteitType[]>([]);
  const [actie, setActie] = useState<'kies' | 'toevoegen' | 'verwijderen'>('kies');
  const [herhaalOptieType, setHerhaalOptieType] = useState<HerhaalOptie['type']>('Geen');
  const [herhaalOptieWaarde, setHerhaalOptieWaarde] = useState<string>('');

  // Laad alle activiteitstypen bij het openen van de modal
  useEffect(() => {
    setActiviteitTypes(getAlleActiviteitTypes());
  }, []);

  // Voeg een nieuw activiteitstype toe
  const handleTypeToevoegen = () => {
    if (nieuwType.trim() !== '') {
      voegActiviteitTypeToe(nieuwType);
      setActiviteitTypes(getAlleActiviteitTypes());
      setNieuwType('');
      setActie('kies');
      setType(nieuwType); // Selecteer het nieuwe type automatisch
    }
  };

  // Verwijder een activiteitstype
  const handleTypeVerwijderen = () => {
    if (type && type !== 'Werk' && type !== 'Slaap' && type !== 'Sport' && type !== 'Hobby/Studie' && type !== 'Gezinstijd') {
      verwijderActiviteitType(type as string);
      setActiviteitTypes(getAlleActiviteitTypes());
      setType('Werk'); // Reset naar een standaard type
      setActie('kies');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Als we bezig zijn met toevoegen of verwijderen van een type, doe dat eerst
    if (actie === 'toevoegen') {
      handleTypeToevoegen();
      return;
    } else if (actie === 'verwijderen') {
      handleTypeVerwijderen();
      return;
    }

    // Maak de nieuwe activiteit
    const nieuweActiviteit: DagActiviteit = {
      startTijd,
      eindTijd,
      type,
      ...(type === 'Sport' && { sportType })
    };

    // Maak de herhaaloptie
    const herhaalOptie: HerhaalOptie = {
      type: herhaalOptieType,
      waarde: herhaalOptieWaarde
    };

    toevoegen(nieuweActiviteit, herhaalOptie);
  };

  return (
    <div className="nieuwe-activiteit-overlay">
      <div className="nieuwe-activiteit-container">
        <h2>Nieuwe Activiteit Toevoegen</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="start-tijd">Starttijd:</label>
              <input
                type="time"
                id="start-tijd"
                value={startTijd}
                onChange={(e) => setStartTijd(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="eind-tijd">Eindtijd:</label>
              <input
                type="time"
                id="eind-tijd"
                value={eindTijd}
                onChange={(e) => setEindTijd(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <div className="type-selector">
              <label>Type Activiteit:</label>
              <div className="type-radio-group">
                <label>
                  <input
                    type="radio"
                    name="type-selector"
                    checked={actie === 'kies'}
                    onChange={() => setActie('kies')}
                  />
                  Kies type
                </label>
                <label>
                  <input
                    type="radio"
                    name="type-selector"
                    checked={actie === 'toevoegen'}
                    onChange={() => setActie('toevoegen')}
                  />
                  Type toevoegen
                </label>
                <label>
                  <input
                    type="radio"
                    name="type-selector"
                    checked={actie === 'verwijderen'}
                    onChange={() => setActie('verwijderen')}
                  />
                  Type verwijderen
                </label>
              </div>
            </div>
          </div>

          {actie === 'kies' && (
            <div className="form-group">
              <label htmlFor="activiteit-type">Kies type:</label>
              <select
                id="activiteit-type"
                value={type}
                onChange={(e) => setType(e.target.value as ActiviteitType)}
                required
              >
                {activiteitTypes.map((activiteitType) => (
                  <option key={activiteitType} value={activiteitType}>
                    {activiteitType}
                  </option>
                ))}
              </select>
            </div>
          )}

          {actie === 'toevoegen' && (
            <div className="form-group">
              <label htmlFor="nieuw-type">Nieuw type:</label>
              <div className="input-with-button">
                <input
                  type="text"
                  id="nieuw-type"
                  value={nieuwType}
                  onChange={(e) => setNieuwType(e.target.value)}
                  placeholder="Bijv. Meditatie, Koken, etc."
                  required={actie === 'toevoegen'}
                />
                <button
                  type="button"
                  className="action-button"
                  onClick={handleTypeToevoegen}
                  disabled={!nieuwType.trim()}
                >
                  Toevoegen
                </button>
              </div>
            </div>
          )}

          {actie === 'verwijderen' && (
            <div className="form-group">
              <label htmlFor="verwijder-type">Verwijder type:</label>
              <div className="input-with-button">
                <select
                  id="verwijder-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as ActiviteitType)}
                  required
                >
                  {activiteitTypes
                    .filter(t => !['Werk', 'Slaap', 'Sport', 'Hobby/Studie', 'Gezinstijd'].includes(t as string))
                    .map((activiteitType) => (
                      <option key={activiteitType} value={activiteitType}>
                        {activiteitType}
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  className="action-button delete"
                  onClick={handleTypeVerwijderen}
                  disabled={['Werk', 'Slaap', 'Sport', 'Hobby/Studie', 'Gezinstijd'].includes(type as string)}
                >
                  Verwijderen
                </button>
              </div>
              {['Werk', 'Slaap', 'Sport', 'Hobby/Studie', 'Gezinstijd'].includes(type as string) && (
                <p className="error-message">Standaard types kunnen niet worden verwijderd</p>
              )}
            </div>
          )}

          {type === 'Sport' && actie === 'kies' && (
            <div className="form-group">
              <label htmlFor="sport-type">Sport Type:</label>
              <select
                id="sport-type"
                value={sportType}
                onChange={(e) => setSportType(e.target.value as SportType)}
                required
              >
                <option value="Push">Push</option>
                <option value="Pull">Pull</option>
                <option value="Full Body">Full Body</option>
                <option value="Cardio + Core">Cardio + Core</option>
                <option value="Mobility">Mobility</option>
              </select>
            </div>
          )}

          {actie === 'kies' && (
            <div className="form-group">
              <label>Herhaal optie:</label>
              <select
                value={herhaalOptieType}
                onChange={(e) => setHerhaalOptieType(e.target.value as HerhaalOptie['type'])}
                className="herhaal-select"
              >
                <option value="Geen">Geen herhaling</option>
                <option value="Dienst">Herhaal voor alle {geselecteerdeDienst} diensten</option>
                <option value="Dag">Herhaal elke X dagen</option>
                <option value="Week">Herhaal elke X weken</option>
              </select>

              {(herhaalOptieType === 'Dag' || herhaalOptieType === 'Week') && (
                <div className="herhaal-waarde">
                  <label>Herhaal elke:</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={herhaalOptieWaarde}
                    onChange={(e) => setHerhaalOptieWaarde(e.target.value)}
                    required={herhaalOptieType === 'Dag' || herhaalOptieType === 'Week'}
                  />
                  <span>{herhaalOptieType === 'Dag' ? 'dagen' : 'weken'}</span>
                </div>
              )}
            </div>
          )}

          <div className="modal-buttons">
            <button type="button" className="cancel-button" onClick={annuleren}>
              Annuleren
            </button>
            <button type="submit" className="save-button">
              Toevoegen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NieuweActiviteitModal;
