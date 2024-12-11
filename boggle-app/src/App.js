import React, { useState } from 'react';
import ToggleGameState from './ToggleGameState';
import Board from './Board';
import GuessInput from './GuessInput';
import FoundSolutions from './FoundSolutions';
import SummaryResults from './SummaryResults';

function App() {
  const [gameState, setGameState] = useState('BEFORE');
  const [size, setSize] = useState(3);  // Default size is 3x3 grid
  const [foundSolutions, setFoundSolutions] = useState([]);
  const [totalTime, setTotalTime] = useState(0);

  const allSolutions = ['DOG', 'CAT', 'BAT', 'FAT']; // Example list of all valid solutions

  const correctAnswerFound = (answer) => {
    setFoundSolutions([...foundSolutions, answer]);
  };

  return (
    <div className="App">
      <ToggleGameState 
        gameState={gameState} 
        setGameState={setGameState} 
        setSize={setSize} 
        setTotalTime={setTotalTime} 
      />
      <Board board={generateBoard(size)} />
      <GuessInput 
        allSolutions={allSolutions} 
        foundSolutions={foundSolutions} 
        correctAnswerCallback={correctAnswerFound} 
      />
      <FoundSolutions 
        headerText="Solutions you've found" 
        words={foundSolutions} 
      />
      <SummaryResults 
        words={foundSolutions} 
        totalTime={totalTime} 
      />
    </div>
  );
}

// Example function to generate a random board based on size
const generateBoard = (size) => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const board = Array(size).fill(null).map(() =>
    Array(size).fill(null).map(() => letters[Math.floor(Math.random() * letters.length)])
  );
  return board;
}

export default App;
