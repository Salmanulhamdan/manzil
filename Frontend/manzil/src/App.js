import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRouter from "./routs/user_routs";
// import Navbar from './Components/navbar/navbar';
// import { Suspense, lazy } from "react";
// import AdminRouter from "./routes/adminRoutes";


function App() {
  return (
    
    <BrowserRouter>
   
      <Routes>
        <Route path="/*" element={<UserRouter />} />
       
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;