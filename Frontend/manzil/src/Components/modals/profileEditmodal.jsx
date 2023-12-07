import React, { useEffect, useState } from 'react';
import Modal from 'react-modal'; 
import axios from "axios";
import { baseUrl,updateprofile } from '../../utilits/constants';
import Swal from "sweetalert2";

const UserupdateModal = ({ isOpen, closeModal,profile }) => {  
  console.log(profile,"ooo")
  const [username, setUsername] = useState(profile?.user?.username ?? 'DefaultUsername');
  const [email, setEmail] = useState(profile?.user?.email ?? 'DefaultEmail');
  const [place, setPlace] = useState(profile?.place ?? 'DefaultPlace');
  const [phonenumber, setPhonenumber] = useState(profile?.user?.phonenumber ?? 'DefaultPhoneNumber');
  const [profession, setProfession] = useState(profile?.profession?.profession_name ?? 'DefaultProfession');
  const [experience, setExperience] = useState(profile?.experience ?? 'DefaultExperience');
  const [bio, setBio] = useState(profile?.bio ?? 'DefaultBio');

  // Use useEffect to update state when the profile prop changes
    useEffect(() => {
      // Additional checks to prevent accessing properties of null or undefined
      setUsername(profile?.user?.username ?? 'DefaultUsername');
      setEmail(profile?.user?.email ?? 'DefaultEmail');
      setPlace(profile?.place ?? 'DefaultPlace');
      setPhonenumber(profile?.user?.phonenumber ?? 'DefaultPhoneNumber');
      setProfession(profile?.profession?.profession_name ?? 'DefaultProfession');
      setExperience(profile?.experience ?? 'DefaultExperience');
      setBio(profile?.bio ?? 'DefaultBio');
    }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = new FormData();
      formData.append('username',username);
      formData.append('email',email);
      formData.append('place',place);
      formData.append('phonenumber',phonenumber);
      formData.append('profession',profession);
      formData.append('experience',experience);
      formData.append('bio',bio);
      console.log(formData)
    
      const response = await axios.patch(baseUrl+updateprofile, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status) {
        // Handle successful post creation, e.g., show a success message, redirect, etc.
        console.log('user updated successfully!');
        Swal.fire("Updated!", "Your profile Updated.", "success");
      } else {
        // Handle errors, e.g., show an error message to the user
        console.error('Error creating post:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
    closeModal();
  };

  return (
   <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Profile Edit Modal"
      className="modal-content p-4 bg-white shadow-md max-w-md mx-auto mt-20"
     
    >
  {profile? <div className="modal-content p-4 bg-white  max-w-md mx-auto mt-20">
  <h2 className="text-2xl font-bold mb-4">UpdateProfile</h2>
  <div className="form-group">
  <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Username</label>
    <input
      type="text"
      id="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="mt-1 p-2 border rounded-md w-full"
    />
  </div>
  <div className="form-group">
    <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Email</label>
    <input
      type="email"
      id="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="mt-1 p-2 border rounded-md w-full"
    />
  </div>
  <div className="form-group">
    <label htmlFor="hashtag" className="block text-sm font-medium text-gray-700">Phonenumber</label>
    <input
      type="text"
      id="phonenumber"
      value={phonenumber}
      onChange={(e) => setPhonenumber(e.target.value)}
      className="mt-1 p-2 border rounded-md w-full"
    />
  </div>
  <div className="form-group">
    <label htmlFor="hashtag" className="block text-sm font-medium text-gray-700">Place</label>
    <input
      type="text"
      id="place"
      value={place}
      onChange={(e) => setPlace(e.target.value)}
      className="mt-1 p-2 border rounded-md w-full"
    />
  </div>{profile.profession ?
  <div className="form-group">
    <label htmlFor="hashtag" className="block text-sm font-medium text-gray-700">Profession</label>
    <input
      type="text"
      id="profession"
      value={profession}
      onChange={(e) => setProfession(e.target.value)}
      className="mt-1 p-2 border rounded-md w-full"
    />
  </div>:""}
  {profile.profession ?
  <div className="form-group">
    <label htmlFor="hashtag" className="block text-sm font-medium text-gray-700">Experience</label>
    <input
      type="number"
      id="experience"
      value={experience}
      onChange={(e) => setExperience(e.target.value)}
      className="mt-1 p-2 border rounded-md w-full"
    />
  </div>:""}
  {profile.profession ?
  <div className="form-group">
    <label htmlFor="hashtag" className="block text-sm font-medium text-gray-700">Bio</label>
    <input
      type="text"
      id="bio"
      value={bio}
      onChange={(e) => setBio(e.target.value)}
      className="mt-1 p-2 border rounded-md w-full"
    />
  </div>:""}
  <br />
  <div className="flex justify-between">
    <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit</button>
    <button onClick={closeModal} className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
  </div>
</div>:""}


    </Modal>
  );
};

export default UserupdateModal;
