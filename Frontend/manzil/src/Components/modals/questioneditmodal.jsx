import React, { useState,useEffect } from 'react';
import Modal from 'react-modal'; 
import axios from "axios";
import { baseUrl,createpost } from '../../utilits/constants';
import Swal from "sweetalert2";

const QuestioneditModal = ({ isOpen, closeModal , question,setUpdateUI}) => {
  const [Question,setQuestion]=useState(question?.qustion??'No Question')
  console.log(question,"qustion");
 

  useEffect(() => {
    // Additional checks to prevent accessing properties of null or undefined
    setQuestion(question?.qustion??'No Question');

  
  }, [question]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = new FormData();

      formData.append('qustion', Question);
     
      console.log(formData)

      const response = await axios.patch(`${baseUrl}/api/edit-qustion/${question.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status) {
        
        console.log('Post updated successfully!');
        
        Swal.fire("Updated!", "Your question has been Updated.", "success");
        setUpdateUI(prev => !prev)
      } else {
        // Handle errors, e.g., show an error message to the user
        console.error('Error creating question:', response.statusText);
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
      contentLabel="Create Post Modal"
      className="modal-content p-4 bg-white shadow-md max-w-md mx-auto mt-20"
     
    >
   <div className="modal-content p-4 bg-white  max-w-md mx-auto mt-20">
  <h2 className="text-2xl font-bold mb-4"></h2>

  <div className="form-group">
    <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Question</label>
    <input
      type="text"
      id="caption"
      value={Question}
      onChange={(e) => setQuestion(e.target.value)}
      className="mt-1 p-2 border rounded-md w-full"
    />
  </div>
  
  <br />
  <div className="flex justify-between">
    <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit</button>
    <button onClick={closeModal} className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
  </div>
</div>


    </Modal>
  );
};

export default QuestioneditModal;
