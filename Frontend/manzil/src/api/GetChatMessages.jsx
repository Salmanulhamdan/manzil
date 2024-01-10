import { baseUrl } from "../utilits/constants";
import axios from "axios";


const GetChatMessages = async (roomId) => {
    try {
      const accessToken = localStorage.getItem('jwtToken');
      const response = await axios.get(`${baseUrl}/api/chat-room/${roomId}/`, {
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
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  
  export default GetChatMessages;