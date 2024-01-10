import './sidebar.css';
// import { baseUrl } from '../../utilits/constants';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToolbox,faUser ,faCircleQuestion,faMessage,faBell} from '@fortawesome/free-solid-svg-icons';


function SideBar({username,onToggleComponent}){
    
    const navigate = useNavigate()
 
console.log("ddd",{username})
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
    <span className="savedpost_text ml-2">Notifications</span>
  </div>
  <div className="myposts flex items-center mt-4">
  <FontAwesomeIcon icon={faToolbox} />
    <span className="myposts_text ml-2" onClick={() => onToggleComponent('myrequirment')} >My Requirements</span>
  </div>

  {/* Saved Posts */}
  <div className="savedpost flex items-center mt-4">
  <FontAwesomeIcon icon={faCircleQuestion} />
    <span className="savedpost_text ml-2" onClick={() => onToggleComponent('myquestions')}>My Questions</span>
  </div>

  {/* Messages */}
  <div className="messages flex items-center mt-4">
  <FontAwesomeIcon icon={faMessage} className="text-black" />
    <span className="messages_text ml-2" onClick={() => onToggleComponent('message')}>Messages</span>
  </div>
</div>

    )
}


export default SideBar