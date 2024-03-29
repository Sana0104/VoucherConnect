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
import Avatar from '@mui/material/Avatar';
import * as XLSX from 'xlsx';
import { TablePagination } from "@mui/material";

import Popover from '@mui/material/Popover';
import UserProfile from "../CANDIDATE/UserProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faCalendar,
  faBell,
  faArrowLeft,
  faClipboardCheck,
  faUsers,
  faList,
  faTachometerAlt,
  faCog
} from "@fortawesome/free-solid-svg-icons";

import { Link, useParams, useNavigate } from "react-router-dom";

function VoucherDashboard() {
  const obj = localStorage.getItem("userInfo");
  const { name, username } = JSON.parse(obj);
  const [requests, setRequests] = useState([]);
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(null);

  
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
        navigate("/vouchers");
        
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
        navigate("/requests");
  
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
  
      const newVouchersArray = response.data;
  
      // Check for duplicate voucher codes before adding
      const duplicates = newVouchersArray.filter((newVoucher) =>
        vouchers.some((existingVoucher) => existingVoucher.voucherCode === newVoucher.voucherCode)
      );
  
      if (duplicates.length > 0) {
        // If duplicates are found, show an error message
        console.error('Duplicate vouchers found:', duplicates);
  
        // Check if the error response has a 'message' property
        const errorMessage = duplicates.map((v) => v.voucherCode);
        toast.error(`Duplicate vouchers found. These vouchers were not added: ${errorMessage.join(', ')}`);
        return; // Return to avoid executing the next part if duplicates are found
      }
  
      // If no duplicates, update the state with new vouchers
      setVouchers((prevVouchers) => [...prevVouchers, ...newVouchersArray]);
      toast.success('Data added successfully');
    } catch (error) {
      console.error('Error uploading file', error);
  
      if (error.response && error.response.data && error.response.data.message) {
        // Check if the error response has a 'message' property
        const errorMessage = error.response.data.message;
  
        // Check if the message is an array (indicating duplicate vouchers)
        if (Array.isArray(errorMessage)) {
          const duplicateVoucherCodes = errorMessage.map((v) => v.voucherCode).join(', ');
          toast.error(`Duplicate vouchers found. These vouchers were not added: ${duplicateVoucherCodes}`);
        } else {
          // If not an array, treat it as a regular error message
          toast.error(`Error: ${errorMessage}`);
        }
      } else if (error.request) {
        console.error('Error request:', error.request);
        toast.error('Error: No response from the server.');
      } else {
        console.error('Other error:', error);
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
  useEffect(() => {
    const fetchProfileImageURL = async () => {
      try {
        const response = await axios.get(`http://localhost:9092/user/getProfileImageURL/${username}`, {
          responseType: 'arraybuffer',
        });

        const blob = new Blob([response.data], { type: 'image/jpeg' });
        const reader = new FileReader();

        reader.onloadend = () => {
          setProfileImageURL(reader.result);
        };

        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error fetching image URL:', error.message);
      }
    };

    fetchProfileImageURL();
  }, [username]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
      setPage(newPage);
  };
 
  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };
  const acceptedFileFormats = ['.xlsx'];
  return (
    <div className="headd">
      <div>
        <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      </div>

      <div className="navbar" style={{ backgroundColor: "rgb(112, 183, 184)", width: "auto"}}>
        <div className="user-info" style={{ marginLeft: "10px" }}>
          <p id="name">Welcome!!</p>
          <p id="date">
            {currentTime.toLocaleTimeString(undefined, timeOptions)}{" "}
            {currentTime.toLocaleDateString(undefined, dateOptions)}
          </p>
        </div>

        <div className="user-info" style={{alignItems: "flex-end"}}>
          <div>
          <Button color="inherit" onClick={openProfilePopup}>
              {profileImageURL ? (
                <img src={profileImageURL} alt="Profile" style={{ borderRadius: '50%', width: '60px', height: '60px', marginRight: '5px', marginTop:"-15px" }} />
              ) : (
                <AccountCircleIcon style={{ color: 'skyblue', fontSize: '45px', marginRight: '5px' }} />
              )}
              <Typography variant="h6" style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {name}
              </Typography>
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
              {/* Pass profileImageURL as a prop to UserProfile */}
              <UserProfile setProfileImageURL={setProfileImageURL} />
            </Popover>
          </div>
        </div>
      </div>

      <div className="wrap" style={{width: "fit-content"}}>
        <div className="dashboard-container">
        <div className="back">
  <p>
    <Link to="/requests" style={{ color: "black", textDecoration: "none", fontSize: "16px", fontWeight: "bold" }}>
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


<div className="right-corner" >
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

      fontSize:"14px"
    
    

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
            fontSize: "14px"
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
    <div style={{marginLeft:"10px",marginTop:"-20px",}}><span style={{fontSize: '12px', color: '#555'}}>
            Accepted formats: {acceptedFileFormats.join(', ')}
          </span> </div>
    <Button onClick={handleModalSubmit} variant="contained" style={{ backgroundColor: "#2ecc71", color: "#fff" }}>
      Submit
    </Button>
  </Box>
</Modal>
        <div className="table-div">
          <table className="dashboard-table" style={{width: "100%"}}>
          <thead>
  <tr>
    <th>Cloud</th>
    <th>Exam</th>
    <th>Voucher Code</th>
    <th>Issue Date</th>
    <th>Expiry Date</th>
    <th>Issued To</th>
    {/* Conditionally render the Actions header based on the selected filter */}
    {/* {searchOption !== 'Available' ? <th>Actions</th> : null} */}
    <th>Actions</th>
  </tr>
</thead>


<tbody>
{vouchers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
    <tr key={index}>
      <td>{row.cloudPlatform}</td>
      <td>{row.examName}</td>
      <td>{row.voucherCode}</td>
      <td>{row.issuedDate}</td>
      <td>{row.expiryDate}</td>
      <td>{row.issuedTo}</td>
      {/* Conditionally render the Actions column based on the selected filter */}
      
        <td>
        {(searchOption === 'Available') ? (
  <button
    style={{
      backgroundColor: "grey",
      fontSize: "12px",
      height: "35px",
      color: "white",
      borderRadius: "5px",
      cursor: "not-allowed", // Change cursor to not-allowed when button is disabled
      border: "none",
    }}
    disabled // Disable the button for available vouchers
  >
    Assign
  </button>
) : (
  (searchOption === 'default') ? (
    <button
      style={{
        backgroundColor: "#e3c449",
        fontSize: "12px",
        height: "35px",
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
        height: "35px",
        color: "white",
        borderRadius: "5px",
        cursor: "pointer",
        border: "none",
      }}
      onClick={() => handleActionButtonClick(row.id, true)}
    >
      Delete
    </button>
  )
)}
   </td>
      </tr>
    ))}
</tbody>
          </table>

  {vouchers.length === 0 && (
     <div style={{display:"flex", marginLeft: "350px", marginTop: "50px"} }> <p style={{ backgroundColor: "yellow", fontStyle: "initial"}}> Check for all other voucher categories in filter</p> </div> 
  )}
  {vouchers.length !==0 && (   <TablePagination style={{ width: "70%", marginLeft: "2%" }}
                                rowsPerPageOptions={[5,10,20,25, { label: 'All', value: vouchers.length }]}
                                component="div"
                                count={vouchers.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Rows per page"
                            />
  )}
        </div>
      </div>
    


      <div className="footer-div" style={{"height": "35px", "marginTop": "15px", width: "100%"}}>
        <footer> 
        <p>&copy; {currentTime.getFullYear()} Capgemini. All rights reserved.</p>

         
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
            <p><Link to='/requests' style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faList} size="1x" /> Requests</Link></p>
          </div>

          <div className="left-row">
            <p><Link to={'/vouchers'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faClipboardCheck} size="1x" /> Vouchers</Link></p>
          </div>

          <div className="left-row">
            <p><Link to={'/candidates'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faUsers} size="1x" /> Eligibility</Link></p>
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