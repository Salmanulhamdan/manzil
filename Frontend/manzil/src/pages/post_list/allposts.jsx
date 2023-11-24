import React, { useState,useEffect } from 'react';
import './allpost.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faBookmark, faShare , faEdit, faQuestion, faPlus} from '@fortawesome/free-solid-svg-icons';
import CreateModal from '../../Components/post_modal/postmodal';
function PostListing({post}){
  const [modalIsOpen, setModalIsOpen] = useState(false);
  
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  const [likes, setLikes] = useState({})
  const handleLike = async (postId) => {
    try {
      const response = await axios.post(`/api/posts/${postId}/like_post/`);
      if (response.status === 201) {
        // If the like was successful, update the like state
        setLikes((prevLikes) => ({
          ...prevLikes,
          [postId]: true,
        }));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const loadLikes = async () => {
    // Fetch the likes status for all posts and update the like state
    try {
      const response = await axios.get('/api/posts/');
      const likesData = {};
      response.data.forEach((post) => {
        likesData[post.id] = post.has_liked;
      });
      setLikes(likesData);
    } catch (error) {
      console.error('Error loading likes:', error);
    }
  };

  useEffect(() => {
    // Load likes when the component mounts
    loadLikes();
  }, []);
  

 
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
        <button className='hover:bg-gray-200 text-black font-bold py-2 px-4 rounded'>
          <FontAwesomeIcon icon={faPlus} className='mr-2' />
          Create Requirement
        </button>
        <button className='hover:bg-gray-200 text-black font-bold py-2 px-4 rounded'>
          <FontAwesomeIcon icon={faQuestion} className='mr-2' />
          Ask Question
        </button>
    
      </div>
      {/* List of posts */}
      <div>
  {post.map((post, index) => (
    <div key={post.id} className='post-container bg-white border border-gray-300 p-4 my-4 rounded-md shadow-md'>
      <div className='flex items-center mb-2'>
        <img src={post.user.profile_photo} alt="Profile" className='w-10 h-10 rounded-full mr-2' />
        <p className='font-bold'>{post.user}</p>
      </div>
      {post.media && <img src={post.media} alt="Post" className='post-image mb-4 rounded-md' />}
      <p className='mb-2'>{post.caption}</p>
      <div className='hashtags'>
        {post.hashtag.map((hashtag) => (
          <span key={hashtag.id} className='hashtag mr-2'>#{hashtag.hashtag}</span>
        ))}
      </div>

      <div className='flex items-center justify-between mt-4'>
        <div className='post-actions'>
          <div className='like-btn' onClick={() => handleLike(post.id)}>
            <FontAwesomeIcon icon={faHeart} color={likes[post.id] ? 'red' : 'black'} />
            <span className='ml-1'>{post.like_count || 0}</span>
          </div>
          <div className='save-btn ml-4'>
            <FontAwesomeIcon icon={faBookmark} />
          </div>
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

export default PostListing;
