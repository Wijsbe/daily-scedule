import React from 'react';
import { SportType } from '../types';
import './SportDagSchema.css';

interface SportDagSchemaProps {
  sportType: SportType;
  onClose: () => void;
}

interface OefeningItem {
  naam: string;
  sets?: string;
  herhalingen?: string;
  duur?: string;
  rust?: string;
  opmerking?: string;
}

interface SportSchema {
  titel: string;
  beschrijving: string;
  oefeningen: OefeningItem[];
}

const SportDagSchema: React.FC<SportDagSchemaProps> = ({ sportType, onClose }) => {
  // Schema's voor verschillende sport types
  const sportSchemas: Record<SportType, SportSchema> = {
    'Push': {
      titel: 'Push Workout',
      beschrijving: 'Focus op borst, schouders en triceps',
      oefeningen: [
        { naam: 'Bankdrukken', sets: '3-4', herhalingen: '8-12', rust: '90 sec' },
        { naam: 'Incline Dumbbell Press', sets: '3', herhalingen: '10-12', rust: '60 sec' },
        { naam: 'Shoulder Press', sets: '3', herhalingen: '10-12', rust: '60 sec' },
        { naam: 'Lateral Raises', sets: '3', herhalingen: '12-15', rust: '45 sec' },
        { naam: 'Tricep Pushdowns', sets: '3', herhalingen: '12-15', rust: '45 sec' },
        { naam: 'Dips', sets: '3', herhalingen: 'Tot falen', rust: '60 sec' }
      ]
    },
    'Pull': {
      titel: 'Pull Workout',
      beschrijving: 'Focus op rug en biceps',
      oefeningen: [
        { naam: 'Pull-ups / Lat Pulldowns', sets: '3-4', herhalingen: '8-12', rust: '90 sec' },
        { naam: 'Barbell Rows', sets: '3', herhalingen: '8-12', rust: '60 sec' },
        { naam: 'Seated Cable Rows', sets: '3', herhalingen: '10-12', rust: '60 sec' },
        { naam: 'Face Pulls', sets: '3', herhalingen: '12-15', rust: '45 sec' },
        { naam: 'Bicep Curls', sets: '3', herhalingen: '10-12', rust: '45 sec' },
        { naam: 'Hammer Curls', sets: '3', herhalingen: '10-12', rust: '45 sec' }
      ]
    },
    'Full Body': {
      titel: 'Full Body Workout',
      beschrijving: 'Complete lichaamstraining',
      oefeningen: [
        { naam: 'Squats', sets: '3', herhalingen: '8-12', rust: '90 sec' },
        { naam: 'Bench Press', sets: '3', herhalingen: '8-12', rust: '90 sec' },
        { naam: 'Deadlifts', sets: '3', herhalingen: '8-10', rust: '120 sec' },
        { naam: 'Overhead Press', sets: '3', herhalingen: '8-12', rust: '60 sec' },
        { naam: 'Pull-ups / Lat Pulldowns', sets: '3', herhalingen: '8-12', rust: '60 sec' },
        { naam: 'Lunges', sets: '2', herhalingen: '10 per been', rust: '60 sec' },
        { naam: 'Plank', duur: '3 x 30-60 sec', rust: '30 sec' }
      ]
    },
    'Cardio + Core': {
      titel: 'Cardio & Core Workout',
      beschrijving: 'Cardiovasculaire training en core stabiliteit',
      oefeningen: [
        { naam: 'Warming-up', duur: '5 min', opmerking: 'Lichte cardio (joggen, fietsen)' },
        { naam: 'HIIT Circuit', duur: '20 min', opmerking: '30 sec werk, 30 sec rust (Burpees, Mountain Climbers, Jumping Jacks, High Knees)' },
        { naam: 'Plank Variaties', duur: '3 x 30-60 sec', rust: '30 sec' },
        { naam: 'Russian Twists', sets: '3', herhalingen: '20 totaal', rust: '30 sec' },
        { naam: 'Leg Raises', sets: '3', herhalingen: '12-15', rust: '30 sec' },
        { naam: 'Bicycle Crunches', sets: '3', herhalingen: '20 totaal', rust: '30 sec' },
        { naam: 'Cool-down', duur: '5 min', opmerking: 'Lichte cardio en stretching' }
      ]
    },
    'Mobility': {
      titel: 'Mobility & Recovery',
      beschrijving: 'Focus op flexibiliteit en herstel',
      oefeningen: [
        { naam: 'Foam Rolling', duur: '10 min', opmerking: 'Focus op strakke spiergroepen' },
        { naam: 'Dynamic Stretching', duur: '5-10 min', opmerking: 'Arm circles, leg swings, hip rotations' },
        { naam: 'Yoga Flow', duur: '20 min', opmerking: 'Basis yoga poses voor flexibiliteit' },
        { naam: 'Static Stretching', duur: '10 min', opmerking: 'Hou elke stretch 30 sec vast' },
        { naam: 'Ademhalingsoefeningen', duur: '5 min', opmerking: 'Diepe buikademhaling voor ontspanning' }
      ]
    }
  };

  const schema = sportSchemas[sportType];

  return (
    <div className="sport-schema-overlay">
      <div className="sport-schema-container">
        <button className="sluit-knop" onClick={onClose}>×</button>
        
        <h2>{schema.titel}</h2>
        <p className="schema-beschrijving">{schema.beschrijving}</p>
        
        <div className="oefeningen-lijst">
          <div className="oefening-header">
            <span className="oefening-naam-header">Oefening</span>
            <span className="oefening-details-header">Details</span>
          </div>
          
          {schema.oefeningen.map((oefening, index) => (
            <div key={index} className="oefening-item">
              <div className="oefening-naam">{oefening.naam}</div>
              <div className="oefening-details">
                {oefening.sets && oefening.herhalingen && (
                  <span>{oefening.sets} sets × {oefening.herhalingen}</span>
                )}
                {oefening.duur && (
                  <span>{oefening.duur}</span>
                )}
                {oefening.rust && (
                  <span className="rust-tijd">Rust: {oefening.rust}</span>
                )}
                {oefening.opmerking && (
                  <div className="oefening-opmerking">{oefening.opmerking}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SportDagSchema;
