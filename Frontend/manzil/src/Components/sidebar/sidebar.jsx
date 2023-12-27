import './sidebar.css';
// import { baseUrl } from '../../utilits/constants';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToolbox,faUser ,faCircleQuestion,faMessage} from '@fortawesome/free-solid-svg-icons';


function SideBar({username}){
    
    const navigate = useNavigate()
 
console.log("ddd",{username})
    return(
<div className="box2 bg-white p-4 shadow-md">
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

  {/* My Posts */}
  <div className="myposts flex items-center mt-4">
  <FontAwesomeIcon icon={faToolbox} />
    <span className="myposts_text ml-2">Requirements</span>
  </div>

  {/* Saved Posts */}
  <div className="savedpost flex items-center mt-4">
  <FontAwesomeIcon icon={faCircleQuestion} />
    <span className="savedpost_text ml-2">My Questions</span>
  </div>

  {/* Messages */}
  <div className="messages flex items-center mt-4">
  <FontAwesomeIcon icon={faMessage} className="text-black" />
    <span className="messages_text ml-2">Messages</span>
  </div>
</div>

    )
}


export default SideBar