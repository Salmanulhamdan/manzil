import React, { useState } from 'react';
import Modal from 'react-modal';

const CreatePlanModal = ({ isOpen, onClose, onCreatePlan }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');

  const handleCreatePlan = () => {
    // Implement your logic for creating a plan
    // Use the values of name, description, price, and duration
    // You can call the onCreatePlan function and pass the plan details

    console.log('Creating Plan...');
    const newPlan = {
      name,
      description,
      price,
      duration,
    };

    // Call the onCreatePlan function and pass the new plan details
    onCreatePlan(newPlan);
    
    // Close the modal
    onClose();
  };

  return (
    <Modal
    isOpen={isOpen}
    onRequestClose={onClose}
    contentLabel="Create Plan Modal"
    className="fixed inset-0 flex items-center justify-center"
  >
    <div className="bg-white w-96 p-6 rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Plan</h2>
      <form>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Price:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Duration:</label>
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleCreatePlan}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create Plan
          </button>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 px-4 py-2 rounded-md hover:text-gray-700"
          >
            Close Modal
          </button>
        </div>
      </form>
    </div>
  </Modal>
  
  );
};

export default CreatePlanModal;
