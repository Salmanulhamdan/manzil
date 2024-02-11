import React, { useState,useEffect } from 'react';
import Modal from 'react-modal'; 
import axios from "axios";
import { baseUrl,intrests } from '../../utilits/constants';
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark} from '@fortawesome/free-solid-svg-icons';
import { Link} from 'react-router-dom';
const IntrestsModal = ({ requirment_id,isOpen, onClose }) => {
  
    console.log(requirment_id,"dd");
  
  const [intrestlist, setIntrestlist] = useState([]);
  
console.log(intrestlist,"nnnnnnnnnnnnnnnnnn");
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const token = localStorage.getItem('jwtToken');
  //     const formData = new FormData();
  //     console.log(question_id);
  //     formData.append('qustion',question_id)
  //     formData.append('answer', answer);
   
  //     console.log(formData,"formvvvvvdata")

  //     const response = await axios.post(baseUrl+ answers, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });


  //     if (response.status) {
  //       // Handle successful post creation, e.g., show a success message, redirect, etc.
  //       console.log(response.data,'answer created successfully!');
  //       Swal.fire("Created!", "Your answerhas been Created.", "success");
  //     } else {
  //       // Handle errors, e.g., show an error message to the user
  //       console.error('Error creating qustion:', response.statusText);
  //     }
  //   } catch (error) {
  //     console.error('Error creating qustion:', error.message);
  //   }
  //   onClose();
  // };

  useEffect(() => {
  
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        // Ensure token is not null or undefined before making the request
        if (token) {
           const response = await axios.get(baseUrl + intrests, {
              params: { requirment: requirment_id },
              headers: {
                 'Content-Type': 'multipart/form-data',
                 Authorization: `Bearer ${token}`,
              },
            
           });
           console.log("intrests",response.data);
           setIntrestlist(response.data)
        }
        
       
      } catch (error) {
        // Handle errors...
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, []); 

  return (
    <Modal
  ariaHideApp={false}
  isOpen={isOpen}
  onRequestClose={onClose}
  contentLabel="Intrest Modal"
  className="modal-content p-4 bg-white shadow-md max-w-xl mx-auto mt-20 relative border border-gray-800"
>

  <div >
  <h2 className=" font-bold mb-4">Intrests</h2>
    <div className="flex justify-between">
    <button onClick={onClose} className="absolute top-1 right-1 p-0 text-xl">
    <FontAwesomeIcon icon={faXmark} />
    </button>
  </div>

    <div className="answers-container overflow-y-auto max-h-40 mb-4">
  
      {intrestlist.map((item, index) => (
        <div key={index} className="p-4 mb-4 ">
          <div className="flex items-center mb-1">
        
          {item.user.profile_photo && (
          <img
            src={item.user.profile_photo}
            alt=""
            className="w-8 h-8 rounded-full mr-2"
          />
        )}

            <span className="font-bold mr-2">{item.user.username}</span> 
            <Link className="userrofile_text font-bold mr-2" to={`/userprofile/${item.user.id}`}>{item.user.username}</Link>
            <span className="text-gray-500">{/* Add timestamp or other user information if needed */}</span>
          </div>
          {/* <div className="mb-2">{intrest.answer}</div> */}
        
        </div>
      ))}
    </div>

   
  </div>

</Modal>

  );
};

export default IntrestsModal;
