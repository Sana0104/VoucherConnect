import React from 'react';
import './404Page.css';
 
function NotFound() {
  return (
    <div className="not-found-container">
      <div className="error-container">
        <div className="digit">4</div>
        <div className="digit">0</div>
        <div className="digit">4</div>
      </div>
      <br/>
      <br/>
      <div className="text-container">
        <h1><b>OOPS! Looks Like You're Lost</b></h1>
        <p className="zoom-area">
          The page you are looking for might be under construction or doesn't exist.
        </p>
        <br/>
        <div className="link-container">
          <a href="/" className="more-link">
            Return Home
          </a>
        </div>
      </div>
    </div>
  );
}
 
export default NotFound;