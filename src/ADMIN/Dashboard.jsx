// import React, { useState, useEffect } from 'react';
// import { Link, useParams, useNavigate } from "react-router-dom";
// import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import './Graph.css';
// import Button from '@mui/material/Button';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import Typography from '@mui/material/Typography';
// import Popover from '@mui/material/Popover';
// import UserProfile from "../CANDIDATE/UserProfile";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import axios from "axios";
// import {
//   faClipboardCheck,
//   faTachometerAlt,
//   faUsers,
//   faList
// } from "@fortawesome/free-solid-svg-icons";

// function Dashboard() {
//   const navigate = useNavigate();
//   const [chartData, setChartData] = useState([]);
//   const [awsVouchers, setAwsVouchers] = useState({ total: 0, used: 0, available: 0 });
//   const [gcpVouchers, setGcpVouchers] = useState({ total: 0, used: 0, available: 0 });
//   const [azureVouchers, setAzureVouchers] = useState({ total: 0, used: 0, available: 0 });
//   const obj = localStorage.getItem("userInfo");
//   const { name, username } = JSON.parse(obj);
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [profileImageURL, setProfileImageURL] = useState(null);
//   const openProfilePopup = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const closeProfilePopup = () => {
//     setAnchorEl(null);
//   };
//   const isProfilePopupOpen = Boolean(anchorEl);
//   const [currentTime, setCurrentTime] = useState(new Date());
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);
//     return () => {
//       clearInterval(timer);
//     };
//   }, []);
//   const dateOptions = { day: "numeric", month: "long", year: "numeric" };
//   const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
//   useEffect(() => {
//     const fetchProfileImageURL = async () => {
//       try {
//         const response = await axios.get(`http://localhost:9092/user/getProfileImageURL/${username}`, {
//           responseType: 'arraybuffer',
//         });
//         const blob = new Blob([response.data], { type: 'image/jpeg' });
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           setProfileImageURL(reader.result);
//         };
//         reader.readAsDataURL(blob);
//       } catch (error) {
//         console.error('Error fetching image URL:', error.message);
//       }
//     };
//     fetchProfileImageURL();
//   }, [username]);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch voucher data
//         const response = await fetch('http://localhost:9091/voucher/fetchAllVouchers');
//         const vouchersData = await response.json();
//         // Count vouchers for each cloud platform
//         const awsCount = vouchersData.filter(voucher => voucher.cloudPlatform === 'AWS').length;
//         const gcpCount = vouchersData.filter(voucher => voucher.cloudPlatform === 'Google').length;
//         const azureCount = vouchersData.filter(voucher => voucher.cloudPlatform === 'Azure').length;
//         // Count used vouchers for each cloud platform
//         const usedAWSCount = vouchersData.filter(voucher => voucher.issuedTo !== null && voucher.cloudPlatform === 'AWS').length;
//         const usedGCPCount = vouchersData.filter(voucher => voucher.issuedTo !== null && voucher.cloudPlatform === 'Google').length;
//         const usedAzureCount = vouchersData.filter(voucher => voucher.issuedTo !== null && voucher.cloudPlatform === 'Azure').length;
//         // Calculate available vouchers count for each cloud platform
//         const availableAWSCount = awsCount - usedAWSCount;
//         const availableGCPCount = gcpCount - usedGCPCount;
//         const availableAzureCount = azureCount - usedAzureCount;
//         // Update state with voucher counts
//         setAwsVouchers({
//           total: awsCount,
//           used: usedAWSCount,
//           available: availableAWSCount
//         });
//         setGcpVouchers({
//           total: gcpCount,
//           used: usedGCPCount,
//           available: availableGCPCount
//         });
//         setAzureVouchers({
//           total: azureCount,
//           used: usedAzureCount,
//           available: availableAzureCount
//         });
//         // Fetch Passed, failed voucher data and update chart data
//         const assignedResponse = await fetch('http://localhost:8085/requests/allAssignedVoucher');
//         const assignedResponseData = await assignedResponse.json();
//         const awsPassedCount = assignedResponseData.filter(request => request.examResult === 'Pass' && request.cloudPlatform === 'AWS').length;
//         const awsFailedCount = assignedResponseData.filter(request => request.examResult === 'Fail' && request.cloudPlatform === 'AWS').length;
//         const awsPendingCount = assignedResponseData.filter(request => request.examResult === 'Pending' && request.cloudPlatform === 'AWS').length;
//         const gcpPassedCount = assignedResponseData.filter(request => request.examResult === 'Pass' && request.cloudPlatform === 'Google').length;
//         const gcpFailedCount = assignedResponseData.filter(request => request.examResult === 'Fail' && request.cloudPlatform === 'Google').length;
//         const gcpPendingCount = assignedResponseData.filter(request => request.examResult === 'Pending' && request.cloudPlatform === 'Google').length;
//         const azurePassedCount = assignedResponseData.filter(request => request.examResult === 'Pass' && request.cloudPlatform === 'Azure').length;
//         const azureFailedCount = assignedResponseData.filter(request => request.examResult === 'Fail' && request.cloudPlatform === 'Azure').length;
//         const azurePendingCount = assignedResponseData.filter(request => request.examResult === 'Pending' && request.cloudPlatform === 'Azure').length;
//         // Combine data for chart
//         const combinedChartData = combineData(awsPassedCount, awsFailedCount, awsPendingCount, gcpPassedCount, gcpFailedCount, gcpPendingCount, azurePassedCount, azureFailedCount, azurePendingCount);
//         setChartData(combinedChartData);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//     fetchData();
//   }, []);
//   const combineData = (
//     awsPassed, awsFailed, awsPending,
//     gcpPassed, gcpFailed, gcpPending,
//     azurePassed, azureFailed, azurePending
//   ) => {
//     return [
//       { name: 'AWS', passed: awsPassed, failed: awsFailed, pending: awsPending },
//       { name: 'GCP', passed: gcpPassed, failed: gcpFailed, pending: gcpPending },
//       { name: 'Azure', passed: azurePassed, failed: azureFailed, pending: azurePending },
//     ];
//   };
//   const handleBarClick = (entry) => {
//     navigate(`/${entry.name}`);
//   };
//   return (
//     <div className='headd'>
//       <div className='main-div'>
//         <div  className="navbar1" style={{ backgroundColor: "rgb(112, 183, 184)"}}>
//           <div className="user-info1" style={{ marginLeft: "10px" }}>
//             <p id="name1">Welcome!!</p>
//             <p id="date1">
//               {currentTime.toLocaleTimeString(undefined, timeOptions)}{" "}
//               {currentTime.toLocaleDateString(undefined, dateOptions)}
//             </p>
//           </div>
//           <div className="user-info1" style={{ marginLeft: "600px" }}>
//             <div>
//               <Button color="inherit" onClick={openProfilePopup}>
//                 {profileImageURL ? (
//                   <img src={profileImageURL} alt="Profile" style={{ borderRadius: '50%', width: '60px', height: '60px', marginRight: '5px', marginTop:"-15px" }} />
//                 ) : (
//                   <AccountCircleIcon style={{ color: 'skyblue', fontSize: '45px', marginRight: '5px' }} />
//                 )}
//                 <Typography variant="h6" style={{ fontSize: '18px', fontWeight: 'bold' }}>
//                   {name}
//                 </Typography>
//               </Button>
//               <Popover
//                 open={isProfilePopupOpen}
//                 anchorEl={anchorEl}
//                 onClose={closeProfilePopup}
//                 anchorOrigin={{
//                   vertical: 'bottom',
//                   horizontal: 'right',
//                 }}
//                 transformOrigin={{
//                   vertical: 'top',
//                   horizontal: 'right',
//                 }}
//               >
//                 {/* Pass profileImageURL as a prop to UserProfile */}
//                 <UserProfile setProfileImageURL={setProfileImageURL} />
//               </Popover>
//             </div>
//           </div>
//         </div>
//         <div className="wrap1" style={{width: "fit-content"}}>
//           <div className='graph-container'>
//           <div className='main-cards'>
//             <div className='card'>
//               <div className='card-inner'>
//                 <div className="voucher-header">
//                   <h3>AWS</h3>
//                 </div>
//                 <div className="voucher-info">
//                   <p>Total: {awsVouchers.total}</p>
//                   <p>Used: {awsVouchers.used}</p>
//                   <p>Available: {awsVouchers.available}</p>
//                 </div>
//               </div>
//             </div>
//             <div className='card'>
//               <div className='card-inner'>
//                 <div className="voucher-header">
//                   <h3>GCP</h3>
//                 </div>
//                 <div className="voucher-info">
//                   <p>Total: {gcpVouchers.total}</p>
//                   <p>Used: {gcpVouchers.used}</p>
//                   <p>Available: {gcpVouchers.available}</p>
//                 </div>
//               </div>
//             </div>
//             <div className='card'>
//               <div className='card-inner'>
//                 <div className="voucher-header">
//                   <h3>AZURE</h3>
//                 </div>
//                 <div className="voucher-info">
//                   <p>Total: {azureVouchers.total}</p>
//                   <p>Used: {azureVouchers.used}</p>
//                   <p>Available: {azureVouchers.available}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//             <div className='charts'>
//               <BarChart
//                 width={500}
//                 height={300}
//                 data={chartData}
//                 margin={{
//                   top: 5,
//                   right: 10,
//                   left: 20,
//                   bottom: 5,
//                 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="passed" fill="#50C878" onClick={(entry) => handleBarClick(entry)}/>
//                 <Bar dataKey="failed" fill="#FF6868" onClick={(entry) => handleBarClick(entry)} />
//                 <Bar dataKey="pending" fill="#FFBB64" onClick={(entry) => handleBarClick(entry)}/>
//               </BarChart>
//             </div>
//           </div>
//         </div>
//       </div> {/* main div closing */}
//       <div className="footer-div" style={{ "height": "35px", "marginTop": "15px"}}>
//         <footer>
//           <p>&copy; 2024 Capgemini. All rights reserved.</p>
//         </footer>
//       </div>
//       <div className="left-column1">
//         <h2 className="heading1">Voucher Dashboard</h2>
//         <hr />
//         <div className="row1">
//           <div className="left-row1">
//             <p><Link to='/dashboard' style={{ "color": "white" }}>
//               <FontAwesomeIcon icon={faTachometerAlt} size="1x" /> Dashboard</Link></p>
//           </div>
//           <div className="left-row1">
//             <p><Link to='/requests' style={{ "color": "white" }}>
//               <FontAwesomeIcon icon={faList} size="1x" /> Requests</Link></p>
//           </div>
//           <div className="left-row1">
//             <p><Link to={'/vouchers'} style={{ "color": "white" }}>
//               <FontAwesomeIcon icon={faClipboardCheck} size="1x" /> Vouchers</Link></p>
//           </div>
//           <div className="left-row1">
//             <p><Link to={'/candidates'} style={{ "color": "white" }}>
//               <FontAwesomeIcon icon={faUsers} size="1x" /> Eligibility</Link></p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;





