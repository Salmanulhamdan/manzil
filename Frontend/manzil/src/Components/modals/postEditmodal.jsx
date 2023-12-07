import React, { useState,useEffect } from 'react';
import Modal from 'react-modal'; 
import axios from "axios";
import { baseUrl,createpost } from '../../utilits/constants';
import Swal from "sweetalert2";

const PosteditModal = ({ isOpen, closeModal , post}) => {
  const [media,setmedia]=useState(post?.media??'No Media')
  const [caption, setCaption] = useState(post?.caption ?? 'caption');
  const [hashtag, setHashtag] = useState(post?.hashtag?.map((hashtag) => (hashtag.hashtag)) || []);

  useEffect(() => {
    // Additional checks to prevent accessing properties of null or undefined
    setmedia(post?.media??'No Media');
    setCaption(post?.caption ?? 'caption');
    setHashtag(post?.hashtag?.map((hashtag) => (hashtag.hashtag)) || []);
  
  }, [post]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = new FormData();

      formData.append('caption', caption);
      formData.append('hashtag', hashtag);
      console.log(formData)

      const response = await axios.patch(`${baseUrl}/api/edit-post/${post.id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status) {
        // Handle successful post creation, e.g., show a success message, redirect, etc.
        console.log('Post updated successfully!');
        Swal.fire("Updated!", "Your post has been Updated.", "success");
      } else {
        // Handle errors, e.g., show an error message to the user
        console.error('Error creating post:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Create Post Modal"
      className="modal-content p-4 bg-white shadow-md max-w-md mx-auto mt-20"
     
    >
   <div className="modal-content p-4 bg-white  max-w-md mx-auto mt-20">
  <h2 className="text-2xl font-bold mb-4"></h2>
  {post.media && <img src={post.media} alt="Post" className='post-image mb-4 rounded-md' />}
  <div className="form-group">
    <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption</label>
    <input
      type="text"
      id="caption"
      value={caption}
      onChange={(e) => setCaption(e.target.value)}
      className="mt-1 p-2 border rounded-md w-full"
    />
  </div>
  <div className="form-group">
    <label htmlFor="hashtag" className="block text-sm font-medium text-gray-700">Hashtag</label>
    <input
      type="text"
      id="hashtag"
      value={hashtag}
      onChange={(e) => setHashtag(e.target.value)}
      className="mt-1 p-2 border rounded-md w-full"
    />
  </div>
  <br />
  <div className="flex justify-between">
    <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit</button>
    <button onClick={closeModal} className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
  </div>
</div>


    </Modal>
  );
};

export default PosteditModal;
