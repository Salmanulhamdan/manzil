import React, { useState } from 'react';
import Modal from 'react-modal'; 
import axios from "axios";
import { baseUrl,questions } from '../../utilits/constants';
import Swal from "sweetalert2";

const AnswerModal = ({ qustion,isOpen, onClose }) => {
  
    console.log(qustion,"dd");
  
  const [answer, setAnswer] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = new FormData();
      formData.append('qustion', qustion);
   
      console.log(formData)

      const response = await axios.post(baseUrl+questions, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status) {
        // Handle successful post creation, e.g., show a success message, redirect, etc.
        console.log('qustion created successfully!');
        Swal.fire("Created!", "Your qustion has been Created.", "success");
      } else {
        // Handle errors, e.g., show an error message to the user
        console.error('Error creating qustion:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating qustion:', error.message);
    }
    onClose();
  };

  return (
    <Modal
      // ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Post Modal"
      className="modal-content p-4 bg-white shadow-md max-w-md mx-auto mt-20"
     
    >

   <div className="modal-content p-4 bg-white  max-w-md mx-auto mt-20">
    <p> {qustion } ?</p>
  <h2 className=" font-bold mb-4">Ask Your Qustion</h2>
  <div className="form-group">
<textarea
  id="caption"
  value=""
  onChange={(e) => setAnswer(e.target.value)}
  className="mt-1 p-2 border rounded-md w-full"
/>
  </div>

  <br />
  <div className="flex justify-between">
    <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit</button>
    <button onClick={onClose} className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
  </div>
</div>


    </Modal>
  );
};

export default AnswerModal;
