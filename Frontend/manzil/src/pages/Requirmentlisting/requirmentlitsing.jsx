import React, { useState,useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBookmark, faShare , faEdit, faQuestion, faPlus} from '@fortawesome/free-solid-svg-icons';
import CreateModal from '../../Components/modals/postmodal';
import { baseUrl,requirements,save} from '../../utilits/constants';
import axios from 'axios';
import FollowUnfollowApi from '../../api/followunfollow';
import { Link, useNavigate } from 'react-router-dom';
import RequirmentModal from '../../Components/modals/requirmentmodal';
import QustionModal from '../../Components/modals/qustionmodal';


function RequirmentListing(){
  const [trigger, setTrigger] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const[requirmentlist,setRequirmentlist]=useState([]);
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





  const [saves, setSaves] = useState({})
  const handlesave = async (postId) => {
  const token = localStorage.getItem('jwtToken');
  console.log('Token:', token);
  
  const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const formData = new FormData();
      formData.append('post', postId);
      console.log("like clicked")
      const response = await axios.post(`${baseUrl}${save}`,formData, config);
      if (response.status === 201) {
        // If the like was successful, update the like state
        setSaves((prevSaves) => ({
          ...prevSaves,
          [postId]: true,
        }));
        setTrigger(false)
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const[intrest,setIntrest] =useState({})
 
  const handleExpressInterest = async (requirment_id)=>{
    const token =localStorage.getItem('jwtToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    

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
      const response = await axios.get(baseUrl + requirements, config);
      console.log(response.data,"requ");
      setRequirmentlist(response.data)
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
  {requirmentlist.map((requirment, index) => (
    <div key={requirment.id} className='post-container bg-white border border-gray-300 p-4 my-4 rounded-md shadow-md'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center'>
          <img src={requirment.user.profile_photo} alt="Profile" className='w-10 h-10 rounded-full mr-2' />
          <Link className="userrofile_text font-bold" to={`/userprofile/${requirment.user.id}`}>{requirment.user.username}</Link>
        </div>
        <button
          onClick={() => { handleFollowUnfollow(requirment.user.id); setTrigger(true); }}
          className={`follow-btn bg-gray-200 text-black-700 px-4 py-1 rounded-md hover:bg-gray-400 focus:outline-none focus:shadow-outline-gray active:bg-gray-500 ${
            requirment.is_following_author ? "bg-red-400 hover:bg-red-500" : ""}`}
        >
          {requirment.is_following_author ? "Unfollow" : "Follow"}
        </button>
      </div>

      {requirment.description && (
        <div className='mb-4 rounded-md'>
          <p>{requirment.description}</p>
        </div>
      )}

      <div className='flex items-center justify-between mt-4'>
        <div className='post-actions'>
          <div className='save-btn ml-4' onClick={() => { handlesave(requirment.id); setTrigger(true); }}>
            <FontAwesomeIcon icon={faBookmark} color={requirment.is_saved ? 'blue' : 'black'} />
          </div>
          <div className='save-btn ml-4' onClick={() =>{ handlesave(requirment.id);setTrigger(true);}}>
            <FontAwesomeIcon icon={faShare} color= {requirment.is_saved ? 'blue':'black'}/>
          </div>
        </div>
      
        {/* Button for expressing interest */}
        <button
          className='interest-btn bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-700'
          onClick={() => { handleExpressInterest(requirment.id); setTrigger(true); }}
        >
          Express Interest
        </button>
      </div>
    </div>
  ))}
</div>
 {/* End List of posts */}
</div>
  );
}

export default RequirmentListing;
