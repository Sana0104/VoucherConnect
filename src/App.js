
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from './COMMON/Login';
import Dashboard from './ADMIN/Dashboard';
import VoucherDashboard from './ADMIN/VoucherDashboard';
import SignupForm from './ADMIN/SignupForm';
import ViewVouchers from './CANDIDATE/ViewVouchers';
import RequestVoucherForm from './CANDIDATE/requestVoucher';
import { useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import NotFound from './COMMON/404Page';


function App() {
  
  const { isLoggedIn,roles } = useSelector((state) => state.auth.value);
  
  const isAdmin = roles.includes("ADMIN");
  const isCandidate = roles.includes("CANDIDATE");
 
  return (
    <BrowserRouter>
      <Routes>
      
      <Route exact path='/' element={<Login/>}></Route>
      {/* <Route exact path='/not_found' element={<NotFound/>}></Route> */}
      <Route exact path='/signup' element={< SignupForm />}></Route>
      
        <Route exact path='/dashboard' element={isLoggedIn && isAdmin ? < Dashboard />:<Navigate to="/" replace/>}></Route>
       <Route exact path='/voucher-dashboard/:email/:exam/:id' element={isLoggedIn && isAdmin?<VoucherDashboard/>:<Navigate to="/" replace/>}></Route>
       <Route exact path='/vouchers' element={isLoggedIn && isAdmin?<VoucherDashboard />:<Navigate to="/" replace/>} />
       
       
       
        <Route exact path="/candidatedashboard" element={isLoggedIn && isCandidate ?<ViewVouchers/>:<Navigate to="/" replace/>}></Route>
       <Route exact path="/requestform" element={isLoggedIn && isCandidate ?<RequestVoucherForm/>:<Navigate to="/" replace/>}></Route>

       <Route exact path='/404' element={< NotFound />}></Route>
        <Route path="*" element={<Navigate replace to="/404" />} />
        
       
      </Routes>

    </BrowserRouter>
  );
}

export default App;
