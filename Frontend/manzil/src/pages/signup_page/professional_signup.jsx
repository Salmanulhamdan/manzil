import React, { useState } from "react";
import axios from "axios";
import { baseUrl,register } from "../../utilits/constants";
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

const ProfessionalSignup = () => {
  const [fullName, setFullName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState(""); 
  const [experience, setExperience] = useState("");
  const navigate=useNavigate()

  const showErrorAlert = (error)=>{
    Swal.fire({
      title:"Error",
      text:error,
      icon:'error',
      confirmButtonText:"ok"
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Validate the form fields

    // Create a new user account
    var username=fullName
    var email=emailAddress
    var usertype="professional"
    var place=city
    var phonenumber=phone
    
    const response = await axios.post(baseUrl + register , {
      username,
      usertype,
      email,
      phonenumber,
      place,
      password,
      profession,    
      experience,
    }).then((response)=>{
      console.log('response' , response);
      navigate('/login');
     
    })
    .catch((e)=>{
      console.log('errr',e.response);
      showErrorAlert( e.response.data.error)
    })
  }

  return (
    <div className="flex h-screen">
    <div className="flex-1 bg-blue-500">
    {/* <img src="your-image-source.jpg" alt="Your Image" className="mr-4" /> */}
</div>
<div className="flex-1 flex justify-center items-center">
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
    <div className="mb-4">
      <input
        type="text"
        name="fullName"
        placeholder="Full name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        className="border rounded w-full py-2 px-3"
        required
      />
    </div>

    <div className="mb-4">
      <input
        type="email"
        name="emailAddress"
        placeholder="Email address"
        value={emailAddress}
        onChange={(e) => setEmailAddress(e.target.value)}
        className="border rounded w-full py-2 px-3"
        required
      />
    </div>

    <div className="mb-4">
      <input
        type="text"
        name="city"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border rounded w-full py-2 px-3"
      />
    </div>

    <div className="mb-4">
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="border rounded w-full py-2 px-3"
        pattern="^(?!([0-9])\1+$)[6789]\d{9}$"
        required
      />
    </div>

    <div className="mb-4">
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded w-full py-2 px-3"
        required
      />
    </div>
    <div className="mb-4">
      <input
        type="text"
        name="profession"
        placeholder="Profession"
        value={profession}
        onChange={(e) => setProfession(e.target.value)}
        className="border rounded w-full py-2 px-3"
      />
    </div>

    <div className="mb-4">
        <input
          type="number" 
          name="experience"
          placeholder="Experience"
          value={experience}
          onChange={(e) => setExperience(Math.max(parseInt(e.target.value, 10) || 0, 0))}
          className="border rounded w-full py-2 px-3"
        />
      </div>

    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700">
      Sign up
    </button>
  </form>
  </div>
  </div>
  );
};

export default ProfessionalSignup;
