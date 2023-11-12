import React from 'react';
import {  Route, Routes } from "react-router-dom";
import LandingPage from '../pages/landing_page/landing_page';
import HouseownerSignUpForm from "../pages/signup_page/houseownersignup";
import ProfessionalSignup from '../pages/signup_page/professional_signup';
import ChoicePage from '../pages/choices/choice';
// import Home from "../pages/HomePage";
// import Profile from "../pages/ProfilePage";


export default function UserRouter(){
    
   
    return (
        <div>
     
        <Routes>
        <Route path='/'element={<LandingPage />}/>
        <Route path='/signup/houseowner'element={<HouseownerSignUpForm />}/>
        <Route path='/signup/professional'element={<ProfessionalSignup />}/>
        <Route path='/choice'element={<ChoicePage />}/>
        </Routes>
        </div>
    )
}