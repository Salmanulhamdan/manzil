import { Navigate, Route, Routes } from "react-router-dom";
import AdminLogin from "../pages/admin_side/admin_login";
import AdminDash from "../pages/admin_side/admin_dash";
import UserDetail from "../pages/admin_side/user_detail";
import PlanList from "../pages/admin_side/plans";
import { PrivateRoutesAdmin } from './privateroute';
import Repotpage from "../pages/admin_side/report_mngmnt";


function AdminRouter(){
    
   
    return (
        <>
     
        <Routes>
            
           <Route path='/' element={<AdminLogin/>}/>


           <Route element={<PrivateRoutesAdmin />}>
           <Route path='/admindash' element={<AdminDash/>}/>
           <Route path='/admin_user/:userEmail' element={<UserDetail/>}/>
           <Route path='/plans' element={<PlanList/>}/>
           <Route path='/report' element={<Repotpage/>}/>

           </Route>
           
        </Routes>
        </>
    )
}

export default AdminRouter