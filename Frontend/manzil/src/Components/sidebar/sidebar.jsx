import './sidebar.css';
// import { baseUrl } from '../../utilits/constants';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToolbox,faUser ,faCircleQuestion,faMessage,faBell} from '@fortawesome/free-solid-svg-icons';
import NotificationModal from '../modals/notificationmodal';
import { useState,useEffect } from 'react';
import getNotificationsApi from '../../api/getNotifacationAPI';

function SideBar({username,onToggleComponent}){


  

  const [showNotify, setShowNotify] = useState(false);
  const [notification, setNotification] = useState([]);
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const data = await getNotificationsApi();
        setNotification(data);
        console.log("notificationnnnn",data);
      } catch (error) {
        console.error(error);
      }
    };
    if (token) {
      fetchData();
    }
  }, []);

    
  useEffect(() => {
    if (token) {
      console.log("notification websocket calling")
      const websocketProtocol =
        window.location.protocol === "https:" ? "wss://" : "ws://";
      const socket = new WebSocket(`${websocketProtocol}//127.0.0.1:8000/ws/notification/?token=${token}`);
    
      console.log(socket,"notification socket")

      socket.onopen = () => {
        console.log("WebSocket connection established");
      };

      socket.onmessage = (event) => {
        console.log(event,"notification socket event ")
        console.log(event.data,"evendaaataaa");
        const newNotification = JSON.parse(event.data);
        console.log(newNotification,"new notification");
        if (newNotification.type === "notification") {
          setNotification((prevNotifications) => [
            ...prevNotifications,
            newNotification.payload,
          ]);
        }
        
      };
      socket.onerror = (error) => {
console.error(error);
};
      socket.onclose = (event) => {
        console.log("WebSocket connection closed", event);
      };

      return () => {
        socket.close();
      };
    }
  }, [token]);


  const removeNotification = (notificationIdToRemove) => {
    setNotification((prevNotifications) =>
      prevNotifications.filter(
        (notification) => notification.id !== notificationIdToRemove
      )
    );
  };



 

    return(
<div className="box2 bg-white p-4 shadow-md fixed">
  {/* My Profile */}
  <div className="myprofile flex items-center">
    <FontAwesomeIcon icon={faUser} className="text-black" />
    {username ? (
      <Link to="/myprofile" className="myprofile_text ml-2">
        {username}
      </Link>
    ) : (
      <Link to="/myprofile" className="myprofile_text ml-2">
        My Profile
      </Link>
    )}
  </div>

  <div className="savedpost flex items-center mt-4">
  <FontAwesomeIcon icon={faBell} /> 
  <button
              className="myposts_text ml-2 relative"
             
              onMouseOver={(e)=>e.currentTarget.style.cursor='pointer'}
              onClick={() => {setShowNotify(true)}}
            >
              Notifications
             {/* Increase icon size */}
             {notification?.length > 0 && (
                <span className="absolute -top-4 -right-2 text-black px-2 py-1 rounded-full">
                  {notification?.length}
                </span>
              )}
            </button>
  </div>
  {showNotify && (
        <div className="notification-modal">
          <NotificationModal
            isVisible={showNotify}
            onClose={() => setShowNotify(false)}
            notification={notification}
            removeNotification={removeNotification}
          />
        </div>
      )}

  <div className="myposts flex items-center mt-4">
  <FontAwesomeIcon icon={faToolbox} />
    <span className="myposts_text ml-2" onClick={() => onToggleComponent('myrequirment')} onMouseOver={(e)=>e.currentTarget.style.cursor='pointer'} >My Requirements
    
    </span>
  </div>

  {/* Saved Posts */}
  <div className="savedpost flex items-center mt-4">
  <FontAwesomeIcon icon={faCircleQuestion} />
    <span className="savedpost_text ml-2" onClick={() => onToggleComponent('myquestions')} onMouseOver={(e)=>e.currentTarget.style.cursor='pointer'}>My Questions</span>
  </div>

  {/* Messages */}
  <div className="messages flex items-center mt-4">
  <FontAwesomeIcon icon={faMessage} className="text-black" />
    <span className="messages_text ml-2" onClick={() => onToggleComponent('message')} onMouseOver={(e)=>e.currentTarget.style.cursor='pointer'}>Messages</span>
  </div>
</div>

    )
}


export default SideBar