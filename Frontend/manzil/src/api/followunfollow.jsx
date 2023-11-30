import axios from 'axios'; // Import axios
import { baseUrl } from '../utilits/constants';

const FollowUnfollowApi = async (userId, fetchData) => {
    try {
        let accessToken = localStorage.getItem('jwtToken');

        const response = await axios.post(`${baseUrl}/api/follow/${userId}/`, {}, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });
        if (response.status === 200) {
            console.log('follow/unfollow is working');
            if (fetchData) {
                fetchData();
            }
            return response.data;
            
        } else {
            console.log(response.error);
            console.log('unfollow is working');
        }

    } catch (error) {
        console.log(error);
    }
};


export default FollowUnfollowApi