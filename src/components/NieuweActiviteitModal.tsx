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
  const [actie, setActie] = useState<'toevoegen' | 'verwijderen'>('toevoegen');
  const [herhaalOptieType, setHerhaalOptieType] = useState<HerhaalOptie['type']>('Geen');

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
      setActie('toevoegen');
      setType(nieuwType); // Selecteer het nieuwe type automatisch
    }
  };

  // Verwijder een activiteitstype
  const handleTypeVerwijderen = () => {
    if (type && type !== 'Werk' && type !== 'Slaap' && type !== 'Sport' && type !== 'Hobby/Studie' && type !== 'Gezinstijd') {
      verwijderActiviteitType(type as string);
      setActiviteitTypes(getAlleActiviteitTypes());
      setType('Werk'); // Reset naar een standaard type
      setActie('toevoegen');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Maak de nieuwe activiteit
    const nieuweActiviteit: DagActiviteit = {
      startTijd,
      eindTijd,
      type,
      ...(type === 'Sport' && { sportType })
    };

    // Maak de herhaaloptie
    const herhaalOptie: HerhaalOptie = {
      type: herhaalOptieType
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
            <label>Type Activiteit:</label>
            <div className="action-buttons-container">
              <button
                type="button"
                className={`action-button add-button ${actie === 'toevoegen' ? 'active' : ''}`}
                onClick={() => setActie('toevoegen')}
              >
                Type toevoegen
              </button>
              <button
                type="button"
                className={`action-button delete-button ${actie === 'verwijderen' ? 'active' : ''}`}
                onClick={() => setActie('verwijderen')}
              >
                Type verwijderen
              </button>
            </div>
          </div>

          {actie === 'toevoegen' ? (
            <div className="form-group">
              <label htmlFor="nieuw-type">Nieuw type:</label>
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
                className="action-button add-button"
                onClick={handleTypeToevoegen}
                disabled={!nieuwType.trim()}
              >
                Type Toevoegen
              </button>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="verwijder-type">Verwijder type:</label>
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
                className="action-button delete-button"
                onClick={handleTypeVerwijderen}
                disabled={['Werk', 'Slaap', 'Sport', 'Hobby/Studie', 'Gezinstijd'].includes(type as string)}
              >
                Type Verwijderen
              </button>
              {['Werk', 'Slaap', 'Sport', 'Hobby/Studie', 'Gezinstijd'].includes(type as string) && (
                <p className="error-message">Standaard types kunnen niet worden verwijderd</p>
              )}
            </div>
          )}

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

          {type === 'Sport' && (
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

          <div className="form-group">
            <label>Herhaal optie:</label>
            <select
              value={herhaalOptieType}
              onChange={(e) => setHerhaalOptieType(e.target.value as HerhaalOptie['type'])}
              className="herhaal-select"
            >
              <option value="Geen">Geen herhaling</option>
              <option value="Ochtend">Herhaal voor alle Ochtend diensten</option>
              <option value="Middag">Herhaal voor alle Middag diensten</option>
              <option value="Nacht">Herhaal voor alle Nacht diensten</option>
            </select>
          </div>

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
