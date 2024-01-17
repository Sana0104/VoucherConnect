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
      <div className="text-container">
        <h1>Oops! Looks Like You're Lost</h1>
        <p className="zoom-area">
          The page you are looking for might be under construction or moved.
        </p>
        <div className="link-container">
          <a href="/" className="more-link">
            Go Back Home
          </a>
        </div>
      </div>
    </div>
  );
}
 
export default NotFound;