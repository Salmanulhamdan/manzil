import React from 'react';
import bgimg from "../../assets/3d-render-empty-room.jpg"
import Navbar from "../../Components/navbar/navbar"
function LandingPage() {
  return (
    <div className="landing-page">
    <Navbar/>
    
      <div className="background-image">
      <img src={bgimg} className='bg-image' alt="Logo" style={{"width":"100%", objectFit:"cover"}} />
      

      <div className="social-login">
        <button className="google-login">Login with Google</button>
        <button className="facebook-login">Login with Facebook</button>
      </div>

      </div>

      <div className="user-posts">
        {/* User posts go here */}
      </div>

      <div className="banner">
        {/* Banner content */}
      </div>

      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default LandingPage;