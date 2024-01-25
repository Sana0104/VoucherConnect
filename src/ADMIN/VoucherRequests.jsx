import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import axios from "axios";
import Avatar from '@mui/material/Avatar';
import { ToastContainer ,toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import UserProfile from "../CANDIDATE/UserProfile";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faBell,
  faArrowLeft,
  faClipboardCheck,
  faUser,
  faTachometerAlt,
  faCog
} from "@fortawesome/free-solid-svg-icons";
import { TablePagination } from "@mui/material";
 
function VoucherRequests() {
  const obj = localStorage.getItem("userInfo");
  const { name, username } = JSON.parse(obj);
  const [requests, setRequests] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showReminderButton, setShowReminderButton] = useState(false);

  const [profileImageURL, setProfileImageURL] = useState(null);
 

  const openProfilePopup = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const closeProfilePopup = () => {
    setAnchorEl(null);
  };
 
  const isProfilePopupOpen = Boolean(anchorEl);
  const navigate = useNavigate();
 
  const [searchOption, setSearchOption] = useState("default");
  const [searchValue, setSearchValue] = useState("");
 
  const [requestsOption, setRequestsOption] = useState("default");
 
  useEffect(() => {
    axios.get(`http://localhost:8085/requests/getAllVouchers`)
      .then(response => {
        setRequests(response.data);
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
 
  const handleRequests = async (event) => {
    const selectedOption = event.target.value;
    setRequestsOption(selectedOption);
 
    if (selectedOption === 'Assigned') {
      try {
        const response = await axios.get('http://localhost:8085/requests/allAssignedVoucher');
        setRequests(response.data);
        setShowReminderButton(false);
      } catch (error) {
        console.error(error);
      }
    } else if (selectedOption === 'Pending') {
      try {
        const response = await axios.get('http://localhost:8085/requests/allUnAssignedVoucher');
        setRequests(response.data);
        setShowReminderButton(false);
      } catch (error) {
        console.error(error);
      }
    } else if (selectedOption === 'default') {
      try {
        const response = await axios.get('http://localhost:8085/requests/getAllVouchers');
        setRequests(response.data);
        setShowReminderButton(false);
      } catch (error) {
        console.error(error);
      }
    } else if (selectedOption === 'Completed') {
      try {
        const response = await axios.get('http://localhost:8085/requests/getAllCompletedVoucherRequests');
        setRequests(response.data);
        setShowReminderButton(false);
      } catch (error) {
        console.error(error);
      }
      
    }else if (selectedOption === 'NotUpdated') {
      try {
       
        const response = await axios.get('http://localhost:8085/requests/pendingResultRequests');
        setRequests(response.data);
        setShowReminderButton(response.data.length > 0);
      } catch (error) {
        console.error(error);
        setShowReminderButton(false);
      }
    } else {
      // For any other option, hide the button
      setShowReminderButton(false);
    }
  };
 
  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };
 
  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };
 
  const filters = (request) => {
    if (!request) {
      return false; // or true, depending on your logic for handling null requests.....
    }
    if (searchOption === 'default') {
      return true;
    } else if (searchOption === 'candidateName') {
      return request.candidateName && request.candidateName.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchOption === 'plannedExamDate') {
      return request.plannedExamDate && request.plannedExamDate.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchOption === 'cloudPlatform') {
      return request.cloudPlatform && request.cloudPlatform.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchOption === 'cloudExam') {
      return request.cloudExam && request.cloudExam.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchOption === 'examResult') {
      return request.examResult && request.examResult.toLowerCase().includes(searchValue.toLowerCase());
    }
  };
 
  const handleSendReminderEmail = async () => {
    try {
      const response = await axios.get(`http://localhost:8085/requests/sendPendingEmails`);
      console.log(response.data);
      setShowReminderButton(false);
      setRequestsOption("default");
  
      // Show success toasty message
      toast.success('Mail sent successfully!!!');
      
      // Reload the current page
      window.location.reload();
    } catch (error) {
      console.error(error.response.data);
  
      // Show error toasty message
      toast.error('Failed to send email. Please try again.');
    }
  };
  
  

  const handleAssigneVoucherClick = (email, examName, id) => {
    navigate(`/voucher-dashboard/${email}/${examName}/${id}`);
  };
 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
      setPage(newPage);
  };
 
  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
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
  return (
    <div className="headd">
 
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
              {profileImageURL ? (
                <img src={profileImageURL} alt="Profile" style={{ borderRadius: '50%', width: '60px', height: '60px', marginRight: '5px' }} />
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
 
      <div className="wrap">
 
        <div className="dashboard-container">
 
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
              <option value="default">Search</option>
              <option value="candidateName">Search Candidate</option>
              <option value="plannedExamDate">Search Exam Date</option>
              <option value="cloudPlatform">Search By Cloud</option>
              <option value="cloudExam">Search By Exam name</option>
              <option value="examResult">Search By Exam Result</option>
            </select>
            {(searchOption === 'candidateName' || searchOption === 'plannedExamDate' || searchOption === 'cloudPlatform' || searchOption === 'cloudExam'|| searchOption === 'examResult') && (
              <input
                type="text"
                value={searchValue}
                placeholder="Search..."
                onChange={handleSearchInputChange}
                style={{
                  marginLeft: "10px",
                  padding: "8px",
                  borderRadius: "5px",
                  border: "1px solid #3498db",
                }}
              />
            )}
          </div>
 
          <div className="dashboard-dropdown">
  <select
    className="search-text"
    value={requestsOption}
    onChange={handleRequests}
    style={{
      fontSize: "14px",
      height: "40px",
      borderRadius: "5px",
      paddingLeft: "10px",
      border: "1px solid #3498db",
      color: "black",
      background: "#ecf0f1", // Light gray background
      outline: "none",
    }}
  >
    <option value="default" >
      All Requests
    </option>
    <option value="Assigned" >
      Assigned Requests
    </option>
    <option value="Pending" >
      Pending Requests
    </option>
    <option value="Completed" >
      Completed Exam
    </option>
    <option value="NotUpdated" >
      Not Updated Result
    </option>
  </select>
  {showReminderButton && (
          <button
            onClick={() => handleSendReminderEmail()}
            style={{
              marginLeft: "10px",
              fontSize: "13px",
              padding: "2px",
              height: "40px",
              width: "140px",
              borderRadius: "5px",
              // backgroundColor: "#3498db",
              color: "#fff",
              cursor: "pointer",
              border: "none",
            }}
          >
            Send Reminder Mail
          </button>
        )}
</div>
 
          <div className="right-corner">
 
          </div>
 
        </div>
 
        <div className="table-div">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Cloud</th>
                <th>Exam</th>
                <th>DoSelect Score</th>
                <th>Voucher code</th>
                <th>Issued Date</th>
                <th>Expiry Date</th>
                <th>Exam Date</th>
                <th>Result</th>
                <th>Actions</th>
              </tr>
            </thead>
 
            <tbody>
              {requests.filter(filters).sort((a, b) => {
                if (a.voucherCode === null && b.voucherCode !== null) {
                  return -1; // Move rows with no voucher code to the top
                } else if (a.voucherCode !== null && b.voucherCode === null) {
                  return 1; // Move rows with voucher code to the bottom
                } else {
                  return 0; // Maintain the order for other rows
                }
              }).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <tr key={index}>
                  <td>{row.candidateName}</td>
                  <td>{row.candidateEmail}</td>
                  <td>{row.cloudPlatform}</td>
                  <td>{row.cloudExam}</td>
                  <td>{row.doSelectScore}</td>
                  <td>{row.voucherCode}</td>
                  <td>{row.voucherIssueLocalDate}</td>
                  <td>{row.voucherExpiryLocalDate}</td>
                  <td>{row.plannedExamDate}</td>
                  <td>{row.examResult}</td>
                  <td>
                    <button
                      className={row.voucherCode !== null ? 'disabled-button' : 'enabled-button'}
                      onClick={() => handleAssigneVoucherClick(row.candidateEmail, row.cloudExam, row.id)}
                      disabled={row.voucherCode !== null}
                      style={{
                        backgroundColor: row.voucherCode !== null ? "#95a5a6" : "#3498db", // Gray for disabled, Blue for enabled
                        fontSize: "14px",
                        height: "40px",
                        color: "#fff",
                        borderRadius: "5px",
                        cursor: "pointer",
                        border: "none",
                        marginLeft: "10px",
                      }}
                    >
                      Assign Voucher
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination style={{ width: "70%", marginLeft: "2%" }}
                                rowsPerPageOptions={[5,10, 20, 25, { label: 'All', value: requests.length }]}
                                component="div"
                                count={requests.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Rows per page"
                            />
        </div>
 
      </div>
 
      <div>
        <footer className="footer-div">
          <p>Capgemini 2023, All rights reserved.</p>
        </footer>
      </div>
 
      <div className="left-column">
        <h2 className="heading">Voucher Dashboard</h2>
 
        <hr />
 
        <div className="row">
 
          <div className="left-row">
            <p><Link to={'/dashboard'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faTachometerAlt} size="1x" />  Dashboard</Link></p>
          </div>
          <div className="left-row">
            <p><Link to={'/requests'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faTachometerAlt} size="1x" /> Requests</Link></p>
          </div>
 
          <div className="left-row">
            <p><Link to={'/vouchers'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faClipboardCheck} size="1x" />  Vouchers</Link></p>
          </div>
 
        </div>
 
      </div>
    </div>
  );
}
 
export default VoucherRequests;