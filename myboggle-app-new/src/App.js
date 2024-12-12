import React, { useState, useEffect } from 'react';
import Board from './Board.js';
import GuessInput from './GuessInput.js';
import FoundSolutions from './FoundSolutions.js';
import SummaryResults from './SummaryResults.js';
import ToggleGameState from './ToggleGameState.js';
import { GAME_STATE } from './GameState.js';
import './App.css';

// Dice patterns for more realistic Boggle letter distribution
const BOGGLE_DICE = [
  'AAEEGN', 'ABBJOO', 'ACHOPS', 'AFFKPS',
  'AOOTTW', 'CIMOTU', 'DEILRX', 'DELRVY',
  'DISTTY', 'EEGHNW', 'EEINSU', 'EHRTVW',
  'EIOSST', 'ELRTTY', 'HIMNQU', 'HLNNRZ'
];

const LETTER_FREQ = {
  'A': 8.2, 'B': 1.5, 'C': 2.8, 'D': 4.3, 'E': 13, 'F': 2.2, 'G': 2.0, 'H': 6.1,
  'I': 7.0, 'J': 0.15, 'K': 0.77, 'L': 4.0, 'M': 2.4, 'N': 6.7, 'O': 7.5, 'P': 1.9,
  'Q': 0.8, 'R': 6.0, 'S': 4.0, 'T': 9.4, 'U': 2.8, 'V': 0.98, 'W': 2.4,
  'X': 0.15, 'Y': 2.0, 'Z': 0.074
};

function generateGrid(size) {
  const grid = [];
  if (size <= 4) {
    const shuffledDice = [...BOGGLE_DICE].sort(() => Math.random() - 0.5);
    for (let i = 0; i < size; i++) {
      const row = [];
      for (let j = 0; j < size; j++) {
        const dieIndex = i * size + j;
        if (dieIndex < shuffledDice.length) {
          const die = shuffledDice[dieIndex];
          row.push(die.charAt(Math.floor(Math.random() * die.length)));
        } else {
          const randomDie = BOGGLE_DICE[Math.floor(Math.random() * BOGGLE_DICE.length)];
          row.push(randomDie.charAt(Math.floor(Math.random() * randomDie.length)));
        }
      }
      grid.push(row);
    }
  } else {
    const letters = [];
    for (const [letter, freq] of Object.entries(LETTER_FREQ)) {
      const count = Math.round(freq * size * size / 100);
      letters.push(...Array(count).fill(letter));
    }
    
    while (letters.length < size * size) {
      letters.push(['E', 'A', 'I', 'O', 'N', 'T', 'R'][Math.floor(Math.random() * 7)]);
    }
    
    letters.sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < size; i++) {
      grid.push(letters.slice(i * size, (i + 1) * size));
    }
  }
  return grid;
}

const GAME_DURATION = 180; // 3 minutes in seconds

function App() {
  const [allSolutions, setAllSolutions] = useState([]);
  const [foundSolutions, setFoundSolutions] = useState([]);
  const [gameState, setGameState] = useState(GAME_STATE.BEFORE);
  const [grid, setGrid] = useState([]);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [size, setSize] = useState(4);
  const [dictionary, setDictionary] = useState(new Set());

  // Load dictionary when component mounts
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/dwyl/english-words/master/words_dictionary.json')
      .then(response => response.json())
      .then(data => {
        const validWords = new Set(Object.keys(data).filter(word => word.length >= 3));
        setDictionary(validWords);
      })
      .catch(error => {
        console.error('Error loading dictionary:', error);
        // Set a minimal dictionary as fallback
        setDictionary(new Set(['CAT', 'DOG', 'RAT']));
      });
  }, []);

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState === GAME_STATE.IN_PROGRESS) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setGameState(GAME_STATE.ENDED);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Game state effect
  useEffect(() => {
    if (gameState === GAME_STATE.IN_PROGRESS) {
      const newGrid = generateGrid(size);
      setGrid(newGrid);
      setFoundSolutions([]);
      setTimeLeft(GAME_DURATION);
      setAllSolutions([]);
    }
  }, [gameState, size]);

  const correctAnswerFound = (answer) => {
    setFoundSolutions(prev => [...prev, answer]);
  };

  const updateGameState = (newState) => {
    setGameState(newState);
  };

  return (
    <div className="App">
      <h1>Boggle Game</h1>
      
      <ToggleGameState 
        gameState={gameState}
        size={size}
        setSize={setSize}
        updateGameState={updateGameState}
      />

      {gameState !== GAME_STATE.BEFORE && (
        <div>
          {gameState === GAME_STATE.IN_PROGRESS && (
            <div className="timer">
              Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          <Board board={grid} />
          
          {gameState === GAME_STATE.IN_PROGRESS && (
            <GuessInput 
              allSolutions={allSolutions}
              foundSolutions={foundSolutions}
              correctAnswerCallback={correctAnswerFound}
              grid={grid}
              dictionary={dictionary}
            />
          )}

          <FoundSolutions 
            words={foundSolutions}
            headerText="Words Found"
          />

          {gameState === GAME_STATE.ENDED && (
            <SummaryResults 
              totalWords={foundSolutions.length}
              totalTime={GAME_DURATION - timeLeft}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;