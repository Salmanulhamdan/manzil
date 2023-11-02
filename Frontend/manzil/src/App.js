import React, { Component } from 'react';
import Navbar from './Components/navbar/navbar';
import SignupPage from './pages/signup_page/signup';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
     <Navbar />
     <SignupPage/>
      </div>
    );
  }
}

export default App;
