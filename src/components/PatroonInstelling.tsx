import React, { useState, useEffect } from 'react';
import { DienstDag, DienstType } from '../types';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';
import './PatroonInstelling.css';

interface PatroonInstellingProps {
  dienstDagen: DienstDag[];
  setDienstDagen: React.Dispatch<React.SetStateAction<DienstDag[]>>;
  sluiten: () => void;
}

// Presets voor verschillende ploegenroosters
const ploegenPresets: {
  [key: string]: {
    naam: string;
    patroon: DienstType[];
  }
} = {
  'tweeploegen': {
    naam: '2-Ploegenrooster',
    patroon: [
      'Ochtend' as DienstType, 'Ochtend' as DienstType, 'Ochtend' as DienstType, 'Ochtend' as DienstType, 'Ochtend' as DienstType,
      'Middag' as DienstType, 'Middag' as DienstType, 'Middag' as DienstType, 'Middag' as DienstType, 'Middag' as DienstType,
      'Vrij' as DienstType, 'Vrij' as DienstType
    ]
  },
  'drieploegen': {
    naam: '3-Ploegenrooster',
    patroon: [
      'Ochtend' as DienstType, 'Ochtend' as DienstType, 'Ochtend' as DienstType, 'Ochtend' as DienstType, 'Ochtend' as DienstType,
      'Middag' as DienstType, 'Middag' as DienstType, 'Middag' as DienstType, 'Middag' as DienstType, 'Middag' as DienstType,
      'Nacht' as DienstType, 'Nacht' as DienstType, 'Nacht' as DienstType, 'Nacht' as DienstType, 'Nacht' as DienstType,
      'Vrij' as DienstType, 'Vrij' as DienstType, 'Vrij' as DienstType, 'Vrij' as DienstType, 'Vrij' as DienstType, 'Vrij' as DienstType
    ]
  },
  'vijfploegen': {
    naam: '5-Ploegenrooster (2-2-2-4)',
    patroon: [
      'Ochtend' as DienstType, 'Ochtend' as DienstType,
      'Middag' as DienstType, 'Middag' as DienstType,
      'Nacht' as DienstType, 'Nacht' as DienstType,
      'Vrij' as DienstType, 'Vrij' as DienstType, 'Vrij' as DienstType, 'Vrij' as DienstType
    ]
  }
};

