import React, { Component } from 'react';
import './navbar.css';
import img from "../../assets/logo.svg";
class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // You can set the initial state here if needed
    };
  }

  render() {
    return (
      <nav className="navbar">
        <div className="logo">
        <img src={img} alt="Logo" />
        </div>
        <ul className="nav-links">
        
            <a className= 'home' href="/">Home</a>
          <div className='frame1'>
          
            <a className= 'post'href="/about">Post</a>
            </div>
            <div className='group'>
            <a className= 'professional'href="/services">Professionals</a>
            </div>
            <a className= 'about'href="/contact">Contact</a>
          
        </ul>
      </nav>
    );
  }
}

export default Navbar;
