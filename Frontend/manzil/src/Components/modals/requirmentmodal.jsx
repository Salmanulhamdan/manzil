import React, { useState ,useEffect} from 'react';
import Modal from 'react-modal'; 
import axios from "axios";
import { baseUrl,requirment,professions} from '../../utilits/constants';
import Swal from "sweetalert2";



const RequirmentModal = ({ isOpen, onClose }) => {
 
  const [allprofessions, setAllProfessions] = useState([]);
  const [selectedProfession, setSelectedProfession] = useState('');
  const [discription, setDiscription] = useState('');

  useEffect(() => {
    // Fetch professions from the database when the component mounts
    const fetchData = async () => {
      const professionsData = await axios.get(baseUrl+professions);
      setAllProfessions(professionsData.data);
     
      
    };

    fetchData();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      const formData = new FormData();
      formData.append('profession', selectedProfession);
      formData.append('description', discription);
    
      console.log(formData,"formdata")

      const response = await axios.post(baseUrl+requirment, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });


      if (response.status) {
        // Handle successful post creation, e.g., show a success message, redirect, etc.
        console.log('Requirment created successfully!');
        Swal.fire("Created!", "Your requirment has been Created.", "success");
      } else {
        // Handle errors, e.g., show an error message to the user
        console.error('Error creating requirment:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating requirment:', error.message);
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
  <h2 className="text-2xl font-bold mb-4">New Requirment</h2>
  <div className="form-group">
      <label htmlFor="profession" className="block text-sm font-medium text-gray-700">Profession</label>
      <select
        id="profession"
        className="mt-1 p-2 border rounded-md w-full"
        value={selectedProfession}
        onChange={(e) => setSelectedProfession(e.target.value)}
      >
        <option value="" disabled>Select a profession</option>
        {allprofessions ?  allprofessions.map((profession) => (
          <option key={profession.id} value={profession.id}>
            {profession.profession_name}
          </option>
        )):""}
      </select>
    </div>
  <div className="form-group">
    <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Discription</label>
    <input
      type="text"
      id="caption"
      value={discription}
      onChange={(e) => setDiscription(e.target.value)}
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

export default RequirmentModal;
