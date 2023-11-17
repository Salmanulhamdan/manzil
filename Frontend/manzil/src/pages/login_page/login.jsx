import './loginpage.css'
import axios from 'axios'
import { useEffect, useState } from 'react';
import {baseUrl,login} from "../../utilits/constants";
import { useNavigate,Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


function LoginForm(){


const navigate = useNavigate()

useEffect(()=>{
const isLoggedIn = localStorage.getItem('jwtToken');
if (isLoggedIn) {
    navigate('/homepage');  // Redirect to the homepage
}
},[])
const loginUser = async (credentials) => {
    try {
      const response = await axios.post(baseUrl+login, credentials);
      console.log(response.data);
      localStorage.setItem('jwtToken', response.data.access);
      localStorage.setItem('refreshjwtToken', response.data.refresh);
      navigate('/homepage', { state: response.data  });
    } catch (error) {
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
    await loginUser(formData);
   
  };


    return(
      <>
       <div className="container">
          <div className="row">
              <div className="col-md-6 first">
                  
              </div>
              <div className="col-md-6 second">
                  <div className='rectangle'>
                      <h1 className='title'>Nameee</h1>
                      <form onSubmit={handleSubmit}>
                          <input type='text' className='email form-control' placeholder='Username or Email.......'
                              value={email} onChange={(e) => setEmail(e.target.value)} />
                          <input type='password' className='password form-control' placeholder='Password.......'
                              value={password} onChange={(e) => setPassword(e.target.value)} />
                          <button className='login btn pt-1' type='submit'>Login</button>
                      </form>
                      
                      <span className='text'>If you dont have one, create your account here........
                          <Link to="/choice" className='link'>signup</Link>
                      </span>
                  </div>
              </div>
          </div>
      </div>

         
      </>

    );
}

export default LoginForm;
