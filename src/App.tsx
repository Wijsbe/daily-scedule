import { useState, useEffect } from 'react';
import './App.css';
import Kalender from './components/Kalender';
import DagWeergave from './components/DagWeergave';
import PatroonInstelling from './components/PatroonInstelling';
import DagIndelingInstelling from './components/DagIndelingInstelling';
import { DienstDag, DienstType, DienstSchema } from './types';
import { getStandaardDagSchema } from './utils/schemaUtils';
import { requestNotificationPermission } from './utils/notificaties';

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
  
  const [toonPatroonInstelling, setToonPatroonInstelling] = useState(false);
  const [toonDagIndelingInstelling, setToonDagIndelingInstelling] = useState(false);

  useEffect(() => {
    localStorage.setItem('dienstDagen', JSON.stringify(dienstDagen));
  }, [dienstDagen]);

  useEffect(() => {
    localStorage.setItem('dienstSchema', JSON.stringify(dienstSchema));
  }, [dienstSchema]);

  const updateDienst = (datum: Date, dienst: DienstType) => {
    setDienstDagen(prev => {
      const bestaandeDag = prev.find(dag => 
        dag.datum.getDate() === datum.getDate() && 
        dag.datum.getMonth() === datum.getMonth() && 
        dag.datum.getFullYear() === datum.getFullYear()
      );
      
      if (bestaandeDag) {
        return prev.map(dag => 
          dag.datum.getDate() === datum.getDate() && 
          dag.datum.getMonth() === datum.getMonth() && 
          dag.datum.getFullYear() === datum.getFullYear()
            ? { ...dag, dienst, isHandmatigAangepast: true }
            : dag
        );
      } else {
        return [...prev, { datum, dienst, isHandmatigAangepast: true }];
      }
    });
  };

  return (
    <div className="app">
      <header>
        <h1>5-Ploegenrooster</h1>
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
          sluiten={() => setToonDagIndelingInstelling(false)}
        />
      )}
    </div>
  );
}

export default App;