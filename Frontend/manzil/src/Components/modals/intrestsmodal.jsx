import React from 'react';
import Modal from 'react-modal';
import  {  useState ,useEffect} from 'react';


import axios from 'axios';
import { baseUrl,userupgrade ,planss} from '../../utilits/constants';


const IntrestsModal = ({ isOpen, closeModal, }) => {
  
  const [intrests, setIntrests] = useState([]);
  useEffect(() => {
  
  const fetchData = async () => {
    try {
      const response = await axios.get(baseUrl+planss);
      setIntrests(response.data)
      // console.log(planresponse.data)
    } catch (error) {
      // Handle errors...
      console.error('Error fetching user data:', error);
    }
  };
  fetchData();
}, []); 


  const handleContinue = async () => {
   
    }




  const handleCancel = () => {
    closeModal();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="plans"
      className="fixed inset-0 flex items-center justify-center"
    >
     
      <div className=" p-6 rounded shadow-md" style={{ width: '800px', height: 'auto' }}>
          
         
          <ul className="space-y-2 py-4">
            {intrests.map((intrest, index) => (
              <li>

               
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleCancel}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 mr-2 rounded"
            >
              Cancel
            </button>
            
          </div>
        </div>

    </Modal>
  );
};

export default IntrestsModal;
