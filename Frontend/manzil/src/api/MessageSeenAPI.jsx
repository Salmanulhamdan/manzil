import { baseUrl } from "../utilits/constants";
import axios from "axios";

const MessageSeenAPI = async (userId) => {
    try {
      const accessToken = localStorage.getItem('jwtToken');
      const response = await axios.get(`${baseUrl}/api/seen/${userId}/`, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if  (response.status === 200) {
          return response.data;
      } else {
          console.log(response.error)
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export default MessageSeenAPI;