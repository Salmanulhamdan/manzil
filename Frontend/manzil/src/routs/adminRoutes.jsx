import { Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/admin_side/admin_login";
import AdminDash from "../pages/admin_side/admin_dash";
import UserDetail from "../pages/admin_side/user_detail";
import PlanList from "../pages/admin_side/plans";



function AdminRouter(){
    
   
    return (
        <>
     
        <Routes>
            
           <Route path='/' element={<AdminLogin/>}/>
           <Route path='/admindash' element={<AdminDash/>}/>
           <Route path='/admin_user/:userEmail' element={<UserDetail/>}/>
           <Route path='/plans' element={<PlanList/>}/>

           
        </Routes>
        </>
    )
}

export default AdminRouter