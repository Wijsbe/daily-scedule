import React, { useState } from 'react';
import { DagActiviteit, SportType } from '../types';
import './NieuweActiviteitModal.css';

interface NieuweActiviteitModalProps {
  toevoegen: (activiteit: DagActiviteit) => void;
  annuleren: () => void;
}

const NieuweActiviteitModal: React.FC<NieuweActiviteitModalProps> = ({
  toevoegen,
  annuleren
}) => {
  const [startTijd, setStartTijd] = useState<string>('08:00');
  const [eindTijd, setEindTijd] = useState<string>('09:00');
  const [type, setType] = useState<DagActiviteit['type']>('Werk');
  const [sportType, setSportType] = useState<SportType>('Push');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const nieuweActiviteit: DagActiviteit = {
      startTijd,
      eindTijd,
      type,
      ...(type === 'Sport' && { sportType })
    };
    
    toevoegen(nieuweActiviteit);
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
            <label htmlFor="activiteit-type">Type Activiteit:</label>
            <select
              id="activiteit-type"
              value={type}
              onChange={(e) => setType(e.target.value as DagActiviteit['type'])}
              required
            >
              <option value="Werk">Werk</option>
              <option value="Slaap">Slaap</option>
              <option value="Sport">Sport</option>
              <option value="Hobby/Studie">Hobby/Studie</option>
              <option value="Gezinstijd">Gezinstijd</option>
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
