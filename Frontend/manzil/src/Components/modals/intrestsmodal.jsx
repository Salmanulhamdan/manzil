import React from 'react';
import Modal from 'react-modal';
import  {  useState ,useEffect} from 'react';

import { loadRazorpayScript,createRazorpayOrder } from '../../utilits/razorpay';
import axios from 'axios';
import { baseUrl,userupgrade ,planss} from '../../utilits/constants';


const IntrestsModal = ({ isOpen, closeModal, }) => {
  const [selectedprofile, setSelectedProfile] = useState(null);
  const [intrests, setIntrests] = useState([]);
  useEffect(() => {
  
  const fetchData = async () => {
    try {
      const planresponse = await axios.get(baseUrl+planss);
      setPlans(planresponse.data)
      console.log(planresponse.data)
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
     
      <div className="bg-gradient-to-r from-purple-200 via-teal-300 to-blue-200 p-6 rounded shadow-md" style={{ width: '800px', height: 'auto' }}>
          
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Active Plans</h2>
           <h4 className="text-lg font-bold mb-4 text-gray-700">Select A Plan</h4>
          <ul className="space-y-2 py-4">
            {Plans.map((plan, index) => (
              <li
                key={index}
                onClick={() => setSelectedPlan(plan)}
                className={`cursor-pointer py-2 px-4 rounded-md transition-all ${
                  selectedPlan=== plan ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'
                }`}
              >
                  <span className="flex items-center justify-between">
          <span className={selectedPlan === plan ? 'font-bold' : 'font-normal'}>{plan.name}</span>
          <span className={` ${selectedPlan === plan ? 'font-bold' : 'font-normal'}`}>{plan.price} Rupee</span>
        </span>
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
            <button
              onClick={handleContinue}
              className={`${
                selectedPlan ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
              } text-white font-bold py-2 px-4 rounded`}
              disabled={!selectedPlan}
            >
              Continue
            </button>
          </div>
        </div>

    </Modal>
  );
};

export default IntrestsModal;
