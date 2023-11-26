// Dashboard.js
import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import Popover from '@mui/material/Popover';
import UserProfile from "../CANDIDATE/UserProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faCalendar,
  faBell,
  faArrowLeft,
  faClipboardCheck,
  faUser,
  faTachometerAlt,
  faCog
} from "@fortawesome/free-solid-svg-icons";

import { Link, useParams, useNavigate } from "react-router-dom";

function VoucherDashboard() {
  const obj = localStorage.getItem("userInfo");
  const { name } = JSON.parse(obj);
  const [requests, setRequests] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  
  const openProfilePopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeProfilePopup = () => {
    setAnchorEl(null);
  };

  const isProfilePopupOpen = Boolean(anchorEl);

  const [searchOption, setSearchOption] = useState("default");
  const [searchValue, setSearchValue] = useState("");

  const [vouchers, setVouchers] = useState([]);

  const { email, exam, id } = useParams();

  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
  };
 
  
  const handleModalSubmit = () => {
    handleFileUpload();
    closeModal();
  };
  
  useEffect(() => {
    axios.get(`http://localhost:9091/voucher/vouchersByExamName/${exam}`)
      .then(response => {
        console.log(response.data);
        setVouchers(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

  const handleSearchOptionChange = async (event) => {
    const selectedOption = event.target.value;
    setSearchOption(selectedOption);

    if (selectedOption === 'Expired') {
      try {
        const response = await axios.get('http://localhost:9091/voucher/getAllExpiredVouchers');
        setVouchers(response.data);
      } catch (error) {
        console.error(error);
      }
    } else if (selectedOption === 'Available') {
      try {
        const response = await axios.get('http://localhost:9091/voucher/getAllVouchers');
        setVouchers(response.data);
      } catch (error) {
        console.error(error);
      }
    } else if (selectedOption === 'default') {
      try {
        const response = await axios.get(`http://localhost:9091/voucher/vouchersByExamName/${exam}`);
        setVouchers(response.data);
      } catch (error) {
        console.error(error);
      }
    } else if (selectedOption === 'Assigned') {
      try {
        const response = await axios.get('http://localhost:9091/voucher/getAllAssignedVoucher');
        setVouchers(response.data);
      } catch (error) {
        console.error(error);
      }
    } else if (selectedOption === 'AssignedNotUsed') {
      try {
        const response = await axios.get('http://localhost:9091/voucher/getAllAssignedButNotUtilizedVoucher');
        setVouchers(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    // Notify user about the filter change
    toast.info(`Showing ${selectedOption} vouchers`);
  };

  const handleActionButtonClick = async (voucherid, isExpired) => {
    if (isExpired) {
      try {
        const response = await axios.delete(`http://localhost:9091/voucher/deleteVoucher/${voucherid}`);
        console.log(response.data);
        const updatedVouchers = vouchers.filter(voucher => voucher.id !== voucherid);
        setVouchers(updatedVouchers);
        navigate(`/voucher-dashboard/${email}/${exam}/${id}`);
  
        // Show success toasty message
        toast.success('Voucher Deleted Successfully!!!');
      } catch (error) {
        console.error(error.response.data);
        alert(error.data);
      }
    } else {
      try {
        const response = await axios.get(`http://localhost:8085/requests/assignvoucher/${voucherid}/${email}/${id}`);
        console.log(response.data);
        navigate("/dashboard");
  
        // Show success toasty message
        toast.success('Voucher Assigned Successfully!!!');
      } catch (error) {
        console.error(error.response.data);
        alert(error.data);
      }
    }
  };
 
 

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) {
        toast.error('Please select a file to upload.');
        return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('http://localhost:9091/voucher/addVouchers', formData);

      console.log('Backend Response:', response.data);

      const vouchersArray = response.data;
      setVouchers(vouchersArray);

      toast.success('Data added successfully');
    } catch (error) {
      console.error('Error uploading file', error);

      if (error.response) {
        toast.error(`Error: ${error.response.data}`);
      } else if (error.request) {
        toast.error('Error: No response from the server.');
      } else {
        toast.error('Error: Something went wrong.');
      }
    }
  };
  const handleDownloadSampleSheet = () => {
    const sheetContent = [
      ['EXAM NAME', 'CLOUD PLATFORM', 'VOUCHER CODE', 'ISSUED DATE', 'EXPIRY DATE']
     
    ];
  
    
    const ws = XLSX.utils.aoa_to_sheet(sheetContent);
  
   
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'data');
  
    
    XLSX.writeFile(wb, 'SampleSheet.xlsx', { bookType: 'xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
    
  };
  return (
    <div className="headd">
      <div>
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      </div>

      <div className="navbar" style={{ backgroundColor: "rgb(112, 183, 184)" }}>
        <div className="user-info" style={{ marginLeft: "10px" }}>
          <p id="name">Welcome!!</p>
          <p id="date">
            {currentTime.toLocaleTimeString(undefined, timeOptions)}{" "}
            {currentTime.toLocaleDateString(undefined, dateOptions)}
          </p>
        </div>

        <div className="user-info">
          <div>
            <Button color="inherit" onClick={openProfilePopup}>
              <AccountCircleIcon />
              {name}
            </Button>
            <Popover
              open={isProfilePopupOpen}
              anchorEl={anchorEl}
              onClose={closeProfilePopup}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <UserProfile />
            </Popover>
          </div>
        </div>
      </div>

      <div className="wrap">
        <div className="dashboard-container">
        <div className="back">
  <p>
    <Link to="/dashboard" style={{ color: "black", textDecoration: "none", fontSize: "16px", fontWeight: "bold" }}>
      <FontAwesomeIcon icon={faArrowLeft} /> Back
    </Link>
  </p>
</div>


<div className="dashboard-dropdown">
  <select
    className="search-text"
    value={searchOption}
    onChange={handleSearchOptionChange}
    style={{
      fontSize: "14px",
      height: "40px",
      borderRadius: "5px",
      paddingLeft: "10px",
      border: "1px solid #3498db",
      background: "#ecf0f1", // Light gray background
      color: "#2c3e50", // Dark text color
      outline: "none",
    }}
  >
    <option value="default">Filters</option>
    <option value="Expired">
      All Expired Vouchers
    </option>
    <option value="Available">
      All Available Vouchers
    </option>
    <option value="Assigned" >
      All Assigned Vouchers
    </option>
    <option value="AssignedNotUsed" >
      Assigned Not Used Vouchers
    </option>
  </select>
</div>


<div className="right-corner">
  <button
    style={{
      backgroundColor: "#2ecc71",
      color: "#fff",
      fontSize: "16px",
      height: "45px",
      width: "120px",
      borderRadius: "8px",
      cursor: "pointer",
      marginRight: "20px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      border: "none",
    }}
    onClick={openModal}
  >
    Add Voucher
  </button>
  <button
          style={{
            backgroundColor: "#3498db",
            color: "#fff",
            fontSize: "16px",
            height: "45px",
            width: "180px",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "20px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            border: "none",
          }}
          onClick={handleDownloadSampleSheet}
        >
          Download Sample Sheet
        </button>
</div>
        </div>
        <Modal
  open={isModalOpen}
  onClose={closeModal}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
  <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
    <Typography id="modal-title" variant="h6" component="h2">
      Choose File
    </Typography>
    <input
      type="file"
      accept=".xlsx"
      style={{
        border: "2px solid #3498db",
        padding: "6px",
        borderRadius: "8px",
        width: "100%",
        cursor: "pointer",
        marginBottom: "20px",
      }}
      onChange={handleFileChange}
    />
    <Button onClick={handleModalSubmit} variant="contained" style={{ backgroundColor: "#2ecc71", color: "#fff" }}>
      Submit
    </Button>
  </Box>
</Modal>
        <div className="table-div">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Cloud</th>
                <th>Exam</th>
                <th>Voucher Code</th>
                <th>Issue Date</th>
                <th>Expiry Date</th>
                <th>Issued To</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {vouchers.map((row, index) => (
                <tr key={index}>
                  <td>{row.cloudPlatform}</td>
                  <td>{row.examName}</td>
                  <td>{row.voucherCode}</td>
                  <td>{row.issuedDate}</td>
                  <td>{row.expiryDate}</td>
                  <td>{row.issuedTo}</td>
                  <td>
  {(searchOption === 'Available' || searchOption === 'default') ? (
    <button
      style={{
        backgroundColor: "#e3c449",
        fontSize: "12px",
        height: "40px",
        color: "white",
        borderRadius: "5px",
        cursor: "pointer",
        border: "none",
      }}
      onClick={() => handleActionButtonClick(row.id, false)}
    >
      Assign
    </button>
  ) : (
    <button
      style={{
        backgroundColor: "#e74c3c",
        fontSize: "12px",
        height: "40px",
        color: "white",
        borderRadius: "5px",
        cursor: "pointer",
        border: "none",
      }}
      onClick={() => handleActionButtonClick(row.id, true)}
    >
      Delete
    </button>
  )}
</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <footer className="footer-div">
          <p>Capgemini 2022, All rights reserved.</p>
        </footer>
      </div>

      <div className="left-column">
        <h2 className="heading">Voucher Dashboard</h2>

        <hr />

        <div className="row">
          <div className="left-row">
            <p><Link to='/dashboard' style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faTachometerAlt} size="1x" /> Dashboard</Link></p>
          </div>

          <div className="left-row">
            <p><Link to={'/vouchers'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faClipboardCheck} size="1x" /> Vouchers</Link></p>
          </div>
        </div>
      </div>

      <div>
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      </div>
    </div>
  );
}

export default VoucherDashboard;