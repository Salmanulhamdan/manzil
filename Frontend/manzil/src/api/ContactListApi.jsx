import { baseUrl ,contacts} from '../utilits/constants';
import axios from "axios";
const ContactListAPI = async () => {
    try {
      const accessToken = localStorage.getItem('jwtToken');
      const response = await axios.get(baseUrl+contacts, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response,'contacts')
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
  
  export default ContactListAPI;