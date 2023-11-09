import React, { Component } from 'react';
// import Navbar from './Components/navbar/navbar';
// import ChoicePage from './pages/choices/choice';
// import ProfessionalSignup from './pages/signup_page/professional_signup';
import HouseOwnerSignup from './pages/signup_page/houseownersignup';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
     {/* <Navbar/> */}
     <HouseOwnerSignup/>
    

      
      </div>
    );
  }
}

export default App;
