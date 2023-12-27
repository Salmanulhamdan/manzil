import Swal from "sweetalert2";
import React, { useEffect, useState } from 'react';
import PosteditModal from '../../Components/modals/postEditmodal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEllipsisVertical, faEdit, faTrash,} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { baseUrl } from '../../utilits/constants';
const Posts =({posts,ismypost})=>{
    const [userposts,setUserPosts] = useState(posts?posts:"null")

    const [postEditModalOpen,setpostEditModalOpen]=useState(false);
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

    const [trigger, setTrigger] = useState(false);

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

      useEffect( () =>{
        setUserPosts(posts?posts:"null")
        console.log("sss")

      },[trigger,postEditModalOpen])


      return(
        <>

          {/* Section to show user's posts */}
    <div className="mt-8">
      <div className="grid grid-cols-4 gap-4">
        {userposts.map((post) => (
          <div key={post.id} className='post-container bg-white border border-gray-300 p-4 my-4 rounded-md shadow-md relative'>
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
            <div className="expand-buttons absolute top-0 right-2">
  <div className={`absolute top-0 right-0  cursor-pointer ${expandedPostId === post.id ? "text-red-500" : "text-gray-600"}`} onClick={() => handleExpandToggle(post.id)}>
  <FontAwesomeIcon icon={faEllipsisVertical} />
  </div>

  {expandedPostId === post.id && (
    <div className="edit-delete-buttons mt-6 grid grid-cols-1">
  <button className="bg-blue-400 text-white px-2 py-2 ml-3 hover:bg-blue-600 focus:outline-none  rounded-md"onClick={openPosteditmodal}><FontAwesomeIcon icon={faEdit}  />
  </button>
  <PosteditModal isOpen={postEditModalOpen} closeModal={closePosteditmodal} post={post}/>
  <button className="bg-red-400 text-white px-2 py-2 hover:bg-red-600 focus:outline-none mt-2 ml-3 rounded-md" onClick={() => handleDeletePost(post.id)}><FontAwesomeIcon icon={faTrash}/>
 
  </button>
</div>

  )}
</div>
          </div>
        ))}
      </div>
    </div>
        </>

      );

};
export default Posts