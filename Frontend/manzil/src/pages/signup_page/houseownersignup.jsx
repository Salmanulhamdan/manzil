import React, { useState } from 'react';
import './houseowner.css';
import img from  "../../assets/signup.svg";

function HouseOwnerSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    city: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your signup logic for house owners here
  };

  return (
  <div className='signupform'>
    <div className='frame'>
       <img src={img} alt="signup" />
       </div>
      <h2>House Owner Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
        <label>Fullname:</label>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleInputChange}
        />
        </div>
        <div>
        <label>Email:</label>

        <input
          type="email"
          name="emailAddress"
          placeholder="Email Address"
          value={formData.emailAddress}
          onChange={handleInputChange}
        />
        </div>
        <div>
        <label>City:</label>

        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleInputChange}
        />
        </div>
        <div>
        <label>Password:</label>

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
        />
        </div>
        <button type="submit">Sign Up</button>
      </form>
  
    </div>
  );
}

export default HouseOwnerSignup;
