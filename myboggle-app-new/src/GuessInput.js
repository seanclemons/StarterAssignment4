import React, { useState } from 'react';
import './GuessInput.css';

function GuessInput({allSolutions, foundSolutions, correctAnswerCallback, grid, dictionary}) {
  const [labelText, setLabelText] = useState("Make your first guess!");
  const [input, setInput] = useState("");

  function isValidWord(word) {
    return dictionary.has(word.toLowerCase());
  }

  function findWordInGrid(word) {
    if (!grid || !word || word.length < 3) return false;
    word = word.toUpperCase();

    function searchFromCell(row, col, wordIndex, visited) {
      if (wordIndex === word.length) return true;

      if (row < 0 || row >= grid.length ||
          col < 0 || col >= grid[0].length ||
          visited.has(`${row},${col}`) ||
          grid[row][col] !== word[wordIndex]) {
        return false;
      }

      visited.add(`${row},${col}`);

      const adjacentCells = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],           [0, 1],
        [1, -1],  [1, 0],  [1, 1]
      ];

      for (const [dx, dy] of adjacentCells) {
        const newRow = row + dx;
        const newCol = col + dy;
        const newVisited = new Set(visited);
        if (searchFromCell(newRow, newCol, wordIndex + 1, newVisited)) {
          return true;
        }
      }

      return false;
    }

    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        if (grid[row][col] === word[0]) {
          if (searchFromCell(row, col, 0, new Set())) {
            return true;
          }
        }
      }
    }

    return false;
  }

  function evaluateInput() {
    const wordToCheck = input.toUpperCase();
    
    if (wordToCheck.length < 3) {
      setLabelText("Words must be at least 3 letters long!");
      setInput("");
      return;
    }

    if (foundSolutions.includes(wordToCheck)) {
      setLabelText(wordToCheck + " has already been found!");
    } else if (!isValidWord(wordToCheck)) {
      setLabelText(wordToCheck + " is not a valid English word!");
    } else if (findWordInGrid(wordToCheck)) {
      correctAnswerCallback(wordToCheck);
      setLabelText(wordToCheck + " is correct!");
    } else {
      setLabelText(wordToCheck + " cannot be formed on the board!");
    }
    setInput("");
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      evaluateInput();
    }
  }

  function handleChange(event) {
    let value = event.target.value.toUpperCase();
    if (value.endsWith('Q')) {
      value += 'U';
    }
    setInput(value);
  }

  return (
    <div className="Guess-input">
      <div className="label-text">
        {labelText}
      </div>
      <input
        type="text"
        value={input}
        onKeyPress={handleKeyPress}
        onChange={handleChange}
        className="guess-text-input"
        placeholder="Enter your guess"
        autoFocus
      />
      <div className="helper-text">
        Find valid English words (3+ letters) by connecting adjacent letters
      </div>
    </div>
  );
}

export default GuessInput;