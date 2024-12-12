import React from 'react';
import { GAME_STATE } from './GameState.js';
import './ToggleGameState.css';

function ToggleGameState({ gameState, size, setSize, updateGameState }) {
  const getButtonText = () => {
    switch (gameState) {
      case GAME_STATE.BEFORE:
        return "Start Game";
      case GAME_STATE.IN_PROGRESS:
        return "End Game";
      case GAME_STATE.ENDED:
        return "Start New Game";
      default:
        return "Start Game";
    }
  };

  const handleGameStateToggle = () => {
    if (gameState === GAME_STATE.IN_PROGRESS) {
      updateGameState(GAME_STATE.ENDED, Date.now());
    } else {
      updateGameState(GAME_STATE.IN_PROGRESS);
    }
  };

  const handleChange = (event) => {
    setSize(parseInt(event.target.value));
  };

  return (
    <div className="Toggle-game-state">
      <button onClick={handleGameStateToggle} className="game-button">
        {getButtonText()}
      </button>

      <div className="Input-select-size">
        <select
          value={size}
          onChange={handleChange}
          className="size-select"
        >
          {[3, 4, 5, 6, 7, 8, 9, 10].map(value => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
        <div className="helper-text">Set Grid Size</div>
      </div>
    </div>
  );
}

export default ToggleGameState;