import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from 'react-router-dom'

const UserList = ({users}) => {
  

  const [showblockedusers,setShowblockedUsers] = useState(false)
  const filteredusers = showblockedusers?users.filter((user)=>!user.is_active):users.filter((user)=>user.is_active)
  console.log(filteredusers)
  return (
   
 <div>
  <div style={{ color: 'black', fontSize: '15px', marginLeft: '0%', marginTop: '5%' }}>
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" style={{ marginLeft: '75%' }} onClick={() => setShowblockedUsers(!showblockedusers)}>
      {showblockedusers ? 'Show All Users' : 'Show Blocked Users'}
    </button>
    
  </div>
<div className='flex ml-auto 'style={{ marginLeft: '500px' }}>
  <div style={{ marginRight: '300px' }}>
    
    <ol style={{
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '0%',
      marginTop: '2%',
      
    }}>
<h3 style={{ fontWeight: 'bold', textDecoration: 'underline' }}>House Owners</h3>
<br></br>

      {filteredusers
        .filter(user => user.usertype === 'houseowner')
        .map((user, index) => (
          <li className='mb-2' key={user.id}>
            {user.is_deleted ? (
              <span>{user.email}</span>
            ) : (
              <Link
                to={`/admin/admin_user/${user.email}`}
                style={{
                  backgroundColor: 'transparent',
                  textDecoration: 'none',
                  color: 'blue',
                  transformOrigin: 'center',
                  display: 'inline-block',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {user.email} 
              </Link>
            )}
          </li>
        ))}
    </ol>
  </div>

  <div>
    <h3 style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Professionals</h3>
    <br></br>
    <ol style={{
      display: 'flex',
      flexDirection: 'column',
      marginLeft: '0%',
      marginTop: '2%',
     
    }}>
     
      {filteredusers
        .filter(user => user.usertype === 'professional')
        .map((user, index) => (
          <li className='mb-2' key={user.id}>
            {user.is_deleted ? (
              <span>{user.email}</span>
            ) : (
              <Link
                to={`/admin/admin_user/${user.email}`}
                style={{
                  backgroundColor: 'transparent',
                  textDecoration: 'none',
                  color: 'green',
                  transformOrigin: 'center',
                  display: 'inline-block',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              >
                {user.email} 
              </Link>
            )}
          </li>
        ))}
    </ol>
  </div>
  </div>
</div>
  );
};

export default UserList;
