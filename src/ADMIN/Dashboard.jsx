// Dashboard.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import axios from "axios";

import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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

function Dashboard() {
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
      } catch (error) {
        console.error(error);
      }
    } else if (selectedOption === 'Pending') {
      try {
        const response = await axios.get('http://localhost:8085/requests/allUnAssignedVoucher');
        setRequests(response.data);
      } catch (error) {
        console.error(error);
      }
    } else if (selectedOption === 'default') {
      try {
        const response = await axios.get('http://localhost:8085/requests/getAllVouchers');
        setRequests(response.data);
      } catch (error) {
        console.error(error);
      }
    } else if (selectedOption === 'Completed') {
      try {
        const response = await axios.get('http://localhost:8085/requests/getAllCompletedVoucherRequests');
        setRequests(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSearchOptionChange = (event) => {
    setSearchOption(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filters = (request) => {
    if (searchOption === 'default') {
      return true;
    } else if (searchOption === 'candidateName') {
      return request.candidateName.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchOption === 'plannedExamDate') {
      return request.plannedExamDate.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchOption === 'cloudPlatform') {
      return request.cloudPlatform.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchOption === 'cloudExam') {
      return request.cloudExam.toLowerCase().includes(searchValue.toLowerCase());
    }
    else if (searchOption === 'examResult') {
      return request.examResult.toLowerCase().includes(searchValue.toLowerCase());
    }
  };

  const handleAssigneVoucherClick = (email, examName, id) => {
    navigate(`/voucher-dashboard/${email}/${examName}/${id}`);
  };

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
  </select>
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
              {requests.filter(filters).map((row, index) => (
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
            <p><Link to={'/vouchers'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faClipboardCheck} size="1x" />  Vouchers</Link></p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Dashboard;