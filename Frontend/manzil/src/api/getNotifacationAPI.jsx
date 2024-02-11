import axios from "axios";
import { baseUrl } from "../utilits/constants";



const getNotificationsApi = async () => {
    try {
        const accessToken = localStorage.getItem('jwtToken');
        const response = await axios.get(`${baseUrl}/api/notifications/`, {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if  (response.status === 200) {
          console.log("llllllllllllllllllllll");
          console.log(response,"notificatio1234");
            return response.data;
        } else {
            console.log(response.error)
        }
        
      } catch (error) {
        console.error(error);
    }
  };

export default getNotificationsApi