import React, { useState } from 'react';
import { DienstDag, DienstType } from '../types';
import './PatroonInstelling.css';

interface PatroonInstellingProps {
  dienstDagen: DienstDag[];
  setDienstDagen: React.Dispatch<React.SetStateAction<DienstDag[]>>;
  sluiten: () => void;
}

const PatroonInstelling: React.FC<PatroonInstellingProps> = ({
  dienstDagen,
  setDienstDagen,
  sluiten
}) => {
  // Standaard 10-daags patroon (2-2-2-4)
  const [patroon, setPatroon] = useState<DienstType[]>([
    'Ochtend', 'Ochtend',
    'Middag', 'Middag',
    'Nacht', 'Nacht',
    'Vrij', 'Vrij', 'Vrij', 'Vrij'
  ]);

  const [startDatum, setStartDatum] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const updatePatroonDag = (index: number, dienst: DienstType) => {
    const nieuwPatroon = [...patroon];
    nieuwPatroon[index] = dienst;
    setPatroon(nieuwPatroon);
  };

  const toepassen = () => {
    const start = new Date(startDatum);
    const nieuweDienstDagen: DienstDag[] = [];

    // Genereer 60 dagen (6 cycli) vanaf startdatum
    for (let i = 0; i < 60; i++) {
      const datum = new Date(start);
      datum.setDate(start.getDate() + i);

      // Bepaal welke dag in het patroon (0-9)
      const patroonIndex = i % patroon.length;

      nieuweDienstDagen.push({
        datum,
        dienst: patroon[patroonIndex],
        isHandmatigAangepast: false
      });
    }

    // Behoud handmatig aangepaste dagen
    const gecombinieerdeDagen = [...nieuweDienstDagen];

    dienstDagen.forEach((bestaandeDag: DienstDag) => {
      if (bestaandeDag.isHandmatigAangepast) {
        // Verwijder automatisch gegenereerde dag op dezelfde datum
        const index = gecombinieerdeDagen.findIndex(dag =>
          dag.datum.getDate() === bestaandeDag.datum.getDate() &&
          dag.datum.getMonth() === bestaandeDag.datum.getMonth() &&
          dag.datum.getFullYear() === bestaandeDag.datum.getFullYear()
        );

        if (index !== -1) {
          gecombinieerdeDagen[index] = bestaandeDag;
        } else {
          gecombinieerdeDagen.push(bestaandeDag);
        }
      }
    });

    setDienstDagen(gecombinieerdeDagen);
    sluiten();
  };

  return (
    <div className="patroon-instelling-overlay">
      <div className="patroon-instelling-container">
        <h2>Dienstpatroon Instellen</h2>

        <div className="startdatum-container">
          <label htmlFor="startdatum">Startdatum:</label>
          <input
            type="date"
            id="startdatum"
            value={startDatum}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDatum(e.target.value)}
          />
        </div>

        <div className="patroon-container">
          <h3>Patroon (10 dagen):</h3>
          <div className="patroon-dagen">
            {patroon.map((dienst: DienstType, index: number) => (
              <div key={index} className="patroon-dag">
                <span>Dag {index + 1}</span>
                <select
                  value={dienst}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updatePatroonDag(index, e.target.value as DienstType)}
                >
                  <option value="Ochtend">Ochtend</option>
                  <option value="Middag">Middag</option>
                  <option value="Nacht">Nacht</option>
                  <option value="Vrij">Vrij</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="patroon-knoppen">
          <button onClick={sluiten}>Annuleren</button>
          <button onClick={toepassen}>Toepassen</button>
        </div>
      </div>
    </div>
  );
}

export default PatroonInstelling;