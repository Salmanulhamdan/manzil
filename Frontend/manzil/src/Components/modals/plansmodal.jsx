import React from 'react';
import Modal from 'react-modal';
import  {  useState } from 'react';

import { loadRazorpayScript,createRazorpayOrder } from '../../utilits/razorpay';
import axios from 'axios';
import { baseUrl,userupgrade } from '../../utilits/constants';
const PlanModal = ({ isOpen, closeModal, plans }) => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  console.log(plans,"uuu")

  const handleContinue = async () => {
    if (selectedPlan) {
      const planId=selectedPlan.id
      const amount=selectedPlan.price
      try {
        // Load the Razorpay script
        
        await loadRazorpayScript();
  
        // Create a Razorpay order
        const order = await createRazorpayOrder(planId, amount);
  
        // Open the Razorpay payment UI
        const options = {
          key: order.notes.key,
          amount: order.amount,
          currency: order.currency,
          name: 'Manzil',
          description: `Payment for ${planId} plan`,
          order_id: order.id,
          handler: async function (response) {
            // Handle successful payment response
            console.log('Payment successful:', response);
            
            const token = localStorage.getItem('jwtToken');
            console.log('Token:', token);
          
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
          
            try {
              const formData = new FormData();
              formData.append('plan', planId);

              const upgradeResponse = await axios.post(`${baseUrl}${userupgrade}`, formData, config);
              console.log('Upgrade response:', upgradeResponse);
            } catch (error) {
              console.error('Error upgrading user:', error);
            }
          
           console.log(response)
  
            
         
          },
          prefill: {
            email: 'user@example.com', // Replace with the user's email
            contact: '1234567890', // Replace with the user's contact number
          },
        };
  
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error('Error handling Razorpay payment:', error);
      }
   
      console.log("Selected Plan ID:", selectedPlan);
    }
    closeModal();
  };

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
     
      <div className="bg-white w-96 p-6 rounded shadow-md">
          
          <h2 className="text-2xl font-bold mb-4">Select a Plan</h2>
          <ul>
            {plans.map((plan, index) => (
              <li
                key={index}
                onClick={() => setSelectedPlan(plan)}
                className={`cursor-pointer py-2 hover:bg-gray-500 transition-all ${
                  selectedPlan=== plan ? 'bg-blue-400 text-white' : ''
                }`}
              >
                {plan.name}--{plan.price} Rupee
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-4">
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

export default PlanModal;
