import React, { useEffect, useState ,useRef} from 'react';
import { baseUrl ,myprofile,savedPosts,likedPost} from '../../utilits/constants';
import 'tailwindcss/tailwind.css';
import Navbar from '../../Components/navbar/navbar';
import Posts from '../../Components/posts/posts';
import axios from 'axios';
import PlanModal from '../../Components/modals/plansmodal';
import UserupdateModal from '../../Components/modals/profileEditmodal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faGear,faBookmark, faThumbsUp, faUserEdit} from '@fortawesome/free-solid-svg-icons';




const MyProfile = () => {

  const [user,setUser] = useState([])
  const [userPosts, setUserPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [updateUI, setUpdateUI]= useState(false);
  const[saved,setSaved]=useState(false);
  const[liked,setLiked]=useState(false);
  const[savedposts,setSavedposts]=useState([]);
  const[likedposts,setLikedposts]=useState([]);
  const [trigger, setTrigger] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState();
  const toggleComponent = (component) => {
    setSelectedComponent(component);
  };
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'post':
        return <PostListing />;
      case 'requirements':
        return <RequirmentListing />;
      // case 'questions':
      //   return <QuestionsComponent />;
      default:
        return null;
    }
  };

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
      const response = await axios.put(`${baseUrl}/api/update-profile-photo/`, formData, {
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


  
 const fetchsavedposts = async ()=>{
  const token = localStorage.getItem('jwtToken');
  console.log('Tokenzzz:', token);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const savedpostsresponse = await axios.get(baseUrl+savedPosts,config)
  console.log(savedposts.data,"kkkoo")
  setSavedposts(savedpostsresponse.data)
  setLiked(false)
  setSaved(true)
  
 }

 const fetchlikedposts = async ()=>{
  const token = localStorage.getItem('jwtToken');
  console.log('Tokenzzz:', token);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const likedpostsresponse = await axios.get(baseUrl+likedPost,config)
  console.log(savedposts.data,"kkkoo")
  setLikedposts(likedpostsresponse.data)
  setSaved(false)
  setLiked(true)
  
 }
 const mypostsshow =()=>{
  setLiked(false)
  setSaved(false)
 
 }


  const [iseditModalOpen, setIseditModalOpen] = useState(false);
  const openeditModal = () => {
    console.log("working")
    setIseditModalOpen(true);

  };
  const closeeditModal = () => {
    setIseditModalOpen(false);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    console.log("working")
    setIsModalOpen(true);

  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


  const [isExpanded, setExpanded] = useState(false);

  const toggleMenu = () => {
    setExpanded(!isExpanded);
  };

   

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
      const fetchuserData =async () =>{
        const token = localStorage.getItem('jwtToken');
        console.log('Tokenzzz:', token);
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        const response = await axios.get(`${baseUrl}/api/user`, config);
        setUser(response.data);
      }
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
        const postresponse = await axios.get(`${baseUrl}/api/posts/${response.data.id}/get_user_posts_by_id/`, config);  
        setUserPosts(postresponse.data);
        // setLiked(false)
        // setSaved(false)
        console.log(postresponse,"llll")

      } catch (error) {
        // Handle errors...
        console.error('Error fetching user data:', error);
      }
    };
  
    // Call fetchData when the component mounts
    fetchuserData();
     
    if (liked){
      fetchlikedposts()
      }
      else if(saved){
      fetchsavedposts();
      }
      else{
        fetchData();

      }


  }, [iseditModalOpen,updateUI,trigger]); 

  

 return (
    <>
    <Navbar  usertype={user ? user.usertype : null } onToggleComponent={toggleComponent} naveitems={'profile'}/>
    <div className="bg-gray-100 min-h-screen">
    <div className="container mx-auto p-8">
  
    <div className="relative bg-white p-8 rounded-lg shadow-lg">
  <button className="absolute top-0 right-0 m-4 cursor-pointer text-gray-600" onClick={toggleMenu}>
   
  <FontAwesomeIcon icon={faGear} size="2x"/>
  </button>
  {isExpanded && (
        <div className="absolute top-12 right-0 p-4 bg-white border rounded shadow">
          <button className="block mb-2 text-gray-600 hover:text-blue-500" onClick={openeditModal}><FontAwesomeIcon icon={faUserEdit} />Edit </button>
            <UserupdateModal isOpen={iseditModalOpen} closeModal={closeeditModal} profile={userProfile}/>
          <button className="block mb-2 text-gray-600 hover:text-blue-500" onClick={fetchsavedposts}>
          <FontAwesomeIcon icon={faBookmark} /> Saved
          </button>
          <button className="block text-gray-600 hover:text-blue-500" onClick={fetchlikedposts}>
          <FontAwesomeIcon icon={faThumbsUp} /> Liked 
          </button>
        </div>
      )}
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1">
     
       
      <img
        className="rounded-full w-48 h-48 object-cover mx-auto"
        src={user.profile_photo? baseUrl + user.profile_photo:"https://via.placeholder.com/150"}
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
            <p className="text-gray-600" style={{ display: 'inline-block', marginLeft: '10px' }} onClick={mypostsshow}>Posts</p>
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
            
          </p>
        </div>
      </div>
    </div>
  </div>
  <div className="mt-8 p-4 bg-gray-100 rounded-md text-center">
  {saved ? <p className="text-xl font-bold text-blue-500">Saved Posts</p> : liked ? <p className="text-xl font-bold text-green-500">Liked Posts</p> : <p className="text-xl font-bold text-gray-700">My Posts</p>}
</div>
<Posts posts={saved == false && liked == false ? userPosts : saved == true ? savedposts ? savedposts:"" : likedposts } ismypost={saved == false && liked == false ? true : false } setUpdateUI={setUpdateUI} />
  </div>
</div>

    
    </>
 );

};


export default MyProfile;