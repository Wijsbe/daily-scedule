import React, { useState } from 'react';
import { DagActiviteit, SportType, ActiviteitType } from '../types';
import './NieuweActiviteitModal.css';

interface NieuweActiviteitModalProps {
  toevoegen: (activiteit: DagActiviteit, maakPreset: boolean) => void;
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
  const [customType, setCustomType] = useState<string>('');
  const [useCustomType, setUseCustomType] = useState<boolean>(false);
  const [maakPreset, setMaakPreset] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const effectieveType = useCustomType ? customType : type;

    const nieuweActiviteit: DagActiviteit = {
      startTijd,
      eindTijd,
      type: effectieveType,
      ...(type === 'Sport' && { sportType }),
      ...(useCustomType && { isCustomType: true })
    };

    toevoegen(nieuweActiviteit, maakPreset);
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
                    checked={!useCustomType}
                    onChange={() => setUseCustomType(false)}
                  />
                  Standaard type
                </label>
                <label>
                  <input
                    type="radio"
                    name="type-selector"
                    checked={useCustomType}
                    onChange={() => setUseCustomType(true)}
                  />
                  Aangepast type
                </label>
              </div>
            </div>
          </div>

          {!useCustomType ? (
            <div className="form-group">
              <label htmlFor="activiteit-type">Kies type:</label>
              <select
                id="activiteit-type"
                value={type}
                onChange={(e) => setType(e.target.value as ActiviteitType)}
                required
              >
                <option value="Werk">Werk</option>
                <option value="Slaap">Slaap</option>
                <option value="Sport">Sport</option>
                <option value="Hobby/Studie">Hobby/Studie</option>
                <option value="Gezinstijd">Gezinstijd</option>
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label htmlFor="custom-type">Aangepast type:</label>
              <input
                type="text"
                id="custom-type"
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="Bijv. Meditatie, Koken, etc."
                required={useCustomType}
              />
            </div>
          )}

          {type === 'Sport' && !useCustomType && (
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

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={maakPreset}
                onChange={(e) => setMaakPreset(e.target.checked)}
              />
              Maak preset voor alle {geselecteerdeDienst || ''} diensten
            </label>
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
