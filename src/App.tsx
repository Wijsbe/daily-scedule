import { useState, useEffect } from 'react';
import './App.css';
import Kalender from './components/Kalender';
import DagWeergave from './components/DagWeergave';
import PatroonInstelling from './components/PatroonInstelling';
import DagIndelingInstelling from './components/DagIndelingInstelling';
import { DienstDag, DienstType, DienstSchema } from './types';
import { getStandaardDagSchema } from './utils/schemaUtils';
import { requestNotificationPermission } from './utils/notificaties';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

// Titels voor verschillende ploegenroosters
const ploegenTitels: Record<string, string> = {
  'tweeploegen': '2-Ploegenrooster',
  'drieploegen': '3-Ploegenrooster',
  'vijfploegen': '5-Ploegenrooster',
  'default': 'Ploegenrooster'
};

function App() {
  const [geselecteerdeDatum, setGeselecteerdeDatum] = useState<Date | null>(new Date());
  const [dienstDagen, setDienstDagen] = useState<DienstDag[]>(() => {
    const opgeslagen = localStorage.getItem('dienstDagen');
    return opgeslagen ? JSON.parse(opgeslagen, (key, value) => {
      if (key === 'datum') return new Date(value);
      return value;
    }) : [];
  });

  const [dienstSchema, setDienstSchema] = useState<DienstSchema>(() => {
    const opgeslagen = localStorage.getItem('dienstSchema');
    return opgeslagen ? JSON.parse(opgeslagen) : getStandaardDagSchema();
  });

  // Haal de geselecteerde preset op uit localStorage
  const [appTitel, setAppTitel] = useState<string>(() => {
    const preset = localStorage.getItem('geselecteerdePreset');
    return ploegenTitels[preset || 'default'];
  });

  const [toonPatroonInstelling, setToonPatroonInstelling] = useState(false);
  const [toonDagIndelingInstelling, setToonDagIndelingInstelling] = useState(false);
  const [teBewerkenActiviteit, setTeBewerkenActiviteit] = useState<{datum: Date, activiteit: any, index: number} | null>(null);

  // Update de app titel wanneer de preset verandert
  useEffect(() => {
    const handlePresetChange = () => {
      const preset = localStorage.getItem('geselecteerdePreset');
      setAppTitel(ploegenTitels[preset || 'default']);
    };

    // Luister naar veranderingen in localStorage
    window.addEventListener('storage', handlePresetChange);

    // Controleer regelmatig op veranderingen (als fallback)
    const interval = setInterval(handlePresetChange, 1000);

    return () => {
      window.removeEventListener('storage', handlePresetChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('dienstDagen', JSON.stringify(dienstDagen));
  }, [dienstDagen]);

  useEffect(() => {
    localStorage.setItem('dienstSchema', JSON.stringify(dienstSchema));
  }, [dienstSchema]);

  // Hulpfunctie om te controleren of twee datums dezelfde dag zijn
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Formatteer datum voor weergave met dag van de week
  const formateerDatum = (datum: Date): string => {
    return format(datum, 'EEE dd-MM-yyyy', { locale: nl });
  };

  // Exporteer de formateerDatum functie voor gebruik in andere componenten
  (window as any).formateerDatum = formateerDatum;

  const updateDienst = (datum: Date, dienst: DienstType) => {
    setDienstDagen(prev => {
      // Zoek of er al een dag bestaat voor deze datum
      const bestaandeDag = prev.find(dag => isSameDay(dag.datum, datum));

      if (bestaandeDag) {
        // Update de bestaande dag
        return prev.map(dag =>
          isSameDay(dag.datum, datum)
            ? { ...dag, dienst, isHandmatigAangepast: true }
            : dag
        );
      } else {
        // Voeg een nieuwe dag toe
        return [...prev, {
          datum: new Date(datum), // Maak een nieuwe Date instantie om referentieproblemen te voorkomen
          dienst,
          isHandmatigAangepast: true
        }];
      }
    });
  };

  // Functie om een activiteit te bewerken
  const bewerkenActiviteit = (datum: Date, activiteit: any, index: number) => {
    setTeBewerkenActiviteit({ datum, activiteit, index });
    setToonDagIndelingInstelling(true);
  };

  return (
    <div className="app">
      <header>
        <h1>{appTitel}</h1>
        <div className="header-buttons">
          <button onClick={() => setToonPatroonInstelling(true)}>
            Patroon Instellen
          </button>
          <button onClick={() => setToonDagIndelingInstelling(true)}>
            Dagindeling Instellen
          </button>
          <button onClick={requestNotificationPermission}>
            Notificaties Inschakelen
          </button>
        </div>
      </header>

      <main>
        <Kalender
          dienstDagen={dienstDagen}
          updateDienst={updateDienst}
          geselecteerdeDatum={geselecteerdeDatum}
          setGeselecteerdeDatum={setGeselecteerdeDatum}
        />

        {geselecteerdeDatum && (
          <DagWeergave
            datum={geselecteerdeDatum}
            dienstDagen={dienstDagen}
            dienstSchema={dienstSchema}
            bewerkenActiviteit={bewerkenActiviteit}
          />
        )}
      </main>

      {toonPatroonInstelling && (
        <PatroonInstelling
          dienstDagen={dienstDagen}
          setDienstDagen={setDienstDagen}
          sluiten={() => setToonPatroonInstelling(false)}
        />
      )}

      {toonDagIndelingInstelling && (
        <DagIndelingInstelling
          dienstSchema={dienstSchema}
          setDienstSchema={setDienstSchema}
          sluiten={() => {
            setToonDagIndelingInstelling(false);
            setTeBewerkenActiviteit(null);
          }}
          teBewerkenActiviteit={teBewerkenActiviteit}
        />
      )}
    </div>
  );
}

export default App;