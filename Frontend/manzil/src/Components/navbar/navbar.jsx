import React, { Component } from 'react';
import './navbar.css';
import img from "../../assets/logo.svg";
import { useNavigate ,Link } from 'react-router-dom';
function Navbar({usertype,onToggleComponent,naveitems }){

const is_professional = usertype ==="professional"


const navigate = useNavigate();
 const token=localStorage.getItem("jwtToken")
 const logout=()=>{
  localStorage.removeItem("jwtToken");
  localStorage.removeItem("refreshjwtToken")
  console.log(localStorage.getItem("jwtToken"))
  navigate('/')


 }
    return (
<nav className="navbar fixed top-0 z-10 w-full">
  <div className="logo">
   
    <a className='home' href ="homepage" >

          <img src={img} alt="Logo" />
        </a>
  </div>
  
  <div className="nav-links">
  {naveitems !== "landingpage" 
    ? naveitems === "homepage"
      ? <a className='home' href ="homepage" onClick={() => onToggleComponent('post')}>
          Home
        </a>
      : naveitems === "profile"
        ? <Link to="/homepage" className="home" onClick={() => onToggleComponent('post')}>
        Home
      </Link>
        : null // If you want to render nothing for the 'else' condition
    : null // If you want to render nothing for the 'if' condition
  }

    <div className='group'>
    {naveitems !== "landingpage" 
    ? naveitems === "homepage"
      ? <a className='professional' href="/services">Professionals</a>
      : naveitems === "profile"
        ? null
        : null // If you want to render nothing for the 'else' condition
    : null // If you want to render nothing for the 'if' condition
  }
      
      
    </div>
    
    <div className='group'>
    {naveitems !== "landingpage" 
  ? naveitems === "homepage"
    ? is_professional 
      ? <a className='Requirements' onClick={() => onToggleComponent('requirements')}>Requirements</a>
      : null
    : naveitems === "profile"
      ? null
      : null // If you want to render nothing for the 'else' condition
  : null // If you want to render nothing for the 'if' condition
}
    
    </div>
    <div className='group'>
    {naveitems !== "landingpage" 
    ? naveitems === "homepage"
      ? <a className='Qustions' onClick={() => onToggleComponent('questions')}>Qustions</a>
      : naveitems === "profile"
        ? null
        : null // If you want to render nothing for the 'else' condition
    : null // If you want to render nothing for the 'if' condition
  }
      
      
    </div>
    {/* <a className='about' href="/contact">About</a> */}
  </div>
  {/* <input type="text" placeholder="Search" className="search-bar" /> */}
<button type="submit" className="search-button">
  <i className="fa fa-search"></i> 
</button>
{ token?<a className="signup"  onClick={logout}>Log Out</a>:
  <a className="signup" href="/choice">Sign Up</a>
    }
</nav>

    );
  
}

export default Navbar;




