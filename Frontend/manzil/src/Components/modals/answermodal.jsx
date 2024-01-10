import React, { useState,useEffect } from 'react';
import Modal from 'react-modal'; 
import axios from "axios";
import { baseUrl,answers } from '../../utilits/constants';
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark} from '@fortawesome/free-solid-svg-icons';
import { Link} from 'react-router-dom';
const AnswerModal = ({ question_id, question,isOpen, onClose }) => {
  
    console.log(question_id,"dd");
  
  const [answerlist, setAnswerlist] = useState([]);
  const [answer,setAnswer] = useState()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = new FormData();
      console.log(question_id);
      formData.append('qustion',question_id)
      formData.append('answer', answer);
   
      console.log(formData,"formvvvvvdata")

      const response = await axios.post(baseUrl+ answers, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status) {
        // Handle successful post creation, e.g., show a success message, redirect, etc.
        console.log(response.data,'answer created successfully!');
        Swal.fire("Created!", "Your answerhas been Created.", "success");
      } else {
        // Handle errors, e.g., show an error message to the user
        console.error('Error creating qustion:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating qustion:', error.message);
    }
    onClose();
  };

  useEffect(() => {
  
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        // Ensure token is not null or undefined before making the request
        if (token) {
           const answer_response = await axios.get(baseUrl + answers, {
              params: { question: question_id },
              headers: {
                 'Content-Type': 'multipart/form-data',
                 Authorization: `Bearer ${token}`,
              },
            
           });
           setAnswerlist(answer_response.data)
        }
        
       console.log("ansers",answer_response.data);
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
  contentLabel="Answer Modal"
  className="modal-content p-4 bg-white shadow-md max-w-xl mx-auto mt-20 relative border border-gray-800"
>

  <div >
  <h2 className=" font-bold mb-4">Qustion</h2>
    <div className="flex justify-between">
    
    <div className='question mb-4 rounded-md overflow-y-auto' style={{ maxHeight: '80px', wordWrap: 'break-word' }}>
        <p>{question} ?</p>
      </div>
      <button onClick={onClose} className="absolute top-1 right-1 p-0 text-xl">
      <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>

    <div className="answers-container overflow-y-auto max-h-40 mb-4">
      {answerlist.map((answer, index) => (
        <div key={index} className="p-4 mb-4 ">
          <div className="flex items-center mb-1">
          {answer.user.profile_photo && (
          <img
            src={answer.user.profile_photo}
            alt=""
            className="w-8 h-8 rounded-full mr-2"
          />
        )}
            {/* <span className="font-bold mr-2">{answer.user.username}</span>  */}
            <Link className="userrofile_text font-bold mr-2" to={`/userprofile/${answer.user.id}`}>{answer.user.username}</Link>
            <span className="text-gray-500">{/* Add timestamp or other user information if needed */}</span>
          </div>
          <div className="mb-2">{answer.answer}</div>
          {/* <div
            className="text-blue-500 cursor-pointer"
            onClick=""
          >
            Reply
          </div> */}
        </div>
      ))}
    </div>

    <div className="form-group">
      <textarea
        id="caption"
        value={answer} // You may want to bind the value to a state variable
        onChange={(e) => setAnswer(e.target.value)}
        className="mt-1 p-2 border rounded-md w-full"
      />
    </div>

    <div className="flex justify-between">
      <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        Share
      </button>
    </div>
  </div>

</Modal>

  );
};

export default AnswerModal;
