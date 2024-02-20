import AdminNav from "../../Components/admin_components/admin_nav";
import AdminSide from "../../Components/admin_components/admin_side";
import UserList from "./user_list";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl,registeredUsers,refresh } from "../../utilits/constants";



function AdminDash(){

    const [users,setUsers] = useState([])
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const token = localStorage.getItem('jwtTokenAdmin');
            console.log('Token:', token);
      
            const config = {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            };
      
            console.log('Making request...');
            const response = await axios.get(baseUrl+registeredUsers,config)

            console.log('Response:', response.data);
      
            setUsers(response.data);
            console.log(response.data,"ddddddddddddddddddddddddddddddddddddddd");
          } catch (error) {
            console.error('Error:', error);
      
            if (error.response && error.response.status === 401) {
              console.log('Handling 401...');
              try {
                const refreshResponse = await axios.post(baseUrl + refresh, {
                  refresh: localStorage.getItem('refreshjwtTokenAdmin'),
                });
      
                const newAccessTokenAdmin = refreshResponse.data.access;
                localStorage.setItem('jwtTokenAdmin', newAccessTokenAdmin);
                const newRefreshTokenAdmin = refreshResponse.data.refresh;
                localStorage.setItem('refreshjwtTokenAdmin', newRefreshTokenAdmin);
                console.log(newAccessTokenAdmin)
                console.log('Retrying request...');
                const retryConfig = {
                  headers: {
                    Authorization: `Bearer ${newAccessTokenAdmin}`,
                  },
                };
                const retryResponse = await axios.get(baseUrl+registeredUsers,retryConfig)
                console.log('Retry response:', retryResponse.data);
      
                setUsers(retryResponse.data);
              } catch (refreshError) {
                console.error('Error refreshing access token:', refreshError);
                console.error('Refresh error details:', refreshError.response); // Log the response for more details

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
      
   
   
    return(
        <div className="grid grid-cols-6">
            <AdminSide/>
            <AdminNav/>
            {error ? (
                <div className="error-message">
                    Something went wrong while fetching user details.
                </div>
            ) : (
                <UserList users={users} />
            )}

        </div>
    )
}


export default AdminDash