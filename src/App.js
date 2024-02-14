import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './COMMON/Login';
import VoucherRequests from './ADMIN/VoucherRequests';
import VoucherDashboard from './ADMIN/VoucherDashboard';
import SignupForm from './ADMIN/SignupForm';
import ViewVouchers from './CANDIDATE/ViewVouchers';
import RequestVoucherForm from './CANDIDATE/requestVoucher';
import { useSelector } from 'react-redux';
import React from 'react';
import NotFound from './COMMON/404Page';
import Dashboard from './ADMIN/Dashboard';
import CandidateList from './ADMIN/CandidateList';

function App() {
  const { isLoggedIn,roles } = useSelector((state) => state.auth.value);
  const isAdmin = roles.includes('ROLE_ADMIN');
  const isCandidate = roles.includes('ROLE_CANDIDATE');

  return (
    
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/signup" element={<SignupForm />} />
          <Route
            exact
            path="/requests"
            element={
              isLoggedIn && isAdmin ? <VoucherRequests /> : <Navigate to="/" replace />
            }
          />
           <Route
            exact
            path="/candidates"
            element={
              isLoggedIn && isAdmin ? <CandidateList /> : <Navigate to="/" replace />
            }
          />
          <Route
            exact
            path="/dashboard"
            element={
              isLoggedIn && isAdmin ? <Dashboard /> : <Navigate to="/" replace />
            }
          />
          <Route
            exact
            path="/voucher-dashboard/:email/:exam/:id"
            element={
              isLoggedIn && isAdmin ? <VoucherDashboard /> : <Navigate to="/" replace />
            }
          />
          <Route
            exact
            path="/vouchers"
            element={
              isLoggedIn && isAdmin ? <VoucherDashboard /> : <Navigate to="/" replace />
            }
          />
          <Route
            exact
            path="/candidatedashboard"
            element={
              isLoggedIn && isCandidate ? <ViewVouchers /> : <Navigate to="/" replace />
            }
          />
          <Route
            exact
            path="/requestform"
            element={
              isLoggedIn && isCandidate ? <RequestVoucherForm /> : <Navigate to="/" replace />
            }
          />
          <Route exact path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate replace to="/404" />} />
        </Routes>
      </BrowserRouter>
    
  );
}

export default App;
