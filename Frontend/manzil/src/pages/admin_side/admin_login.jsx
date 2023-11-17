import './admin_login.css'
import axios from 'axios'
import { useEffect,useState } from 'react';
import { baseUrl,login } from '../../utilits/constants';
import { useNavigate,Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {jwtDecode} from "jwt-decode";




function AdminLogin(){

        useEffect(()=>{
            const isLoggedIn = localStorage.getItem('jwtTokenAdmin');
            if (isLoggedIn) {
                navigate('/admin/admindash');  // Redirect to the homepage
            }
            },[])
        const navigate = useNavigate()
        const adminlogin = async (credentials) => {
            try {
            const response = await axios.post(baseUrl+login, credentials);
            console.log("response printed",response.data);
            const decodedToken = jwtDecode(response?.data?.access);
            console.log(decodedToken.is_superuser)
            if (decodedToken.is_superuser) {
               localStorage.setItem('jwtTokenAdmin', response.data.access);
               localStorage.setItem('refreshjwtTokenAdmin', response.data.refresh);

               console.log("saved succesfully")
               navigate('/admin/admindash');
            } 
            else{
                alert("Not a superuser")
            }
           

            }
            catch (error) {
            alert("wrong credentials")
            console.error(error);
            }
        };

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const handleSubmit = async (event) => {
            event.preventDefault();
            console.log(email,password,"state")
        
            const formData = {
                email,password
            };
        
            // Call your login function
            await adminlogin(formData);
        
        };



    return (
        <div className="loginbox">
            <h1 className="admin_title">Admin</h1>
            <form onSubmit={handleSubmit}>
                <input type='text' className='adminemail form-control' placeholder='Email.......'
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type='password' className='adminpassword form-control' placeholder='Password.......'
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className='admin_login btn pt-1' type='submit'>Login</button>
            </form>

        </div>
    )
}


export default AdminLogin