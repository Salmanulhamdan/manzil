import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNav from '../../Components/admin_components/admin_nav';
import AdminSide from '../../Components/admin_components/admin_side';
import { baseUrl ,planss} from '../../utilits/constants';
import Swal from "sweetalert2";
import CreatePlanModal from '../../Components/modals/createplanmodal';

const PlanList = () => {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Fetch plans from your DRF backend
    axios.get(baseUrl+planss)
      .then(response => {
        setPlans(response.data);
      })
      .catch(error => {
        console.error('Error fetching plans:', error);
      });
  }, []);

  const handleCreatePlan = (newPlan) => {
    axios.post(baseUrl+planss,newPlan)
    .then(response => {
      setPlans([...plans, response.data]);
      Swal.fire("Created!", "Your post has been Created.", "success");

    })
    .catch(error => {
      console.error('Error fetching plans:', error);
    });
    console.log('Create Plan clicked');
  };

  const handleDeletePlan = async (planId) => {
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
    axios.delete(baseUrl + `api/plans/${planId}`)
      .then(response => {
        // Update the state to reflect the deleted plan
        setPlans(plans.filter(plan => plan.id !== planId));
        Swal.fire("Deleted!", "Your post has been deleted.", "success");
      })
    }
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error("Error:", error);
      Swal.fire("Error", "An error occurred while deleting the post.", "error");
    }
  };
  const handleEditPlan = (planId) => {
        // Implement logic for deleting a plan
      axios.put(`http://your-api-url/plans/${planId}/`)
        .then(response => {
          // Update the state to reflect the deleted plan
          setPlans(plans.filter(plan => plan.id !== planId));
        })
        .catch(error => {
          console.error(`Error Editing plan ${planId}:`, error);
        });
      };


  return (
    <div >
    <div className="hidden lg:block">
      {/* AdminSide component */}
      <AdminSide />
    </div>
    <div className="hidden lg:block">
      {/* AdminNav component */}
      <AdminNav />
    
    </div>
    <div className="flex flex-col items-center justify-center">
    
  
         
    <button className="mb-4 p-2 bg-blue-500 text-white" onClick={() => setModalOpen(true)}>Create Plan</button>

        <CreatePlanModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onCreatePlan={handleCreatePlan}
        />
      <ul>
        {plans.map((plan) => (
          <li key={plan.id} className="my-4 p-2 border rounded-md">
            {plan.name}--
            {plan.description} with {plan.price} Rupee
            <button
              onClick={() => handleDeletePlan(plan.id)}
              className="ml-2 p-1 bg-red-500 text-white"
            >
              Delete
            </button>
            {/* <button
              onClick={() => handleEditPlan(plan.id)}
              className="ml-2 p-1 bg-yellow-500 text-white"
            >
              Edit
            </button> */}
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default PlanList;