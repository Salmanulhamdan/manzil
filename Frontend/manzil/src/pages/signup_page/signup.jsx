import React, { useState } from 'react';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phonenumber: '',
    profile_photo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      profile_photo: file,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send the form data to your backend or perform any other desired actions
    console.log(formData);
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phonenumber"
            value={formData.phonenumber}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Profile Photo:</label>
          <input
            type="file"
            name="profile_photo"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupPage;
