import React, { useState } from "react";
import axios from "axios";
import { baseUrl,register } from "../../utilits/constants";

const HouseownerSignUpForm = () => {
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Validate the form fields

    // Create a new user account
    var username=fullName
    var email=emailAddress
    var usertype="houseowner"
    var phonenumber="8239995544"
    const response = await axios.post(baseUrl + register , {
      username,
      usertype,
      email,
      phonenumber,
      city,
      password,
    });

    // If the user account was created successfully, redirect to the login page
    if (response.status === 201) {
      window.location.href = "/login";
    } else {
      // Handle the error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="fullName"
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

      <input
        type="email"
        name="emailAddress"
        placeholder="Email address"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
      />

      <input
        type="text"
        name="city"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Sign up</button>
    </form>
  );
};

export default HouseownerSignUpForm;