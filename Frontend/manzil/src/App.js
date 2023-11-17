import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserRouter from "./routs/user_routs";
import AdminRouter from './routs/adminRoutes';
// import Navbar from './Components/navbar/navbar';
// import { Suspense, lazy } from "react";



function App() {
  return (
    
    <BrowserRouter>
   
      <Routes>
        <Route path="/*" element={<UserRouter />} />
        <Route path="/admin/*" element={<AdminRouter />} />
       
      </Routes>
     
    </BrowserRouter>
  );
}

export default App;