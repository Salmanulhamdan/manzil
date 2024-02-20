import React, { useEffect ,useState} from 'react';
import Navbar from '../../Components/navbar/navbar';
import { useParams } from 'react-router-dom';
import { baseUrl,userprofile } from '../../utilits/constants';
import axios from 'axios';
import PlanModal from '../../Components/modals/plansmodal';



const UserProfile = () => {
  // console.log(user_id,"userid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState();
  const toggleComponent = (component) => {
    setSelectedComponent(component);
  };



  const openModal = () => {
    console.log("working")
    setIsModalOpen(true);

  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const { userId } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [userProfilesatus, setUserProfilesatus] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        
        const statusresponse = await axios.get(`${baseUrl}/api/userprofile-status/`, config);
        setUserProfilesatus(statusresponse.data)
        console.log(statusresponse.data,"statusresponse");
        const response = await axios.get(`${baseUrl}${userprofile}/${userId}`, config);
        setUserProfile(response.data);
        console.log(response.data,"yyyy")
        const postresponse = await axios.get(`${baseUrl}/api/posts/${response.data.user.id}/get_user_posts_by_id/`, config);  
        setUserPosts(postresponse.data);
        console.log(postresponse.data,"llll")
      } catch (error) {
        // Handle errors...
        console.error('Error fetching user datassss:', error);
      }
    };
  
    // // Call fetchData when the component mounts
    fetchData();
   
  }, [userId]);  
  
    // console.log(userProfile,"gg")
   return (
      <>
      <Navbar  onToggleComponent={toggleComponent} naveitems={'profile'}/>
      <div className="bg-gray-100 min-h-screen pt-16">
    <div className="container mx-auto p-8">
    <div className="bg-white p-8 rounded-lg shadow-lg">
  <div className="grid grid-cols-3 gap-4">
    <div className="col-span-1">
      <img
        className="rounded-full w-48 h-48 object-cover mx-auto"
        src={userProfile && userProfile.user.profile_photo ? baseUrl + userProfile.user.profile_photo : "https://via.placeholder.com/150"}
        alt="User Profile"
      />
    </div>
    <div className="col-span-2">
      <div className="grid grid-cols-2 gap-2">
        <h1 className="text-2xl font-bold mb-4">{userProfile ? userProfile.user.username : "UserName"}</h1>
        <div>
  <p className="text-gray-600">
    {userProfile && userProfilesatus.upgraded ? (
      userProfile.user.phonenumber
    ) : (
      
      <button onClick={openModal} className=" bg-gray-300 text-black px-2 py-2 rounded-md">
        Upgrade your profile to view phone number
      </button>
      
    )}
    <PlanModal isOpen={isModalOpen} closeModal={closeModal} />
    
  </p>
  
  <p className="text-gray-600">{userProfile ? userProfile.place : "Place"}</p>
  <p className="text-gray-600">
    {userProfile && userProfile.profession ? userProfile.profession.profession_name : ""}
  </p>
  <p className="text-gray-600">
    {userProfile && userProfile.profession ? `Experience: ${userProfile.experience} years` : ""}
  </p>
  <p className="text-gray-600">
    {userProfile && userProfile.profession && userProfile.bio ? `Bio: ${userProfile.bio}` : ""}
  </p>
</div>

      </div>
      <br></br>
      <div className="grid grid-cols-1 gap-2">
        <div >
          <p className="text-lg font-semibold mb-2" style={{ display: 'inline-block' }}>{userProfile ? userProfile.user.post_count : "0"}</p>
          <p className="text-gray-600 cursor-pointer" style={{ display: 'inline-block', marginLeft: '10px' }}>Posts</p>
        </div>
        <div>
          <p className="text-lg font-semibold mb-2" style={{ display: 'inline-block' }}>{userProfile ? userProfile.user.followers_count : "0"}</p>
          <p className="text-gray-600 cursor-pointer" style={{ display: 'inline-block', marginLeft: '10px' }}>Followers</p>
        </div>
        <div>
          <p className="text-lg font-semibold mb-2" style={{ display: 'inline-block' }}>{userProfile ? userProfile.user.following_count : "0"}</p>
          <p className="text-gray-600 cursor-pointer" style={{ display: 'inline-block', marginLeft: '10px' }}>Following</p>
        </div>
      </div>
      <div className="mt-4">
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
    
         
        
        </div>
      </div>
    </div>
  </div>
  
      
      </>
   );
  
  };
  
  
  export default UserProfile;