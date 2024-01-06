import React, { useState,useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBookmark, faShare , faEdit, faQuestion, faPlus} from '@fortawesome/free-solid-svg-icons';
import CreateModal from '../../Components/modals/postmodal';
import { baseUrl,questions} from '../../utilits/constants';
import axios from 'axios';
import FollowUnfollowApi from '../../api/followunfollow';
import { Link, useNavigate } from 'react-router-dom';
import RequirmentModal from '../../Components/modals/requirmentmodal';
import QustionModal from '../../Components/modals/qustionmodal';


function QuestionsListing(){
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








  const handleFollowUnfollow = async (userId) => {
    try {
      await FollowUnfollowApi(userId);
      setTrigger(false);
    } catch {
      console.log("follow/unfollow got error");
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
      const response = await axios.get(baseUrl + questions, config);
      console.log(response.data,"kk")
      setQustionlist(response.data)
    } catch (error) {
      console.error('Error:', error);

    }};

  useEffect(() => {
    
    fetchData();
    
  }, [trigger]);
  

 
  return (
    <div className='center-container'>
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
          Create Requirement
        </button>
        <RequirmentModal isOpen={RequirementModalOpen} onClose={closerequirmentModal} />

        <button className='hover:bg-gray-200 text-black font-bold py-2 px-4 rounded' onClick={openqustionModal}>
          <FontAwesomeIcon icon={faQuestion} className='mr-2' />
          Ask Question
        </button>
        <QustionModal isOpen={QustionModalOpen} onClose={closequstionModal} />
    
      </div>
      {/* List of posts */}
      <div>
  {qustionlist.map((qustion, index) => (
    <div key={qustion.id} className='post-container bg-white border border-gray-300 p-4 my-4 rounded-md shadow-md'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center'>
        <img src={qustion.user.profile_photo} alt="Profle" className='w-10 h-10 rounded-full mr-2' />
          <Link className="userrofile_text font-bold" to={`/userprofile/${qustion.user.id}`}>{qustion.user.username}</Link>
        </div>
        <button onClick={() => {handleFollowUnfollow(qustion.user.id);setTrigger(true); }}
          className={`className='follow-btn bg-gray-200 text-black-700 px-4 py-1 rounded-md hover:bg-gray-400 focus:outline-none focus:shadow-outline-gray active:bg-gray-500' ${
            qustion.is_following_author ? "bg-red-400 hover:bg-red-500" : ""}`} >
          {qustion.is_following_author ? "Unfollow" : "Follow"}
       </button>
       {qustion.user.email}
      </div>
      {qustion.description && (
  <div className='mb-4 rounded-md'>
  <p>{qustion.description} </p>
  </div>
)}
      <p className='mb-2'>{qustion ? qustion.profession:"kkk"}</p>
     

      <div className='flex items-center justify-between mt-4'>
        <div className='post-actions'>
       
          {/* <div className='save-btn ml-4' onClick={() =>{handlesave(post.id);setTrigger(true);}}>
            <FontAwesomeIcon icon={faBookmark} color= {post.is_saved ? 'blue':'black'}/>
          </div> */}
          <div className='share-btn ml-4'>
            <FontAwesomeIcon icon={faShare} />
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
</div>
  );
}

export default QuestionsListing;
