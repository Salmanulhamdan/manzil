import React, { useState } from 'react';

function ChoicePage() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div>
      <h1>Choose your role</h1>
      <div>
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
      <div>
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
      {selectedOption && <p>You selected: {selectedOption}</p>}
    </div>
  );
}

export default ChoicePage;
