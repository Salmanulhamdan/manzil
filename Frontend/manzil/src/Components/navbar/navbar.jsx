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
        
            <a href="/">Home</a>
          
          
            <a href="/about">About</a>
          
            <a href="/services">Services</a>
          
            <a href="/contact">Contact</a>
          
        </ul>
      </nav>
    );
  }
}

export default Navbar;
