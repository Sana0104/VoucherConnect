import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Graph.css';
 
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import UserProfile from "../CANDIDATE/UserProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faClipboardCheck,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
 
 
function Dashboard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [awsVouchers, setAwsVouchers] = useState(0);
  const [gcpVouchers, setGcpVouchers] = useState(0);
  const [azureVouchers, setAzureVouchers] = useState(0);
 
  const obj = localStorage.getItem("userInfo");
  const { name, username } = JSON.parse(obj);
 
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(null);
 
 
  const openProfilePopup = (event) => {
    setAnchorEl(event.currentTarget);
  };
 
  const closeProfilePopup = () => {
    setAnchorEl(null);
  };
 
  const isProfilePopupOpen = Boolean(anchorEl);
 
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
 
  useEffect(() => {
    const fetchData = async () => {
      try {
       
        // Fetch voucher data
        const response = await fetch('http://localhost:9091/voucher/getAllVouchers');
        const vouchersData = await response.json();
 
        // Count vouchers for each cloud platform
        const awsCount = vouchersData.filter(voucher =>new Date(voucher.expiryDate) > new Date() && voucher.issuedTo === null && voucher.cloudPlatform === 'AWS').length;
        const gcpCount = vouchersData.filter(voucher => new Date(voucher.expiryDate) > new Date() && voucher.issuedTo === null &&  voucher.cloudPlatform === 'Google').length;
        const azureCount = vouchersData.filter(voucher => new Date(voucher.expiryDate) > new Date() && voucher.issuedTo === null &&  voucher.cloudPlatform === 'Azure').length;
   
        // Update state with voucher counts
        setAwsVouchers(awsCount);
        setGcpVouchers(gcpCount);
        setAzureVouchers(azureCount);
 
        // Fetch Passed, failed voucher data
       const assignedResponse = await fetch('http://localhost:8085/requests/allAssignedVoucher');
       const assignedResponseData = await assignedResponse.json();
 
       const awsPassedCount = assignedResponseData.filter(request => request.examResult === 'Pass' && request.cloudPlatform === 'AWS').length;
       const awsFailedCount = assignedResponseData.filter(request => request.examResult === 'Fail' && request.cloudPlatform === 'AWS').length;
       const awsPendingCount = assignedResponseData.filter(request => request.examResult === 'Pending' && request.cloudPlatform === 'AWS').length;
       
       const gcpPassedCount = assignedResponseData.filter(request => request.examResult === 'Pass' && request.cloudPlatform === 'Google').length;
       const gcpFailedCount = assignedResponseData.filter(request => request.examResult === 'Fail' && request.cloudPlatform === 'Google').length;
       const gcpPendingCount = assignedResponseData.filter(request => request.examResult === 'Pending' && request.cloudPlatform === 'Google').length;
       
       const azurePassedCount = assignedResponseData.filter(request => request.examResult === 'Pass' && request.cloudPlatform === 'Azure').length;
       const azureFailedCount = assignedResponseData.filter(request => request.examResult === 'Fail' && request.cloudPlatform === 'Azure').length;
       const azurePendingCount = assignedResponseData.filter(request => request.examResult === 'Pending' && request.cloudPlatform === 'Azure').length;
       
 
 
        // Combine data for chart
       const combinedChartData = combineData(awsPassedCount, awsFailedCount, awsPendingCount, gcpPassedCount, gcpFailedCount, gcpPendingCount, azurePassedCount, azureFailedCount, azurePendingCount);
       setChartData(combinedChartData);
 
 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
 
    fetchData();
  }, []);
 
  const combineData = (
    awsPassed, awsFailed, awsPending,
    gcpPassed, gcpFailed, gcpPending,
    azurePassed, azureFailed, azurePending
  ) => {
    return [
      { name: 'AWS', passed: awsPassed, failed: awsFailed, pending: awsPending },
      { name: 'GCP', passed: gcpPassed, failed: gcpFailed, pending: gcpPending },
      { name: 'Azure', passed: azurePassed, failed: azureFailed, pending: azurePending },
    ];
  };
 
  const handleBarClick = (entry) => {
    navigate(`/${entry.name}`);
  };
 
  return (
    <div className='headd'>
      <div className='main-div'>
    <div  className="navbar1" style={{ backgroundColor: "rgb(112, 183, 184)"}}>
        <div className="user-info1" style={{ marginLeft: "10px" }}>
          <p id="name1">Welcome!!</p>
          <p id="date1">
            {currentTime.toLocaleTimeString(undefined, timeOptions)}{" "}
            {currentTime.toLocaleDateString(undefined, dateOptions)}
          </p>
        </div>
 
        <div className="user-info1" style={{ marginLeft: "600px" }}>
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
 
    <div className="wrap1" style={{width: "fit-content"}}>
    {/* <main className='main-container'> */}
    <div className='graph-container'>
      {/* <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div> */}
 
      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>AWS</h3>
          </div>
          <h1>{awsVouchers}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>GCP</h3>
          </div>
          <h1>{gcpVouchers}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>AZURE</h3>
          </div>
          <h1>{azureVouchers}</h1>
        </div>
      </div>
 
      <div className='charts'>
        {/* <ResponsiveContainer width="100%" height="100%" > */}
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="passed" fill="#50C878" onClick={(entry) => handleBarClick(entry)}/>
            <Bar dataKey="failed" fill="#FF6868" onClick={(entry) => handleBarClick(entry)} />
            <Bar dataKey="pending" fill="#FFBB64" onClick={(entry) => handleBarClick(entry)}/>
          </BarChart>
        {/* </ResponsiveContainer> */}
      </div>
 
      {/* </main> */}
 
      </div>
    </div>
 
    </div> {/* main div closing */}
 
    <div className="footer-div" style={{ "height": "35px", "marginTop": "15px"}}>
        <footer>
          <p>&copy; 2024 Capgemini. All rights reserved.</p>
        </footer>
      </div>
 
      <div className="left-column1">
        <h2 className="heading1">Voucher Dashboard</h2>
 
        <hr />
 
        <div className="row1">
          <div className="left-row1">
            <p><Link to='/dashboard' style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faTachometerAlt} size="1x" /> Dashboard</Link></p>
          </div>
          <div className="left-row1">
            <p><Link to='/requests' style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faTachometerAlt} size="1x" /> Requests</Link></p>
          </div>
 
          <div className="left-row1">
            <p><Link to={'/vouchers'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faClipboardCheck} size="1x" /> Vouchers</Link></p>
          </div>
        </div>
      </div>
   
 
    </div>
  );
}
 
export default Dashboard;