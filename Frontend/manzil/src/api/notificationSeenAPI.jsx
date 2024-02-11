import axios from "axios";
import { baseUrl } from "../utilits/constants";

const notificationSeenApi = async (notificationId) =>  {
  try {
    const accessToken = localStorage.getItem('jwtToken');;

    // Make sure to include the 'Content-Type' header and remove extra object nesting
    const response = await axios.post(
      `${baseUrl}/api/notifications-seen/${notificationId}/`,
      null, // No request body, you can use null
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      console.error('Error:', response.data);
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle errors here
  }
};

export default notificationSeenApi;