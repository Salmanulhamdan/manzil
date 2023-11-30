import React, { useEffect, useState ,useRef} from 'react';
import { baseUrl ,myprofile} from '../../utilits/constants';
import 'tailwindcss/tailwind.css';
import Navbar from '../../Components/navbar/navbar';
import axios from 'axios';
import PlanModal from '../../Components/modals/plansmodal';




const MyProfile = () => {

  const [isHovered, setIsHovered] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const fileInput = useRef(null);
  const handleImageClick = () => {
    setTrigger(true);
    // Use a ref to access the file input and trigger a click event
    if (fileInput.current) {
      fileInput.current.click();

    }
  };

  const handleImageUpload = async (event) => {
    console.log("image upload")
    // Logic to handle image upload
    const formData = new FormData();
    formData.append('profile_photo', event.target.files[0]);

    try {
      const response = await axios.put(`${baseUrl}api/update-profile-photo/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, 
        },
      });

      // Assuming the API returns the updated user object
      setUser(response.data);
      setTrigger(false);

    } catch (error) {
      console.error('Error uploading profile photo:', error);
    }
  };


  const [isModalOpen, setIsModalOpen] = useState(false);
 

  const openModal = () => {
    console.log("working")
    setIsModalOpen(true);

  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  
  
 
  const [user,setUser] = useState([])
  const [userPosts, setUserPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {

    fetch(baseUrl+myprofile, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`, 
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
        console.log(response.data,"yyyy")
        const postresponse = await axios.get(`${baseUrl}/api/posts/${response.data.id}/get_user_posts_by_id/`, config);  
        setUserPosts(postresponse.data);
        console.log(postresponse,"llll")

      } catch (error) {
        // Handle errors...
        console.error('Error fetching user data:', error);
      }
    };
  
    // Call fetchData when the component mounts
    fetchData();
  }, [trigger]); 
  

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
        src={user.profile_photo?baseUrl + user.profile_photo:"https://via.placeholder.com/150"}
        alt="User Profile"
        onClick={handleImageClick}
        onMouseOver={(e)=> {e.currentTarget.style.cursor='pointer',e.currentTarget.style.opacity= 0.5}}
        onMouseOut={(e)=> {e.currentTarget.style.opacity=1}}
      />
     
      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
        ref={fileInput}
      />
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-2 gap-2">
          <h1 className="text-2xl font-bold mb-4">{user.username}</h1>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-lg font-semibold mb-2" style={{ display: 'inline-block' }}>{user.post_count}</p>
            <p className="text-gray-600" style={{ display: 'inline-block', marginLeft: '10px' }}>Posts</p>
          </div>
          <div>
            <p className="text-lg font-semibold mb-2" style={{ display: 'inline-block' }}>{user.followers_count}</p>
            <p className="text-gray-600" style={{ display: 'inline-block', marginLeft: '10px' }}>Followers</p>
          </div>
          <div>
            <p className="text-lg font-semibold mb-2" style={{ display: 'inline-block' }}>{user.following_count}</p>
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

          <PlanModal isOpen={isModalOpen} closeModal={closeModal} />

          <p className="text-gray-600 mt-2">
            <span className="mr-2"> {userProfile?  userProfile.profession_name:""}</span>
            <span className="mr-2">Place: {userProfile?userProfile.place:""}</span>
            <span>Phone: {user.phonenumber}</span>
          </p>

          <p className="text-gray-600 mt-2">
            <button className="bg-gray-400 text-black px-4 py-2 rounded-md">Edit Profile</button>
          </p>
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


export default MyProfile;