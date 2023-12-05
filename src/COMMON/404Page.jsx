import React from 'react'
import './404Page.css';
function NotFound() {
    return (
        <div>
            <h1>Looks Like Your Lost</h1><p class="zoom-area">
                <b>Opps!</b> Page Not Found </p>
                <section class="error-container"> 
                 <span class="four">
                    <span class="screen-reader-text">4</span>
                    </span>  <span class="zero"><span class="screen-reader-text">0</span></span>
                      <span class="four"><span class="screen-reader-text">4</span></span></section>
        </div>
    )
}

export default NotFound;
