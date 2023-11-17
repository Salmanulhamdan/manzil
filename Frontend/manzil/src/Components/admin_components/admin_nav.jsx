import './admin_nav.css';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { baseUrl } from '../../utilits/constants';


function AdminNav() {

  const navigate = useNavigate()

  const handleLogout = ()=>{
    localStorage.removeItem('jwtTokenAdmin');

    navigate('/admin')
  }
  return (
    <div className='admin_navbar'>
        <div className="input-group md-form form-sm form-1 pl-0">
          <div className="input-group-prepend">
            <span className="input-group-text pink lighten-3" id="basic-text1">
              <FontAwesomeIcon icon={faSearch} className="text-black" />
            </span>
          </div>
          <input className="form-control my-0 py-1 small-input" type="text" placeholder="Search........." aria-label="Search" />
        </div>
      <div className='admin_logout'>
      
        <span onClick={handleLogout} className='logout_link'>Log Out</span>
      </div>
    </div>
  );
}

export default AdminNav;