const PatroonInstelling: React.FC<PatroonInstellingProps> = ({
  dienstDagen,
  setDienstDagen,
  sluiten
}) => {
  // Laad opgeslagen preset en patroon uit localStorage
  const [geselecteerdePreset, setGeselecteerdePreset] = useState<string>(() => {
    const opgeslagen = localStorage.getItem('geselecteerdePreset');
    return opgeslagen || 'vijfploegen';
  });

  // Laad opgeslagen patroon of gebruik preset als fallback
  const [patroon, setPatroon] = useState<DienstType[]>(() => {
    const opgeslagenPatroon = localStorage.getItem('patroon');
    if (opgeslagenPatroon) {
      try {
        return JSON.parse(opgeslagenPatroon);
      } catch (e) {
        console.error('Fout bij laden van opgeslagen patroon:', e);
      }
    }
    return ploegenPresets[geselecteerdePreset].patroon;
  });

  // Gebruik opgeslagen startdatum of huidige datum als fallback
  const vandaag = new Date();
  const [startDatum, setStartDatum] = useState<string>(() => {
    const opgeslagenDatum = localStorage.getItem('startDatum');
    return opgeslagenDatum || vandaag.toISOString().split('T')[0];
  });

  // Bereken datums voor elke dag in het patroon
  const [dagDatums, setDagDatums] = useState<Date[]>([]);

  // Update de datums wanneer startdatum of patroon verandert
  useEffect(() => {
    const start = new Date(startDatum);
    const nieuweDagDatums: Date[] = [];

    for (let i = 0; i < patroon.length; i++) {
      const datum = new Date(start);
      datum.setDate(start.getDate() + i);
      nieuweDagDatums.push(datum);
    }

    setDagDatums(nieuweDagDatums);
  }, [startDatum, patroon.length]);

  // Effect om wijzigingen op te slaan in localStorage
  useEffect(() => {
    localStorage.setItem('geselecteerdePreset', geselecteerdePreset);
  }, [geselecteerdePreset]);

  useEffect(() => {
    localStorage.setItem('patroon', JSON.stringify(patroon));
  }, [patroon]);

  useEffect(() => {
    localStorage.setItem('startDatum', startDatum);
  }, [startDatum]);

  // Functie om een dag in het patroon bij te werken
  const updatePatroonDag = (index: number, dienst: DienstType) => {
    const nieuwPatroon = [...patroon];
    nieuwPatroon[index] = dienst;
    setPatroon(nieuwPatroon);
  };

  // Functie om een dag toe te voegen aan het patroon
  const voegDagToe = () => {
    setPatroon([...patroon, 'Vrij' as DienstType]);
  };

  // Functie om een dag te verwijderen uit het patroon
  const verwijderDag = (index: number) => {
    if (patroon.length <= 1) return; // Voorkom dat alle dagen worden verwijderd

    const nieuwPatroon = [...patroon];
    nieuwPatroon.splice(index, 1);
    setPatroon(nieuwPatroon);
  };

  // Functie om een preset toe te passen
  const pasPresetToe = (presetKey: string) => {
    setGeselecteerdePreset(presetKey);
    setPatroon([...ploegenPresets[presetKey].patroon]);
  };

  const toepassen = () => {
    // Zorg ervoor dat de startdatum correct is geformatteerd
    const start = new Date(startDatum);

    // Verwijder ALLE bestaande dagen, inclusief handmatig aangepaste dagen
    // Dit zorgt ervoor dat het patroon volledig opnieuw wordt toegepast
    // We behouden alleen de handmatig aangepaste dagen voor later gebruik
    const handmatigAangepasteDagen = dienstDagen.filter(dag => dag.isHandmatigAangepast);

    // Maak een nieuwe array voor de dienstdagen
    const nieuweDienstDagen: DienstDag[] = [];

    // Genereer 90 dagen (9 cycli) vanaf startdatum voor betere dekking
    for (let i = 0; i < 90; i++) {
      const datum = new Date(start);
      datum.setDate(start.getDate() + i);

      // Bepaal welke dag in het patroon
      const patroonIndex = i % patroon.length;

      // Controleer of er een handmatig aangepaste dag bestaat voor deze datum
      // BELANGRIJK: We negeren handmatig aangepaste dagen voor de eerste dag (dag 1)
      // Dit zorgt ervoor dat dag 1 altijd de dienst krijgt die in het patroon is ingesteld
      const isEerstePatroonDag = i === 0;
      const bestaandeDag = !isEerstePatroonDag ? handmatigAangepasteDagen.find(dag =>
        isSameDay(dag.datum, datum)
      ) : null;

      if (bestaandeDag && !isEerstePatroonDag) {
        // Gebruik de handmatig aangepaste dag
        nieuweDienstDagen.push(bestaandeDag);
      } else {
        // Maak een nieuwe dag aan
        nieuweDienstDagen.push({
          datum: new Date(datum), // Maak een nieuwe Date instantie om referentieproblemen te voorkomen
          dienst: patroon[patroonIndex],
          isHandmatigAangepast: false
        });
      }
    }

    // Voeg eventuele handmatig aangepaste dagen toe die buiten het bereik van de nieuwe dagen vallen
    handmatigAangepasteDagen.forEach(aangepasteDag => {
      // Controleer of deze dag al is toegevoegd
      const isAlToegevoegd = nieuweDienstDagen.some(dag =>
        isSameDay(dag.datum, aangepasteDag.datum)
      );

      // Controleer of dit de eerste dag is (dag 1)
      const isEerstePatroonDag = isSameDay(aangepasteDag.datum, start);

      // Als de dag nog niet is toegevoegd en het is niet de eerste dag, voeg deze toe
      if (!isAlToegevoegd && !isEerstePatroonDag) {
        nieuweDienstDagen.push(aangepasteDag);
      }
    });

    // Hulpfunctie om te controleren of twee datums dezelfde dag zijn
    function isSameDay(date1: Date, date2: Date): boolean {
      return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
      );
    }

    // Sorteer de dagen op datum
    nieuweDienstDagen.sort((a, b) => a.datum.getTime() - b.datum.getTime());

    // Update de dienstdagen in de state
    setDienstDagen(nieuweDienstDagen);

    // Trigger een localStorage event om de app titel bij te werken
    // Dit is nodig omdat localStorage events alleen worden getriggerd bij wijzigingen vanuit andere tabs
    window.dispatchEvent(new Event('storage'));

    // Sluit het patroon instellingen venster
    sluiten();
  };

  // Formatteer datum voor weergave
  const formateerDatum = (datum: Date): string => {
    return format(datum, 'dd-MM-yyyy', { locale: nl });
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

        <div className="preset-container">
          <h3>Kies een preset:</h3>
          <div className="preset-knoppen">
            {Object.entries(ploegenPresets).map(([key, preset]) => (
              <button
                key={key}
                className={`preset-knop ${geselecteerdePreset === key ? 'actief' : ''}`}
                onClick={() => pasPresetToe(key)}
              >
                {preset.naam}
              </button>
            ))}
          </div>
        </div>

        <div className="patroon-container">
          <div className="patroon-header">
            <h3>Patroon ({patroon.length} dagen):</h3>
            <button className="toevoegen-knop" onClick={voegDagToe}>
              + Dag Toevoegen
            </button>
          </div>

          <div className="patroon-dagen">
            {patroon.map((dienst: DienstType, index: number) => {
              const datumVoorDag = dagDatums[index];
              const datumTekst = datumVoorDag ? formateerDatum(datumVoorDag) : '';

              return (
                <div key={index} className="patroon-dag">
                  <div className="patroon-dag-header">
                    <span className="dag-nummer">Dag {index + 1}</span>
                    {datumTekst && <span className="dag-datum">({datumTekst})</span>}
                    <button
                      className="verwijder-knop"
                      onClick={() => verwijderDag(index)}
                      title="Verwijder deze dag"
                    >
                      ×
                    </button>
                  </div>
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
              );
            })}
          </div>
        </div>

        <div className="patroon-knoppen">
          <button onClick={sluiten}>Annuleren</button>
          <button onClick={toepassen} className="toepassen-knop">Toepassen</button>
        </div>
      </div>
    </div>
  );
}

export default PatroonInstelling;