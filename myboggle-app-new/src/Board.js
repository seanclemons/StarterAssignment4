import React from 'react';
import './Board.css';

function Board({ board }) {
  if (!board || !board.length) return null;

  const size = board.length;

  return (
    <div className={`Board-div size-${size}`}>
      <div className="board-inner">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="Board-row-container">
            <div className="Board-row">
              {row.map((letter, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="Tile">
                  <div className="Paper">
                    {letter}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Board;