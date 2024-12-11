import React, { useState } from 'react';
import { Button, FormControl, Select, MenuItem } from '@mui/material';

function ToggleGameState({ gameState, setGameState, setSize, setTotalTime }) {
  const [buttonText, setButtonText] = useState("Start a new game!");
  const [startTime, setStartTime] = useState(0);
  let deltaTime;

  function updateGameState(endTime) {
    if (gameState === 'BEFORE' || gameState === 'ENDED') {
      setStartTime(Date.now());
      setGameState('IN_PROGRESS');
      setButtonText("End game");
    } else if (gameState === 'IN_PROGRESS') {
      deltaTime = (endTime - startTime) / 1000.0;
      setTotalTime(deltaTime);
      setGameState('ENDED');
      setButtonText("Start a new game!");
    }
  }

  const handleChange = (event) => {
    setSize(event.target.value);
  };

  return (
    <div className="Toggle-game-state">
      <Button variant="outlined" onClick={() => updateGameState(Date.now())}>
        {buttonText}
      </Button>

      { (gameState === 'BEFORE' || gameState === 'ENDED') &&
        <div className="Input-select-size">
          <FormControl>
            <Select
              labelId="sizelabel"
              id="sizemenu"
              onChange={handleChange}
            >
              <MenuItem value={3}>3x3</MenuItem>
              <MenuItem value={4}>4x4</MenuItem>
              <MenuItem value={5}>5x5</MenuItem>
            </Select>
          </FormControl>
        </div>
      }
    </div>
  );
}

export default ToggleGameState;
