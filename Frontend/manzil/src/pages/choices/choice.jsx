import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import './ChoicePage.css';

function ChoicePage() {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="flex items-center justify-center" style={{ height: '70vh' }}>
    <div className="text-center border rounded-lg shadow-lg w-50 h-80">
    <br></br>
      <h1 className="text-2xl font-bold mb-4">Choose Your Role</h1>
      
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div className={`card p-4 ${selectedOption === 'HOUSEOWNER' ? 'selected' : ''}`}>
            <label className="cursor-pointer block w-full">
              <input
                type="radio"
                value="HOUSEOWNER"
                checked={selectedOption === 'HOUSEOWNER'}
                onChange={handleOptionChange}
                className="mr-2 cursor-pointer"
              />
              HOUSEOWNER
            </label>
          </div>
          <div className={`card p-4 ${selectedOption === 'PROFESSIONAL' ? 'selected' : ''}`}>
            <label className="cursor-pointer block w-full">
              <input
                type="radio"
                value="PROFESSIONAL"
                checked={selectedOption === 'PROFESSIONAL'}
                onChange={handleOptionChange}
                className="mr-2 cursor-pointer"
              />
              PROFESSIONAL
            </label>
          </div>
        </div>
      </div>
      {selectedOption && <p>You selected: {selectedOption}</p>}
      {selectedOption && (
        <Link to={`/signup/${selectedOption.toLowerCase()}`}>
          <button className="continue-button mt-4 bg-teal-400 hover:bg-teal-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
  Continue
</button>
        </Link>
      )}
    </div>
  </div>
  );
}

export default ChoicePage;