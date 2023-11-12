import React from 'react';
import bgimg from "../../assets/3d-render-empty-room.jpg"
import Navbar from "../../Components/navbar/navbar"
function LandingPage() {
  return (
    <div className="landing-page">
    <Navbar/>
    
    

        
      
<div className="background-image" style={{ position: "relative" }}>
  <button className="google-login" style={{ position: "absolute", top: "41%", left: "45%" }}>
    Login with Google
  </button>
  <button className="facebook-login" style={{ position: "absolute", top: "45%", right: "47%" }}>
    Login with Facebook
  </button>
  <img src={bgimg} className="bg-image" alt="Logo" style={{ width: "100%", objectFit: "cover" }} />
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