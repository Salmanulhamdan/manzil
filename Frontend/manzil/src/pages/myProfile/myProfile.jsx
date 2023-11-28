import React, { useEffect, useState } from 'react';
import { baseUrl ,planss,apiUrl} from '../../utilits/constants';
import 'tailwindcss/tailwind.css';
import Navbar from '../../Components/navbar/navbar';
import axios from 'axios';
import PlanModal from '../../Components/modals/plansmodal';




const UserProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
 

  const openModal = () => {
    console.log("working")
    setIsModalOpen(true);

  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  

  const [Plans, setPlans] = useState([]);
  const [user,setUser] = useState([])
  const [userPosts, setUserPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {

    fetch(baseUrl+apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`, // Include your authentication token if needed
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(data,"kkkk")
        setUserProfile(data);
      })
      .catch(error => console.error('Error fetching user profile:', error));
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        console.log('Tokenzzz:', token);
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const response = await axios.get(`${baseUrl}/api/user`, config);
        setUser(response.data);
        console.log(response.data)
        const postresponse = await axios.get(`${baseUrl}/api/posts/${response.data.id}/get_user_posts_by_id/`, config);  
        setUserPosts(postresponse.data);
        const planresponse = await axios.get(baseUrl+planss);
        setPlans(planresponse.data)
        console.log(planresponse)

      } catch (error) {
        // Handle errors...
        console.error('Error fetching user data:', error);
      }
    };
  
    // Call fetchData when the component mounts
    fetchData();
  }, []); 


 return (
    <>
    <Navbar/>
    <div className="bg-gray-100 min-h-screen">
  <div className="container mx-auto p-8">
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <img
            className="rounded-full w-48 h-48 object-cover mx-auto"
            src="https://via.placeholder.com/150"
            alt="User Profile"
          />
        </div>
        <div className="col-span-2">
          <div className="grid grid-cols-2 gap-2">
            <h1 className="text-2xl font-bold mb-4">{user.username}</h1>
            <p className="text-gray-600">EditProfile</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-lg font-semibold mb-2" style={{ display: 'inline-block' }}>100</p>
              <p className="text-gray-600" style={{ display: 'inline-block', marginLeft: '10px' }}>Posts</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2" style={{ display: 'inline-block' }}>100</p>
              <p className="text-gray-600" style={{ display: 'inline-block', marginLeft: '10px' }}>Followers</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2" style={{ display: 'inline-block' }}>100</p>
              <p className="text-gray-600" style={{ display: 'inline-block', marginLeft: '10px' }}>Following</p>
            </div>
          </div>
          <div className="mt-4">
      {userProfile && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={openModal}
          disabled={userProfile.upgraded}
        >
          {userProfile.upgraded ? 'Upgraded' : 'Upgrade Profile'}
        </button>
      )}
 
        <PlanModal isOpen={isModalOpen} closeModal={closeModal} plans={Plans} />
     
      
          </div>
        </div>
      </div>
    </div>

    {/* Section to show user's posts */}
    <div className="mt-8">
  <div className="grid grid-cols-4 gap-4">
    {userPosts.map((post, index) => (
      <div key={post.id} className='post-container bg-white border border-gray-300 p-4 my-4 rounded-md shadow-md'>
        {post.media && <img src={post.media} alt="Post" className='post-image mb-4 rounded-md' />}
        <p className='mb-2'>{post.caption}</p>
        <div className='hashtags'>
          {post.hashtag.map((hashtag) => (
            <span key={hashtag.id} className='hashtag mr-2'>#{hashtag.hashtag}</span>
          ))}
        </div>
      </div>
    ))}
  
       
        {/* Add more post elements as needed */}
      </div>
    </div>
  </div>
</div>

    
    </>
 );

};


export default UserProfile;