import React, { useState,useEffect } from 'react';
import './allpost.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBookmark, faShare , faEdit, faQuestion, faPlus ,faTriangleExclamation} from '@fortawesome/free-solid-svg-icons';
import CreateModal from '../../Components/modals/postmodal';
import { baseUrl,like ,post,save,report} from '../../utilits/constants';
import axios from 'axios';
import FollowUnfollowApi from '../../api/followunfollow';
import { Link, useNavigate } from 'react-router-dom';
import RequirmentModal from '../../Components/modals/requirmentmodal';
import QustionModal from '../../Components/modals/qustionmodal';
import ReportModal from '../../Components/modals/reportmodal';


function PostListing(){
  const [trigger, setTrigger] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const[postslist,setPostslist]=useState([]);
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

const handleshare =()=>{
  
}

const [reportmodal, setReportmodal]=useState(false);
const [selectedPost, setSelectedPost] = useState(null);
const openreportmodal =(post)=>{
  setSelectedPost(post);
  setReportmodal(true)
}
const closereportmodal =()=>{
  setReportmodal(false)
}

  const [likes, setLikes] = useState({})
  const handleLike = async (postId) => {
    const token = localStorage.getItem('jwtToken');
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const formData = new FormData();
      formData.append('post', postId);
     
      console.log("like clicked")
      const response = await axios.post(`${baseUrl}${like}`,formData, config);
      if (response.status === 201 || 200) {
        // If the like was successful, update the like state for the specific post
        setPostslist((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, is_liked: !post.is_liked, like_count: post.is_liked ? post.like_count - 1 : post.like_count + 1 }
            : post
        )
      );
       
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };


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
      if (response.status === 201 || 200) {
        // If the like was successful, update the like state
        setPostslist((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, is_saved: !post.is_saved}
            : post
        )
      );
      }
    } catch (error) {
      console.error('Error liking post:', error);
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
      const response = await axios.get(baseUrl + post, config);
      console.log(response.data,"response");
      setPostslist(response.data)
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
      <div className='flex items-center justify-between mb-4 '>
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
  {postslist.map((post, index) => (
    <div key={post.id} className='post-container bg-white border border-gray-300 p-4 my-4 rounded-md shadow-md '>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center'>
          <img src={post.user.profile_photo} alt="Profile" className='w-10 h-10 rounded-full mr-2' />
          <Link className="userrofile_text font-bold" to={`/userprofile/${post.user.id}`}>{post.user.username}</Link>
        </div>
        <button onClick={() => {handleFollowUnfollow(post.user.id);setTrigger(true); }}
          className={`className='follow-btn bg-gray-200 text-black-700 px-4 py-1 rounded-md hover:bg-gray-400 focus:outline-none focus:shadow-outline-gray active:bg-gray-500' ${
          post.is_following_author ? "bg-red-400 hover:bg-red-500" : ""}`} >
          {post.is_following_author ? "Unfollow" : "Follow"}
       </button>
      </div>
      {post.media && (
  <div className='mb-4 rounded-md'>
    {post.media.endsWith('.mp4') || post.media.endsWith('.avi') ? (
      // Display video if the media URL ends with .mp4 or .avi
      <video controls width="100%" height="auto">
        <source src={post.media} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      // Display image for other cases
      <img src={post.media} alt="Post" className='post-image' />
    )}
  </div>
)}
      <p className='mb-2'>{post.caption}</p>
      <div className='hashtags'>
        {post.hashtag.map((hashtag) => (
          <span key={hashtag.id} className='hashtag mr-2'>#{hashtag.hashtag}</span>
        ))}
      </div>

      <div className='flex items-center justify-between mt-4'>
        <div className='post-actions'>
          <div className='like-btn' onClick={() => {handleLike(post.id); }}>
            <FontAwesomeIcon icon={faHeart} color={post.is_liked ? 'red' : 'black'} />
            <span className='ml-1'>{post.like_count || 0}</span>
          </div>
          <div className='save-btn ml-4' onClick={() =>{handlesave(post.id);}}>
            <FontAwesomeIcon icon={faBookmark} color= {post.is_saved ? 'blue':'black'}/>
          </div>
          {/* <div className='share-btn ml-4'>
            <FontAwesomeIcon icon={faShare} />
          </div> */}
          <button className='report-btn  ml-96 pl-24' onClick={() => openreportmodal(post)}>
            <FontAwesomeIcon icon={faTriangleExclamation} color= {post.is_reported ? 'red':'black'} />
          </button>
          <ReportModal isOpen={reportmodal} onClose={closereportmodal} Item={selectedPost} setPostslist={setPostslist} />
        </div>
      </div>
    </div>
  ))}
</div>
</div>
  );
}

export default PostListing;
