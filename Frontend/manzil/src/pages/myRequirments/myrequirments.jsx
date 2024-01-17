import React, { useState,useEffect } from 'react';
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faBookmark, faShare , faEdit, faQuestion, faPlus,faEllipsisVertical,faTrash} from '@fortawesome/free-solid-svg-icons';
import CreateModal from '../../Components/modals/postmodal';
import { baseUrl,myrequirments,intrests,requirment} from '../../utilits/constants';
import axios from 'axios';
import FollowUnfollowApi from '../../api/followunfollow';
import { Link, useNavigate } from 'react-router-dom';
import RequirmentModal from '../../Components/modals/requirmentmodal';
import QustionModal from '../../Components/modals/qustionmodal';
import RequirmenteditModal from '../../Components/modals/requirmenteditmodal';


function MyrequirmentListing(){
  const [trigger, setTrigger] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const[requirmentlist,setRequirmentlist]=useState([]);
  const [updateUI, setUpdateUI] = useState(false);

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
 
  const handleExpressInterest = async (requirment_id) => {
    // Display confirmation message
    const userConfirmed = window.confirm("Are you sure you want to express interest?");
  
    // If the user confirms, proceed with the API call
    if (userConfirmed) {
      console.log("userconnirmed");
      const token = localStorage.getItem('jwtToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
  
      try {
        const formdata= new FormData();
        formdata.append('requirment',requirment_id);
        formdata.append('conformation',true);
       
        const response = await axios.post(`${baseUrl}${intrests}`,formdata, config);
        console.log(response.data);
        if (response.status === 201) {

        }
      } catch (error) {
        // Handle errors
        console.error("Error:", error);
      }
    } else {
      // Handle if the user cancels the action
      console.log("Express interest action canceled by the user");
    }
  };


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
      const response = await axios.get(baseUrl + myrequirments, config);
      console.log(response.data,"requ");
      setRequirmentlist(response.data)
    } catch (error) {
      console.error('Error:', error);

    }};

  const [requirmentEditModalOpen,setRequirmentEditModalOpen]=useState(false);
const openRequirmenteditmodal=()=>{
  setRequirmentEditModalOpen(true);

};
const closeRequirmenteditmodal=()=>{
  setRequirmentEditModalOpen(false);
};
const [expandedPostId, setExpandedPostId] = useState(null);

const handleExpandToggle = (requirmentId) => {
  setExpandedPostId(expandedPostId === requirmentId ? null : requirmentId);
};

const handleDeleteRequirment = async (requirmentId) => {
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
  
      const url = `${baseUrl}${requirment}${requirmentId}/`;

      // Make the DELETE request using Axios
      await axios.delete(url,config);

      setRequirmentlist(requirmentlist.filter(requirmnt => requirmnt.id !== requirmentId));
      setUpdateUI(prev => !prev)

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






  useEffect(() => {
    
    fetchData();
    
  }, [trigger,updateUI]);
  

 
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
             {/* togele */}
             <div className="expand-buttons  top-0 right-0">
        <div className={` top-0 right-0  cursor-pointer ${expandedPostId === requirment.id ? "text-red-500" : "text-gray-600"}`} onClick={() => handleExpandToggle(requirment.id)}>
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </div>
      {expandedPostId === requirment.id && (
    <div className="edit-delete-buttons mt-6 grid grid-cols-1">
  <button className="bg-blue-400 text-white px-2 py-2 ml-3 hover:bg-blue-600 focus:outline-none  rounded-md"onClick={openRequirmenteditmodal}><FontAwesomeIcon icon={faEdit}  />
  </button>
  <RequirmenteditModal isOpen={requirmentEditModalOpen} closeModal={closeRequirmenteditmodal} requirment={requirment} setUpdateUI={setUpdateUI} />
  <button className="bg-red-400 text-white px-2 py-2 hover:bg-red-600 focus:outline-none mt-2 ml-3 rounded-md" onClick={() => handleDeleteRequirment(requirment.id)}><FontAwesomeIcon icon={faTrash}/>
 
  </button>
</div>

  )}
      </div>
      {/* togeleend */}
    
      </div>

      {requirment.description && (
        <div className='mb-4 rounded-md'>
          <p>{requirment.description}</p>
        </div>
      )}

      <div className='flex items-center justify-between mt-4'>
        <div className='post-actions'>
          {/* <div className='save-btn ml-4' onClick={() => { handlesave(requirment.id); setTrigger(true); }}>
            <FontAwesomeIcon icon={faBookmark} color={requirment.is_saved ? 'blue' : 'black'} />
          </div>
          <div className='save-btn ml-4' onClick={() =>{ handlesave(requirment.id);setTrigger(true);}}>
            <FontAwesomeIcon icon={faShare} color= {requirment.is_saved ? 'blue':'black'}/>
          </div> */}
        </div> 
    <button
          className='interest-btn bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue active:bg-blue-700'
          onClick={() => { handleExpressInterest(requirment.id); setTrigger(true); }}
        >
          View Interests
        </button>
      </div>
    </div>
  ))}
</div>
 {/* End List of posts */}
</div>
  );
}

export default MyrequirmentListing;
