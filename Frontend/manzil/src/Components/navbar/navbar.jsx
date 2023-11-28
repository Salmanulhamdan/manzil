import React, { Component } from 'react';
import './navbar.css';
import img from "../../assets/logo.svg";
import { useNavigate } from 'react-router-dom';
function Navbar  (){
const navigate = useNavigate();
 const token=localStorage.getItem("jwtToken")
 const logout=()=>{
  localStorage.removeItem("jwtToken");
  navigate('/')


 }
    return (
<nav className="navbar">
  <div className="logo">
    <img src={img} alt="Logo" />
  </div>
  <div className="nav-links">
    <a className='home' href="/homepage">Home</a>
    <div className='frame1'>
      <a className='post' href="/about">Post</a>
    </div>
    <div className='group'>
      <a className='professional' href="/services">Professionals</a>
    </div>
    <a className='about' href="/contact">About</a>
  </div>
  <input type="text" placeholder="Search" className="search-bar" />
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




