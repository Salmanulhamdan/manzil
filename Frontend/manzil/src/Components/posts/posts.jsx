import Swal from "sweetalert2";
import React, { useEffect, useState } from 'react';
import PosteditModal from '../../Components/modals/postEditmodal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEllipsisVertical, faEdit, faTrash,faHeart,faBookmark,faShare} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { baseUrl ,like,post,save} from '../../utilits/constants';
import { Link } from 'react-router-dom';
import FollowUnfollowApi from '../../api/followunfollow';
const Posts =({posts,ismypost,setUpdateUI})=>{
    const [userposts,setUserPosts] = useState(posts ? posts:"null")
    const [postEditModalOpen,setpostEditModalOpen]=useState(false);
    const [trigger, setTrigger] = useState(false);

    useEffect( () =>{
      setUserPosts(posts ? posts:"null")
      console.log("sss")
      console.log(posts,"userpost")

    },[posts,trigger,postEditModalOpen,userposts])


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
          console.log("saved,unsaved")
          // If the like was successful, update the like state
          setSaves((prevSaves) => ({
            ...prevSaves,
            [postId]: true,
          }));
          setTrigger(false)
          console.log("like happnd")
          setUpdateUI(prev => !prev)
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    };
  
  
  
    const handleFollowUnfollow = async (userId) => {
      try {
        await FollowUnfollowApi(userId);
        setTrigger(false);
        setUpdateUI(prev => !prev)
      } catch {
        console.log("follow/unfollow got error");
      }
    };
    

    const [likes, setLikes] = useState({})
    const handleLike = async (postId) => {
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
        const response = await axios.post(`${baseUrl}${like}`,formData, config);
        if (response.status === 201 || 201) {
          // If the like was successful, update the like state
          setLikes((prevLikes) => ({
            ...prevLikes,
            [postId]: true,
          }));
          setUserPosts(userposts.filter(post => post.id !== postId));
          console.log("like handeld")
          setUpdateUI(prev => !prev)
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    };

    const openPosteditmodal=()=>{
      setpostEditModalOpen(true);

    };
    const closePosteditmodal=()=>{
      setpostEditModalOpen(false);
    };


    const [expandedPostId, setExpandedPostId] = useState(null);
  
    const handleExpandToggle = (postId) => {
      setExpandedPostId(expandedPostId === postId ? null : postId);
    };

   

    const handleDeletePost = async (postId) => {
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
            const url = `${baseUrl}/api/deletepost/${postId}/`;
      
            // Make the DELETE request using Axios
            await axios.delete(url);
  
            setUserPosts(userposts.filter(post => post.id !== postId));
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




      return(
        <>

          {/* Section to show user's posts */}
    <div className="mt-8">
      <div className="grid grid-cols-4 gap-4">
        {userposts ? userposts.map((post) => (
          <div key={post.id} className='post-container bg-white border border-gray-300 p-4 my-4 rounded-md shadow-md relative'>
            {ismypost ? "" :    <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center'>
          <img src={post.user.profile_photo} alt="Profile" className='w-10 h-10 rounded-full mr-2' />
          <Link className="userrofile_text font-bold" to={`/userprofile/${post.user.id}`}>{post.user.username}</Link>
        </div>
        <button onClick={() => {handleFollowUnfollow(post.user.id);setTrigger(true); }}
          className={`className='follow-btn bg-gray-200 text-black-700 px-4 py-1 rounded-md hover:bg-gray-400 focus:outline-none focus:shadow-outline-gray active:bg-gray-500' ${
          post.is_following_author ? "bg-red-400 hover:bg-red-500" : ""}`} >
          {post.is_following_author ? "Unfollow" : "Follow"}
       </button>
      </div> }
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
      {ismypost ? "" :      <div className='flex items-center justify-between mt-4'>
        <div className='post-actions'>
          <div className='like-btn' onClick={() => {handleLike(post.id);setTrigger(true); }}>
            <FontAwesomeIcon icon={faHeart} color={post.is_liked ? 'red' : 'black'} />
            <span className='ml-1'>{post.like_count || 0}</span>
          </div>
          <div className='save-btn ml-4' onClick={() =>{handlesave(post.id);setTrigger(true);}}>
            <FontAwesomeIcon icon={faBookmark} color= {post.is_saved ? 'blue':'black'}/>
          </div>
          <div className='share-btn ml-4'>
            <FontAwesomeIcon icon={faShare} />
          </div>
        </div>
      </div>}
            <div className="expand-buttons absolute top-0 right-2">
 { ismypost? <div className={`absolute top-0 right-0  cursor-pointer ${expandedPostId === post.id ? "text-red-500" : "text-gray-600"}`} onClick={() => handleExpandToggle(post.id)}>
  <FontAwesomeIcon icon={faEllipsisVertical} />
  </div>:""}

  {expandedPostId === post.id && (
    <div className="edit-delete-buttons mt-6 grid grid-cols-1">
  <button className="bg-blue-400 text-white px-2 py-2 ml-3 hover:bg-blue-600 focus:outline-none  rounded-md"onClick={openPosteditmodal}><FontAwesomeIcon icon={faEdit}  />
  </button>
  <PosteditModal isOpen={postEditModalOpen} closeModal={closePosteditmodal} post={post} setUpdateUI={setUpdateUI}/>
  <button className="bg-red-400 text-white px-2 py-2 hover:bg-red-600 focus:outline-none mt-2 ml-3 rounded-md" onClick={() => handleDeletePost(post.id)}><FontAwesomeIcon icon={faTrash}/>
 
  </button>
</div>

  )}
</div>
          </div>
        )):""}
      </div>
    </div>
        </>

      );

};
export default Posts