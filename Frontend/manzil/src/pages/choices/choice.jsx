import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ChoicePage.css'; // Import the CSS file you created

function ChoicePage() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
      <h1>Choose your Role</h1>
      <div className="card-container">
        <div className={`card ${selectedOption === "HOUSEOWNER" ? 'selected' : ''}`}>
          <label>
            <input
              type="radio"
              value="HOUSEOWNER"
              checked={selectedOption === "HOUSEOWNER"}
              onChange={handleOptionChange}
            />
            HOUSEOWNER
          </label>
        </div>
        <div className={`card ${selectedOption === "PROFESSIONAL" ? 'selected' : ''}`}>
          <label>
            <input
              type="radio"
              value="PROFESSIONAL"
              checked={selectedOption === "PROFESSIONAL"}
              onChange={handleOptionChange}
            />
            PROFESSIONAL
          </label>
        </div>
      </div>
      {selectedOption && <p>You selected: {selectedOption}</p>}

      {selectedOption && (
        <Link to={`/signup/${selectedOption.toLowerCase()}`}>
          <button className="continue-button">Continue</button>
        </Link>
      )}
    </div>
  );
}

export default ChoicePage;