import React, { useState,useEffect } from 'react';
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBookmark, faShare , faEdit, faQuestion, faPlus,faEllipsisVertical,faTrash} from '@fortawesome/free-solid-svg-icons';
import CreateModal from '../../Components/modals/postmodal';
import { baseUrl,myquestions,questions} from '../../utilits/constants';
import axios from 'axios';
import FollowUnfollowApi from '../../api/followunfollow';
import { Link, useNavigate } from 'react-router-dom';
import RequirmentModal from '../../Components/modals/requirmentmodal';
import QustionModal from '../../Components/modals/qustionmodal';
import AnswerModal from '../../Components/modals/answermodal';
import QuestioneditModal from '../../Components/modals/questioneditmodal';


function MyQuestionsListing(){
  const [trigger, setTrigger] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const[qustionlist, setQustionlist] =useState([])

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const [RequirementModalOpen ,setRequirementModalOpen] =useState(false);
  const openrequirmentModal = () =>{
    setRequirementModalOpen(true);

  }
 const closerequirmentModal =() =>{
  setRequirementModalOpen(false);
 }

 const [QustionModalOpen ,setQustionModalOpen] =useState(false);
 const openqustionModal = () =>{
  setQustionModalOpen(true);

 }
const closequstionModal =() =>{
  setQustionModalOpen(false);
}


const [answerModalStates, setAnswerModalStates] = useState({});
// Function to open the modal for a specific question
const openAnswerModal = (questionId) => {
  setAnswerModalStates((prevStates) => ({
    ...prevStates,
    [questionId]: true,
  }));
};

// Function to close the modal for a specific question
const closeAnswerModal = (questionId) => {
  setAnswerModalStates((prevStates) => ({
    ...prevStates,
    [questionId]: false,
  }));
};

const [questionEditModalOpen,setQuestionEditModalOpen]=useState(false);
const openQuestioneditmodal=()=>{
  setQuestionEditModalOpen(true);

};
const closeQuestioneditmodal=()=>{
  setQuestionEditModalOpen(false);
};
const [expandedPostId, setExpandedPostId] = useState(null);

const handleExpandToggle = (qustionId) => {
  setExpandedPostId(expandedPostId === qustionId ? null : qustionId);
};

const handleDeleteQuestion = async (qustionId) => {
  setTrigger(true);
  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      const url = `${baseUrl}${questions}${qustionId}/`;

      // Make the DELETE request using Axios
      await axios.delete(url,config);

      setQustionlist(qustionlist.filter(qustion => qustion.id !== qustionId));
      // setUpdateUI(prev => !prev)

      // Assuming the request was successful, you can handle the success case here
      Swal.fire("Deleted!", "Your post has been deleted.", "success");
      setTrigger(false);
    }
  } catch (error) {
    // Handle errors, e.g., show an error message to the user
    console.error("Error:", error);
    Swal.fire("Error", "An error occurred while deleting the post.", "error");
  }
};



  const fetchData = async () => {
    try {
      const token = localStorage.getItem('jwtToken');
      console.log('Token:', token);

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      console.log('Making request...new');
      const response = await axios.get(baseUrl + myquestions, config);
      console.log(response.data,"kk")
      setQustionlist(response.data)
    } catch (error) {
      console.error('Error:', error);

    }};

  useEffect(() => {
    
    fetchData();
    
  }, [trigger]);
  

 
  return (
    <div className='center-container pt-16'>
      <br></br>
      {/* Create options at the top */}
      <div className='flex items-center justify-between mb-4'>
      <button
        className=' hover:bg-gray-200 text-black font-bold py-2 px-4 rounded'
        onClick={openModal}
      ><FontAwesomeIcon icon={faEdit} className='mr-2' />
        Create Post
      </button>
      <CreateModal isOpen={modalIsOpen} onClose={closeModal} />

        <button className='hover:bg-gray-200 text-black font-bold py-2 px-4 rounded' onClick={openrequirmentModal}>
        
          <FontAwesomeIcon icon={faPlus} className='mr-2' />
          Create Requirementxx
        </button>
        <RequirmentModal isOpen={RequirementModalOpen} onClose={closerequirmentModal} />

        <button className='hover:bg-gray-200 text-black font-bold py-2 px-4 rounded' onClick={openqustionModal}>
          <FontAwesomeIcon icon={faQuestion} className='mr-2' />
          Ask Question
        </button>
        <QustionModal isOpen={QustionModalOpen} onClose={closequstionModal} />
    
      </div>
      {/* List of posts */}
     <div className='mainclass'>
    
  {qustionlist.map((qustion, index) => (
    <div key={qustion.id} className='post-container bg-white border border-gray-300 p-4 my-4 rounded-md shadow-md '>
      
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center'>
          <img src={qustion.user.profile_photo} alt="Profile" className='w-10 h-10 rounded-full mr-2' />
          <Link className="userrofile_text font-bold" to={`/userprofile/${qustion.user.id}`}>{qustion.user.username}</Link>
        </div>
        <div className="expand-buttons  top-0 right-0">
        <div className={` top-0 right-0  cursor-pointer ${expandedPostId === qustion.id ? "text-red-500" : "text-gray-600"}`} onClick={() => handleExpandToggle(qustion.id)}>
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </div>
      {expandedPostId === qustion.id && (
    <div className="edit-delete-buttons mt-6 grid grid-cols-1">
  <button className="bg-blue-400 text-white px-2 py-2 ml-3 hover:bg-blue-600 focus:outline-none  rounded-md"onClick={openQuestioneditmodal}><FontAwesomeIcon icon={faEdit}  />
  </button>
  <QuestioneditModal isOpen={questionEditModalOpen} closeModal={closeQuestioneditmodal} question={qustion} />
  <button className="bg-red-400 text-white px-2 py-2 hover:bg-red-600 focus:outline-none mt-2 ml-3 rounded-md" onClick={() => handleDeleteQuestion(qustion.id)}><FontAwesomeIcon icon={faTrash}/>
 
  </button>
</div>

  )}
      </div>
      </div>
      <div className='qustion mb-4 rounded-md' style={{ wordWrap: 'break-word' }}>
        {qustion.qustion && <p>{qustion.qustion}</p>}
      </div>
      <div className='flex items-center justify-between mt-4'>
        <div className='post-actions'>
          {/* <div className='share-btn ml-4'>
            <FontAwesomeIcon icon={faShare} />
          </div> */}
          <div className='ml-4'>
            <button onClick={() => openAnswerModal(qustion.id)} className='answer-btn bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-700'>
              Answer
            </button>
            <AnswerModal question_id ={qustion.id} question={qustion.qustion} isOpen={answerModalStates[qustion.id]} onClose={() => closeAnswerModal(qustion.id)} />

          </div>
        </div>
      </div>
      {/* Show Answer button */}
      <div className='mt-4'>
  <span onClick={() => openAnswerModal(qustion.id)} className='text-blue-500 cursor-pointer  hover:text-green-600 focus:outline-none focus:shadow-outline-green active:text-green-700'>
    View all answers
  </span>
  <AnswerModal question_id ={qustion.id} question={qustion.qustion} isOpen={answerModalStates[qustion.id]} onClose={() => closeAnswerModal(qustion.id)} />
</div>
    </div>
  ))}
</div>
{/* endof listing*/}
</div>
  );
}

export default MyQuestionsListing;
