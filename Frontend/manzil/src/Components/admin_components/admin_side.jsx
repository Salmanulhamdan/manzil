import './admin_side.css';
import { baseUrl } from '../../utilits/constants';
import { Link } from 'react-router-dom';



function AdminSide(){
    return(
        <div className="admin_box">
            
            <h1 className="admin_side_title_txt">Admin</h1>
          
            <ul>
                    <li className="admin_dash_link">Dashboard</li>
                    <li className="admin_user"><Link to='#' className='admin_user_link'>User Management</Link></li>
            </ul>
            
          


        </div>
    )
}


export default AdminSide