import { baseUrl } from "../utilits/constants";
import axios from "axios";


const CreateChatRoomAPI = async (userId) => {
    try {
      const accessToken = localStorage.getItem('jwtToken');
      let body = {}
      const response = await axios.post(`${baseUrl}/api/create-room/${userId}/`,body,{
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });
      if (response.status === 200) {
        return response.data
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  export default CreateChatRoomAPI;