import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Graph.css';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import UserProfile from "../CANDIDATE/UserProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faClipboardCheck,
  faTachometerAlt,
  faUsers,
  faList
} from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [awsVouchers, setAwsVouchers] = useState({ total: 0, used: 0, available: 0 });
  const [gcpVouchers, setGcpVouchers] = useState({ total: 0, used: 0, available: 0 });
  const [azureVouchers, setAzureVouchers] = useState({ total: 0, used: 0, available: 0 });
  const obj = localStorage.getItem("userInfo");
  const { name, username } = JSON.parse(obj);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Added state for selected year

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => {
      clearInterval(timer);
    };
  }, []);

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
    const fetchData = async (year) => {
      console.log("Fetching data for year:", year);
      try {
        // Fetch voucher data
        const response = await fetch('http://localhost:9091/voucher/fetchAllVouchers');
        const vouchersData = await response.json();

        // Filter vouchers data for the selected year
        const vouchersDataForYear = vouchersData.filter(voucher => {
          const issuedDate = new Date(voucher.issuedDate);
          return issuedDate.getFullYear() === year;
        });
        // Count vouchers for each cloud platform
        const awsCount = vouchersDataForYear.filter(voucher => voucher.cloudPlatform === 'AWS').length;
        const gcpCount = vouchersDataForYear.filter(voucher => voucher.cloudPlatform === 'Google').length;
        const azureCount = vouchersDataForYear.filter(voucher => voucher.cloudPlatform === 'Azure').length;

        // Count used vouchers for each cloud platform
        const usedAWSCount = vouchersDataForYear.filter(voucher => voucher.issuedTo !== null && voucher.cloudPlatform === 'AWS').length;
        const usedGCPCount = vouchersDataForYear.filter(voucher => voucher.issuedTo !== null && voucher.cloudPlatform === 'Google').length;
        const usedAzureCount = vouchersDataForYear.filter(voucher => voucher.issuedTo !== null && voucher.cloudPlatform === 'Azure').length;

        // Calculate available vouchers count for each cloud platform
        const availableAWSCount = awsCount - usedAWSCount;
        const availableGCPCount = gcpCount - usedGCPCount;
        const availableAzureCount = azureCount - usedAzureCount;

        // Update state with voucher counts
        setAwsVouchers({
          total: awsCount,
          used: usedAWSCount,
          available: availableAWSCount
        });
        setGcpVouchers({
          total: gcpCount,
          used: usedGCPCount,
          available: availableGCPCount
        });
        setAzureVouchers({
          total: azureCount,
          used: usedAzureCount,
          available: availableAzureCount
        });

        // Fetch Passed, failed voucher data and update chart data
        const assignedResponse = await fetch('http://localhost:8085/requests/allAssignedVoucher');
        const assignedResponseData = await assignedResponse.json();

        // Filter assigned voucher data for the selected year
        const assignedResponseDataForYear = assignedResponseData.filter(request => new Date(request.voucherIssueLocalDate).getFullYear() === year);

        const awsPassedCount = assignedResponseDataForYear.filter(request => request.examResult === 'Pass' && request.cloudPlatform === 'AWS').length;
        const awsFailedCount = assignedResponseDataForYear.filter(request => request.examResult === 'Fail' && request.cloudPlatform === 'AWS').length;
        const awsPendingCount = assignedResponseDataForYear.filter(request => request.examResult === 'Pending' && request.cloudPlatform === 'AWS').length;
        const gcpPassedCount = assignedResponseDataForYear.filter(request => request.examResult === 'Pass' && request.cloudPlatform === 'Google').length;
        const gcpFailedCount = assignedResponseDataForYear.filter(request => request.examResult === 'Fail' && request.cloudPlatform === 'Google').length;
        const gcpPendingCount = assignedResponseDataForYear.filter(request => request.examResult === 'Pending' && request.cloudPlatform === 'Google').length;
        const azurePassedCount = assignedResponseDataForYear.filter(request => request.examResult === 'Pass' && request.cloudPlatform === 'Azure').length;
        const azureFailedCount = assignedResponseDataForYear.filter(request => request.examResult === 'Fail' && request.cloudPlatform === 'Azure').length;
        const azurePendingCount = assignedResponseDataForYear.filter(request => request.examResult === 'Pending' && request.cloudPlatform === 'Azure').length;

        // Combine data for chart
        const combinedChartData = combineData(awsPassedCount, awsFailedCount, awsPendingCount, gcpPassedCount, gcpFailedCount, gcpPendingCount, azurePassedCount, azureFailedCount, azurePendingCount);
        setChartData(combinedChartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(selectedYear);
  }, [selectedYear]);

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

  const openProfilePopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeProfilePopup = () => {
    setAnchorEl(null);
  };

  const isProfilePopupOpen = Boolean(anchorEl);

  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };

  // Function to handle year selection change
  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
    console.log("Selected Year:", event.target.value); // Check the selected year in the console
  };


  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 2; i <= currentYear; i++) {
    years.push(i);
  }


  return (
    <div className='headd'>
      <div className='main-div'>
        <div className="navbar1" style={{ backgroundColor: "rgb(112, 183, 184)" }}>
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
                  <img src={profileImageURL} alt="Profile" style={{ borderRadius: '50%', width: '60px', height: '60px', marginRight: '5px', marginTop: "-15px" }} />
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
        <div className="wrap1" style={{ width: "fit-content" }}>
          <div className='graph-container'>
            <div className='main-cards'>
              <div className='card'>
                <div className='card-inner'>
                  <div className="voucher-header">
                    <h3>AWS</h3>
                  </div>
                  <div className="voucher-info">
                    <p>Total: {awsVouchers.total}</p>
                    <p>Used: {awsVouchers.used}</p>
                    <p>Available: {awsVouchers.available}</p>
                  </div>
                </div>
              </div>
              <div className='card'>
                <div className='card-inner'>
                  <div className="voucher-header">
                    <h3>GCP</h3>
                  </div>
                  <div className="voucher-info">
                    <p>Total: {gcpVouchers.total}</p>
                    <p>Used: {gcpVouchers.used}</p>
                    <p>Available: {gcpVouchers.available}</p>
                  </div>
                </div>
              </div>
              <div className='card'>
                <div className='card-inner'>
                  <div className="voucher-header">
                    <h3>AZURE</h3>
                  </div>
                  <div className="voucher-info">
                    <p>Total: {azureVouchers.total}</p>
                    <p>Used: {azureVouchers.used}</p>
                    <p>Available: {azureVouchers.available}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='charts'>
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
                <Bar dataKey="passed" fill="#50C878" onClick={(entry) => handleBarClick(entry)} />
                <Bar dataKey="failed" fill="#FF6868" onClick={(entry) => handleBarClick(entry)} />
                <Bar dataKey="pending" fill="#FFBB64" onClick={(entry) => handleBarClick(entry)} />
              </BarChart>
              {/* Add dropdown list for selecting years */}
              <div className="year-dropdown">
                <label htmlFor="year-select">Select Year:</label>
                <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div> {/* main div closing */}
      <div className="footer-div" style={{ "height": "35px", "marginTop": "15px" }}>
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
              <FontAwesomeIcon icon={faList} size="1x" /> Requests</Link></p>
          </div>
          <div className="left-row1">
            <p><Link to={'/vouchers'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faClipboardCheck} size="1x" /> Vouchers</Link></p>
          </div>
          <div className="left-row1">
            <p><Link to={'/candidates'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faUsers} size="1x" /> Eligibility</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
