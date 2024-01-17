import React, { useState } from 'react';
import Modal from 'react-modal'; 
import axios from "axios";
import { baseUrl,report } from '../../utilits/constants';


const ReportModal = ({ isOpen, onClose, Item ,setPostslist}) => {
  
  
  const [reason, setReason] = useState('');
  const Item_id=Item ? Item.id:null

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = new FormData();
      formData.append('reason', reason);
      formData.append('report_type','post');
      formData.append('item_id', Item_id);
   
      console.log(formData)

      const response = await axios.post(baseUrl+report, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status) {
        // Handle successful post creation, e.g., show a success message, redirect, etc.
        setPostslist((prevPosts) =>
        prevPosts.map((post) =>
          post.id === Item_id
            ? { ...post, is_reported: !post.is_reported}
            : post
        )
      );
        console.log('qustion created successfully!');
        // Swal.fire("Created!", "Your qustion has been Created.", "success");
      } else {
        // Handle errors, e.g., show an error message to the user
        console.error('Error creating qustion:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating qustion:', error.message);
    }
    onClose();
  };

  return (
    <Modal
      // ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Create Post Modal"
      className="modal-content p-4 bg-white shadow-md max-w-md mx-auto mt-20"
     
    >
   <div className="modal-content p-4 bg-white  max-w-md mx-auto mt-20">
  <h2 className=" font-bold mb-4">what is Your Reason</h2>

  <div className="form-group">
<textarea
  id="caption"
  value={reason}
  onChange={(e) => setReason(e.target.value)}
  className="mt-1 p-2 border rounded-md w-full"
/>
  </div>

  <br />
  <div className="flex justify-between">
    <button onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit</button>
    <button onClick={onClose} className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
  </div>
</div>


    </Modal>
  );
};

export default ReportModal;
