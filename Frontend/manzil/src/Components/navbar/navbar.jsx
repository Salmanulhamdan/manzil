import React, { Component } from 'react';
import './navbar.css';
import img from "../../assets/logo.svg";
import { useNavigate } from 'react-router-dom';
function Navbar({usertype,onToggleComponent }){

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
<nav className="navbar">
  <div className="logo">
    <img src={img} alt="Logo" />
  </div>
  <div className="nav-links">{localStorage.getItem("jwtToken") ?
    <a className='home' onClick={() => onToggleComponent('post')}>
    Home
  </a>: <a className='home'  href="/">Home</a>}
  
    <div className='group'>
      <a className='professional' href="/services">Professionals</a>
      
    </div>
    {is_professional ? 
    <div className='group'>
      <a className='professional' onClick={() => onToggleComponent('requirements')} >Requirements</a>
      
    </div>:""}
    <div className='group'>
      <a className='professional' onClick={() => onToggleComponent('questions')}>Qustions</a>
      
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




