import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from "axios";
import { baseUrl, confirm_intrest,intrests } from '../../utilits/constants';
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
const IntrestsModal = ({  requirment, requirment_id, isOpen, onClose }) => {

  console.log(requirment_id, "dd");

  const [intrestlist, setIntrestlist] = useState([]);
  const [trigger,setTrigger]=useState(false)

  console.log(intrestlist, "nnnnnnnnnnnnnnnnnn");


  const handleConfirm = async (intrestId) => {
    
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
        const token = localStorage.getItem('jwtToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const url = `${baseUrl}/api/intrests/confirm_intrest/${intrestId}/`; // Adjust the URL
  
        // Make the PATCH request using Axios
        await axios.patch(url, {}, config);
        // Assuming the request was successful, you can handle the success case here
        Swal.fire("Confirmed!", "This interest confirmed.", "success");
        setTrigger(true);
      }
    } catch (error) {
      // Handle errors, e.g., show an error message to the user
      console.error("Error:", error);
      Swal.fire("Error", "An error occurred while confirming the interest.", "error");
    }
  };


  useEffect(() => {

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        // Ensure token is not null or undefined before making the request
        if (token) {
          const response = await axios.get(baseUrl + intrests, {
            params: { requirment: requirment_id },
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },

          });
          console.log("intrests", response.data);
          setIntrestlist(response.data)
        }


      } catch (error) {
        // Handle errors...
        console.error('Error fetching user data:', error);
      }
    };
    fetchData();
  }, [trigger]);

  return (
    <Modal
      ariaHideApp={false}
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Intrest Modal"
      className="modal-content p-4 bg-white shadow-md max-w-xl mx-auto mt-20 relative border border-gray-800 "
    >

      <div className=''>
        <h2 className=" font-bold mb-4">Intrests</h2>
        <div className="flex justify-between">
          <p className=" font-bold ">{requirment}!</p>
          <button onClick={onClose} className="absolute top-1 right-1 p-0 text-xl">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="answers-container overflow-y-auto max-h-40 mb-4">
          {intrestlist ?.length === 0 ? (
            <p className='mt-3 items-center'>No interests for this requirement</p>
          ) : (
            intrestlist.map((item, index) => (
              <div key={index} className="p-4 mb-4 flex justify-between items-center">

                {item.user.profile_photo && (
                  <img
                    src={item.user.profile_photo}
                    alt=""
                    className="w-8 h-8 rounded-full mr-2"
                  />
                )}

                <div className="flex flex-col flex-grow">
                  <div className="flex items-center">
                    <Link className="userrofile_text font-bold mr-2" to={`/userprofile/${item.user.id}`}>
                      {item.user.username}
                    </Link>
                  </div>
                  <div>
                    <span className="text-black-500 ">Interested in This Requirement</span>
                  </div>
                </div>
                <div className="flex justify-end ">
                  <div>
                    {!item.conformation && (
                      <button
                        className="bg-gradient-to-r from-white to-teal-300 text-gray-500 hover:text-gray-700 font-bold py-2 px-4 rounded"
                        onClick={() => handleConfirm(item.id)}
                      >
                        Confirm
                      </button>
                    )}
                    {item.conformation && <p>Confirmed!</p>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>




      </div>

    </Modal>

  );
};

export default IntrestsModal;
