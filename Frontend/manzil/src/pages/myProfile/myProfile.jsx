import React, { useEffect, useState ,useRef} from 'react';
import { baseUrl ,myprofile} from '../../utilits/constants';
import 'tailwindcss/tailwind.css';
import Navbar from '../../Components/navbar/navbar';
import axios from 'axios';
import PlanModal from '../../Components/modals/plansmodal';
import UserupdateModal from '../../Components/modals/profileEditmodal';
import PosteditModal from '../../Components/modals/postEditmodal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faEllipsisVertical, faEdit, faTrash, faGear,faBookmark, faThumbsUp, faUserEdit} from '@fortawesome/free-solid-svg-icons';
import Swal from "sweetalert2";



const MyProfile = () => {

  const [user,setUser] = useState([])
  const [userPosts, setUserPosts] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
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


  
 
  const [postEditModalOpen,setpostEditModalOpen]=useState(false);
  const openPosteditmodal=()=>{
    setpostEditModalOpen(true);
  };
  const closePosteditmodal=()=>{
    setpostEditModalOpen(false);
  };

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

    const [expandedPostId, setExpandedPostId] = useState(null);
  
    const handleExpandToggle = (postId) => {
      setExpandedPostId(expandedPostId === postId ? null : postId);
    };


    const handleDeletePost = async (postId) => {
      setTrigger(true);
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
          const url = `${baseUrl}/api/deletepost/${postId}/`;
    
          // Make the DELETE request using Axios
          await axios.delete(url);

          setUserPosts(userPosts.filter(post => post.id !== postId));
    
          // Assuming the request was successful, you can handle the success case here
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
          setTrigger(false);
        }
      } catch (error) {
        // Handle errors, e.g., show an error message to the user
        console.error("Error:", error);
        Swal.fire("Error", "An error occurred while deleting the post.", "error");
      }
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
        const postresponse = await axios.get(`${baseUrl}api/posts/${response.data.id}/get_user_posts_by_id/`, config);  
        setUserPosts(postresponse.data);
        console.log(postresponse,"llll")

      } catch (error) {
        // Handle errors...
        console.error('Error fetching user data:', error);
      }
    };
  
    // Call fetchData when the component mounts
    fetchData();
  }, [trigger,iseditModalOpen,postEditModalOpen]); 
  

 return (
    <>
    <Navbar/>
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
          <button className="block mb-2 text-gray-600 hover:text-blue-500" onClick={() => console.log('Saved Posts')}>
          <FontAwesomeIcon icon={faBookmark} /> Saved
          </button>
          <button className="block text-gray-600 hover:text-blue-500" onClick={() => console.log('Liked Posts')}>
          <FontAwesomeIcon icon={faThumbsUp} /> Liked 
          </button>
        </div>
      )}
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
            
          </p>
        </div>
      </div>
    </div>
  </div>



    {/* Section to show user's posts */}
    <div className="mt-8">
      <div className="grid grid-cols-4 gap-4">
        {userPosts.map((post) => (
          <div key={post.id} className='post-container bg-white border border-gray-300 p-4 my-4 rounded-md shadow-md relative'>
            {post.media && (
  <div className='mb-4 rounded-md'>
    {post.media.endsWith('.mp4') || post.media.endsWith('.avi') ? (
      // Display video if the media URL ends with .mp4 or .avi
      <video controls width="100%" height="auto">
        <source src={post.media} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ) : (
      // Display image for other cases
      <img src={post.media} alt="Post" className='post-image' />
    )}
  </div>
)}
            <p className='mb-2'>{post.caption}</p>
            <div className='hashtags'>
              {post.hashtag.map((hashtag) => (
                <span key={hashtag.id} className='hashtag mr-2'>#{hashtag.hashtag}</span>
              ))}
            </div>
            <div className="expand-buttons absolute top-0 right-2">
  <div className={`absolute top-0 right-0  cursor-pointer ${expandedPostId === post.id ? "text-red-500" : "text-gray-600"}`} onClick={() => handleExpandToggle(post.id)}>
  <FontAwesomeIcon icon={faEllipsisVertical} />
  </div>

  {expandedPostId === post.id && (
    <div className="edit-delete-buttons mt-6 grid grid-cols-1">
  <button className="bg-blue-400 text-white px-2 py-2 ml-3 hover:bg-blue-600 focus:outline-none  rounded-md"onClick={openPosteditmodal}><FontAwesomeIcon icon={faEdit}  />
  </button>
  <PosteditModal isOpen={postEditModalOpen} closeModal={closePosteditmodal} post={post}/>
  <button className="bg-red-400 text-white px-2 py-2 hover:bg-red-600 focus:outline-none mt-2 ml-3 rounded-md" onClick={() => handleDeletePost(post.id)}><FontAwesomeIcon icon={faTrash}/>
 
  </button>
</div>

  )}
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


export default MyProfile;