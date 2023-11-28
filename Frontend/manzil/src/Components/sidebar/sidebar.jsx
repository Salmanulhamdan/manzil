import './sidebar.css';
// import { baseUrl } from '../../utilits/constants';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch,faUser } from '@fortawesome/free-solid-svg-icons';


function SideBar({username}){
    
    const navigate = useNavigate()
    const handleUserLogout = ()=>{
        localStorage.removeItem('jwtToken');
    
        navigate('/')
      }
console.log("ddd",{username})
    return(
        <div className="box2">
    <div className='myprofile'>
        {username ? (
            <div>
                <FontAwesomeIcon icon={faUser} className="text-black" />
                <Link className="myprofile_text" to='/myprofile'>{username}</Link>
            </div>
        ) : (
            <div>
                <FontAwesomeIcon icon={faUser} className="text-black" />
                <Link className="myprofile_text" to='/myprofile'>My Profile</Link>
            </div>
        )}
    </div>
            <div className='myposts'>
                <img className="myposts_pic" />
                <span className="myposts_text">My Posts</span>
            </div>
            <div className='savedpost'>
                <img className="savedpost_pic"  />
                <span className="savedpost_text">Saved Posts</span>
            </div>
            <div className='followers'>
                <img className="followers_pic"  />
                <span className="followers_text">Followers</span>
            </div>
            <div className='following'>
                <img className="following_pic"  />
                <span className="following_text">Followings</span>
            </div>
            <div className='messages'>
                  <img className="messages_pic" />
                  <span className="messages_text">Messages</span>
            </div>
            <div className='logout'>
                  {/* <img className="messages_pic" src={baseUrl+pic} /> */}
                  <button className="logout_link" onClick={handleUserLogout}>Log Out</button>
            </div>
              
              



        </div>
    )
}


export default SideBar