import React from 'react';
import './SummaryResults.css';

function SummaryResults({ totalWords = 0, totalTime = 0 }) {
  return (
    <div className="Summary">
      <h2>SUMMARY</h2>    
      <div>
        <li>Total Words Found: {totalWords}</li>
      </div>
      <div>
        <li>Total Time: {totalTime.toFixed(2)} secs</li>
      </div>    
    </div>
  );
}

export default SummaryResults;