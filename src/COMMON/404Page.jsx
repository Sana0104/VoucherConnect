import React from 'react';
import './404Page.css';
import { useSelector } from 'react-redux';
import {Link} from 'react-router-dom'
function NotFound() {
  const { isLoggedIn,roles } = useSelector((state) => state.auth.value);
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isCandidate = roles.includes('ROLE_CANDIDATE');
  return (
    <div className="not-found-container">
      <div className="error-container">
        <div className="digit">4</div>
        <div className="digit">0</div>
        <div className="digit">4</div>
      </div>
      <div className="text-container">
        <h1>Oops! Looks Like You're Lost</h1>
        <p className="zoom-area">
          The page you are looking for might be under construction or moved.
        </p>
        <div className="link-container">
        {/* <button className='btn btn-primary'>{isLoggedIn ? (
    <Link to="/userhome">Go Back To Home</Link>
  ) : (
    <Link to="/">Go Back</Link>
  )}</button> */}

<button className="goback-button btn">   {isLoggedIn && isAdmin ? (   
    <Link  className="goback-link" to="/requests">Go Back</Link>  ) : isLoggedIn && isCandidate ? (  
         <Link className="goback-link" to="/candidatedashboard">Go Back</Link>  ) : (    
           <Link className="goback-link" to="/">Go Back</Link>  )} </button>
        </div>
      </div>
    </div>
  );
}
 
export default NotFound;