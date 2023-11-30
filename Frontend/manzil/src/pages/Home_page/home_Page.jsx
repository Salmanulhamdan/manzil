import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseUrl,user,refresh,post} from '../../utilits/constants';
import PostListing from '../post_list/allposts';

// import { Link } from "react-router-dom";
import Navbar from '../../Components/navbar/navbar';
import SideBar from '../../Components/sidebar/sidebar';



function Home() {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        console.log('Token:', token);
  
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
  
        console.log('Making request...new');
       
        const response = await axios.get(baseUrl + user, config);
      
        console.log('Response:', response.data);
       
        setUserName(response.data);
      } catch (error) {
        console.error('Error:', error);
  
        if (error.response && error.response.status === 401) {
          console.log('Handling 401...again');
          try {
            const refreshResponse = await axios.post(baseUrl + refresh, {
              refresh: localStorage.getItem('refreshjwtToken'),
            });
  
            const newAccessToken = refreshResponse.data.access;
            const newRefreshToken = refreshResponse.data.refresh;

            localStorage.setItem('jwtToken', newAccessToken);
            localStorage.setItem('refreshjwtToken', newRefreshToken);
            console.log(newAccessToken,"newAccestoken")
  
            console.log('Retrying request...');
            const retryConfig = {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
            };
            const retryResponse = await axios.get(baseUrl + user, retryConfig);
            console.log('Retry response:', retryResponse.data);
  
            setUserName(retryResponse.data);
          } catch (refreshError) {
            console.error('Error refreshing access token:', refreshError);
            // Redirect to login or show an error message to the user
          }
        } else {
          // Handle other types of errors
          console.error('Error fetching data:', error);
        }
      }
    };
  
    fetchData();
  }, []);
  

  return (
    <>
  <Navbar/>
  {/* <SideBar/> */}
  <SideBar username={userName ? userName.username : null} />
  <PostListing />
      
    </>
  );
}

export default Home;
