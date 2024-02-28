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
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './Graph.css';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import UserProfile from "../CANDIDATE/UserProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import examData from '../CANDIDATE/examdata.json';
import {
  faClipboardCheck,
  faTachometerAlt,
  faUsers,
  faList
} from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [awsVouchers, setAwsVouchers] = useState({ total: 0, released: 0, available: 0 });
  const [gcpVouchers, setGcpVouchers] = useState({ total: 0, released: 0, available: 0 });
  const [azureVouchers, setAzureVouchers] = useState({ total: 0, released: 0, available: 0 });
  const [totalVouchers, setTotalVouchers] = useState({}); // State for total vouchers
  const [cloudPlatform, setCloudPlatform] = useState('AWS'); // State for selected cloud platform
  const [examName, setExamName] = useState(''); // State for selected exam name
  const [examOptions, setExamOptions] = useState([]);
  const obj = localStorage.getItem("userInfo");
  const { name, username } = JSON.parse(obj);
  const [anchorEl, setAnchorEl] = useState(null);
  const [profileImageURL, setProfileImageURL] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

        // Calculate total vouchers count for each cloud platform
        const awsTotal = vouchersData.filter(voucher => voucher.cloudPlatform === 'AWS').length;
        const gcpTotal = vouchersData.filter(voucher => voucher.cloudPlatform === 'Google').length;
        const azureTotal = vouchersData.filter(voucher => voucher.cloudPlatform === 'Azure').length;

        // Update state with total voucher counts
        setTotalVouchers({
          AWS: awsTotal,
          Google: gcpTotal,
          Azure: azureTotal
        });

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

        // Filter expired vouchers and delete them from available count
        const currentDate = new Date();
        const expiredAWSCount = vouchersDataForYear.filter(voucher => voucher.cloudPlatform === 'AWS' && new Date(voucher.expiryDate) < currentDate).length;
        const expiredGCPCount = vouchersDataForYear.filter(voucher => voucher.cloudPlatform === 'Google' && new Date(voucher.expiryDate) < currentDate).length;
        const expiredAzureCount = vouchersDataForYear.filter(voucher => voucher.cloudPlatform === 'Azure' && new Date(voucher.expiryDate) < currentDate).length;

        // Calculate available vouchers count for each cloud platform
        const availableAWSCount = awsCount - usedAWSCount - expiredAWSCount;
        const availableGCPCount = gcpCount - usedGCPCount - expiredGCPCount;
        const availableAzureCount = azureCount - usedAzureCount - expiredAzureCount;

        // Update state with voucher counts
        setAwsVouchers({
          total: awsCount,
          released: usedAWSCount,
          available: availableAWSCount
        });
        setGcpVouchers({
          total: gcpCount,
          released: usedGCPCount,
          available: availableGCPCount
        });
        setAzureVouchers({
          total: azureCount,
          released: usedAzureCount,
          available: availableAzureCount
        });

        // Fetch Passed, failed voucher data and update chart data
        const assignedResponse = await fetch('http://localhost:8085/requests/allAssignedVoucher');
        const assignedResponseData = await assignedResponse.json();

        let resignedResponseData = [];
        try {
          const resignedResponse = await fetch('http://localhost:8085/requests/getResignedCandidates');
          resignedResponseData = await resignedResponse.json();
        } catch (error) {
          console.error('Error fetching resigned candidates:', error);
        }

        let otherBUResponseData = [];
        try {
          const otherBUResponse = await fetch('http://localhost:8085/requests/getBuChangedCandidates');
          otherBUResponseData = await otherBUResponse.json();
        } catch (error) {
          console.error('Error fetching other BU candidates:', error);
        }

        // Filter assigned voucher data for the selected year and cloud platform
        let assignedResponseDataForYear = assignedResponseData.filter(request => new Date(request.voucherIssueLocalDate).getFullYear() === year && request.cloudPlatform === cloudPlatform);
        let resignedResponseDataForYear = Array.isArray(resignedResponseData) ? resignedResponseData.filter(request => new Date(request.voucherIssueLocalDate).getFullYear() === year && request.cloudPlatform === cloudPlatform) : [];
        let otherBUResponseDataForYear = Array.isArray(otherBUResponseData) ? otherBUResponseData.filter(request => new Date(request.voucherIssueLocalDate).getFullYear() === year && request.cloudPlatform === cloudPlatform) : [];
        console.log(assignedResponseDataForYear)

        // If an exam name is selected, filter data for that exam
        if (examName !== '') {
          assignedResponseDataForYear = assignedResponseDataForYear.filter(request => request.cloudExam === examName);
          resignedResponseDataForYear = resignedResponseDataForYear.filter(request => request.cloudExam === examName);
          otherBUResponseDataForYear = otherBUResponseDataForYear.filter(request => request.cloudExam === examName);
        }

        const passedCount = assignedResponseDataForYear.filter(request => request.examResult === 'Pass').length;
        const failedCount = assignedResponseDataForYear.filter(request => request.examResult === 'Fail').length;
        const pendingCount = assignedResponseDataForYear.filter(request => request.examResult === 'Pending').length;
        const technicalIssueCount = assignedResponseDataForYear.filter(request => request.examResult === 'Pending due to issue').length;
        const resignedCount = resignedResponseDataForYear.length;
        const otherBUCount = otherBUResponseDataForYear.length;


        // Before setting the chart data, ensure it's an array with at least one element
        let chartDataArray = [];

        if (passedCount > 0 || failedCount > 0 || pendingCount > 0 || technicalIssueCount > 0 || resignedCount > 0 || otherBUCount > 0) {
          chartDataArray = [
            { name: 'Passed', passed: passedCount },
            { name: 'Failed', failed: failedCount },
            { name: 'Not Completed', pending: pendingCount },
            { name: 'Technical Issue', technicalIssue: technicalIssueCount },
            { name: 'Resigned', resigned: resignedCount },
            { name: 'Other BU', otherBU: otherBUCount }
          ];
        } else {
          // If there's no data, you can set a default data point
          chartDataArray = [{ name: 'No data', value: 0 }];
        }

        // Update chart data
        setChartData(chartDataArray);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    console.log(examName)
    fetchData(selectedYear);
  }, [selectedYear, cloudPlatform, examName]);

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

  const handleYearChange = (event) => {
    setSelectedYear(parseInt(event.target.value));
    console.log("Selected Year:", event.target.value);
  };

  useEffect(() => {
    const selectedCloud = examData.cloudPlatforms.find(
      (cloud) => cloud.name === cloudPlatform
    );
    if (selectedCloud) {
      setExamOptions(selectedCloud.exams);
      // Also, update the examName state if the selected exam is not available for the new cloud platform
      if (!selectedCloud.exams.includes(examName)) {
        setExamName(''); // Reset examName to None if it's not available for the new cloud platform
      }
    }
  }, [cloudPlatform]);

  const handleCloudPlatformChange = (event) => {
    const selectedPlatform = event.target.value;
    setCloudPlatform(selectedPlatform);
  };

  const handleExamNameChange = (event) => {
    const selectedExam = event.target.value;
    setExamName(selectedExam === 'None' ? '' : selectedExam);
  };


  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 2; i <= currentYear; i++) {
    years.push(i);
  }


  return (
    <div className='headd'>
      <div className='main-div'>
        <div className="navbar1" style={{ backgroundColor: "rgb(112, 183, 184)", width: "auto" }}>
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
                <UserProfile setProfileImageURL={setProfileImageURL} />
              </Popover>
            </div>
          </div>
        </div>
        <div className="wrap1" style={{ width: "fit-content" }}>
          <div className='graph-container'>
            <div className='vouchers-div'>
              <div className='heading-class' style={{ marginTop: "-20px" }}>
                <h4>Vouchers Report:</h4>
              </div>

              <div className='main-cards'>
                <div className='card'>
                  <div className='card-inner'>
                    <div className="voucher-header">
                      <h3>AWS</h3>
                    </div>
                    <div className="voucher-info">
                      <p>Total: {awsVouchers.total}</p>
                      <p>Released: {awsVouchers.released}</p>
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
                      <p>Released: {gcpVouchers.released}</p>
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
                      <p>Released: {azureVouchers.released}</p>
                      <p>Available: {azureVouchers.available}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='charts'>
              <BarChart
                width={800}
                height={300}
                data={chartData}
                margin={{
                  top: 5,
                  right: 20,
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
                <Bar dataKey="technicalIssue" fill="#437387" onClick={(entry) => handleBarClick(entry)} />
                <Bar dataKey="resigned" fill="#a75265" onClick={(entry) => handleBarClick(entry)} />
                <Bar dataKey="otherBU" fill="#d2b48c" onClick={(entry) => handleBarClick(entry)} />
              </BarChart>
              <div className="dropdown-container">
                <div className='heading-class' style={{ backgroundColor: "rgb(37, 70, 179)", marginBottom: "20px", width: "300px" }}>
                  <h4>Certifications Status Report</h4>
                </div>
                <div className="select-wrapper">
                  <label htmlFor="year-select">Select Year:</label>
                  <select id="year-select" value={selectedYear} onChange={handleYearChange}>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="select-wrapper">
                  <label htmlFor="platform-select">Select Cloud:</label>
                  <select id="platform-select" value={cloudPlatform} onChange={handleCloudPlatformChange}>
                    {examData.cloudPlatforms.map((cloud) => (
                      <option key={cloud.name} value={cloud.name}>
                        {cloud.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="select-wrapper">
                  <label htmlFor="exam-select">Select Exam:</label>
                  <select id="exam-select" value={examName} onChange={handleExamNameChange}>
                    <option value="None">None</option>
                    {examOptions.map((exam) => (
                      <option key={exam} value={exam}>
                        {exam}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
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
