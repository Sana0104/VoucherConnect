import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./Dashboard.css";
import axios from "axios";
import Avatar from '@mui/material/Avatar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-toastify/dist/ReactToastify.css';
import Button from '@mui/material/Button';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import UserProfile from "../CANDIDATE/UserProfile";
import Modal from 'react-modal';
import Draggable from 'react-draggable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Import the download icon
import { faDownload, faExpand } from '@fortawesome/free-solid-svg-icons';

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
import { TablePagination } from "@mui/material";
import { orange } from "@mui/material/colors";
Modal.setAppElement("#root");
function VoucherRequests() {
  const obj = localStorage.getItem("userInfo");
  const { name, username } = JSON.parse(obj);
  const [requests, setRequests] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showReminderButton, setShowReminderButton] = useState(false);
  const [selectedDenialReason, setSelectedDenialReason] = useState("");
  const [profileImageURL, setProfileImageURL] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [staffingAvailabilityData, setStaffingAvailabilityData] = useState([]);


  const [searchDate, setSearchDate] = useState(null);
  const [searchMonth, setSearchMonth] = useState(null);
  const [searchYear, setSearchYear] = useState(null); 

  const openProfilePopup = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const closeProfilePopup = () => {
    setAnchorEl(null);
  };
  const handleDenialReasonChange = (event) => {
    setSelectedDenialReason(event.target.value);
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

       // Fetch staffing availability data
    axios.get(`http://localhost:8085/candidate/getAllCandidate`)
    .then(response => {
      setStaffingAvailabilityData(response.data);
    })
    .catch(error => {
      console.error('Error fetching staffing availability:', error);
    });
  }, []);

  // Once both voucher requests and staffing availability data are fetched, combine them
  const combinedData = requests.map(request => {
    const matchingStaffingAvailability = staffingAvailabilityData.find(item => item.email === request.candidateEmail);
    return {
      ...request,
      staffingAvailability: matchingStaffingAvailability ? matchingStaffingAvailability.status : 'N/A'
    };
  });

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
        console.log("Completed Requests " + response.data);
        if (response.data.length > 0) {
          setRequests(response.data);
        } else {
          setRequests([]);
        }

        setShowReminderButton(false);
      } catch (error) {
        console.error(error);
      }

    } else if (selectedOption === 'NotUpdated') {
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
    setSearchValue(""); // Reset search value when a new search option is selected
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

      const [searchYear, searchMonth, searchDate] = searchValue.split('-').map(Number);

    // Extract planned exam date components
    const plannedExamYear = new Date(request.plannedExamDate).getFullYear();
    const plannedExamMonth = new Date(request.plannedExamDate).getMonth() + 1; // Month is zero-based
    const plannedExamDate = new Date(request.plannedExamDate).getDate();

    // Filter by selected date, month, or year
    if (searchYear && searchMonth && searchDate) {
      // Filter by exact date
      return plannedExamDate === searchDate && plannedExamMonth === searchMonth && plannedExamYear === searchYear;
    } else if (searchYear && searchMonth) {
      // Filter by year and month
      return plannedExamMonth === searchMonth && plannedExamYear === searchYear;
    } else if (searchYear) {
      // Filter by year
      return plannedExamYear === searchYear;
    } else {
      // No specific date/month/year selected, return true
      return true;
    }

    } else if (searchOption === 'cloudPlatform') {
      return request.cloudPlatform && request.cloudPlatform.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchOption === 'cloudExam') {
      return request.cloudExam && request.cloudExam.toLowerCase().includes(searchValue.toLowerCase());
    } else if (searchOption === 'examResult') {
      return request.examResult && request.examResult.toLowerCase().includes(searchValue.toLowerCase());
    }
  };

  const [confirmationVisible, setConfirmationVisible] = useState(false); // State to manage visibility of confirmation message

  const handleSendReminderEmail = async () => {
    // Show confirmation dialog
    setConfirmationVisible(true);
  };

  const handleConfirmSendReminderEmail = async () => {
    // Proceed to send the mail
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
    setConfirmationVisible(false);
  };

  const handleCancelSendReminderEmail = () => {
    setConfirmationVisible(false);
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
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal and set the selected image
  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [denyConfirmationVisible, setDenyConfirmationVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const openDenyConfirmation = (request) => {
    setSelectedRequest(request);
    setDenyConfirmationVisible(true);
  };

  const closeDenyConfirmation = () => {
    setDenyConfirmationVisible(false);
    setSelectedDenialReason(""); // Reset selected denial reason
  };

  const handleDenyRequest = async () => {
    try {
      // Send the denial request with the selected reason
      const response = await axios.get(`http://localhost:8085/requests/denyRequest/${selectedRequest.id}?reason=${selectedDenialReason}`);
      console.log(response.data);

      // Show success toasty message
      toast.success('Request denied successfully!!!');

      // Reload the current page
      window.location.reload();
    } catch (error) {
      console.error(error.response.data);

      // Show error toasty message
      toast.error('Failed to deny request. Please try again.');
    }

    setDenyConfirmationVisible(false);
  };
  const fetchR2D2Image = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8085/requests/getR2d2Screenshot/${id}`, {
        responseType: 'arraybuffer',
      });

      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const imageUrl = URL.createObjectURL(blob);
      // Handle setting the image URL to state or directly displaying it
      // For example:
      setSelectedImage(imageUrl);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching R2D2 image:', error.message);
    }
  };




  // useEffect(() => {
  //   axios.get(`http://localhost:8085/requests/getAllVouchers`)
  //     .then(response => {
  //       setRequests(response.data);


  //     })
  //     .catch(error => {
  //       console.log(error);
  //     });
  // }, []);

  const fetchValidationNumber = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8085/getValidationNumber/${id}`);
      return response.data; // Assuming the validation number is returned as a string
    } catch (error) {
      console.error('Error fetching validation number:', error.message);
      return null; // Handle error gracefully, returning null or any default value
    }
  };
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:8085/requests/getAllVouchers");
        const requestsWithValidationNumbers = await Promise.all(
          response.data.map(async (request) => {
            const validationNumberResponse = await axios.get(`http://localhost:8085/getValidationNumber/${request.id}`);
            return { ...request, validationNumber: validationNumberResponse.data };
          })
        );
        setRequests(requestsWithValidationNumbers);
      } catch (error) {
        console.error("Error fetching requests:", error);
      }
    };

    fetchRequests();

  }, []);
  const acceptedFileFormats = ['.xlsx'];
  const [selectedSupplierFile, setSelectedSupplierFile] = useState(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);


  const closeSupplierModal = () => {
    setIsSupplierModalOpen(false);
  };
  const handleSupplierFileChange = (event) => {
    setSelectedSupplierFile(event.target.files[0]);
  };
  const handleSupplierFileUpload = async () => {
    try {
      if (!selectedSupplierFile) {
        toast.error('Please select a file to upload.');
        return;
      }

      const formData = new FormData();
      formData.append('candidates', selectedSupplierFile);

      // Make an HTTP request to upload the file
      // Replace the URL with your backend endpoint
      const response = await axios.post('http://localhost:8085/candidate/saveAllCandidate', formData);
      console.log('Response from server:', response);

      // Handle the response based on different scenarios
      if (response.status === 200) {
        const { data } = response;
        if (data.startsWith('Total')) {
          toast.success(data);
        } else if (data === 'Data already exists') {
          toast.warn(data);
        } else if (data === 'Uploaded successfully') {
          toast.success(data);
        } else {
          // Handle unexpected response
          toast.error('Unexpected response from server.');
        }
      } else {
        // Handle non-200 response status
        toast.error('Error uploading supplier file. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading supplier file:', error);
      toast.error('Data Already Exists');
    }
  };

  const openSupplierModal = () => {
    console.log("Opening supplier modal"); // Add this line
    setIsSupplierModalOpen(true);
  };

  const handleDropdownClose = () => {
    setSearchValue(""); // Reset search value when the dropdown menu is closed
  };

  // Calculate filtered items only if filters are applied
const filteredRequests = searchOption === 'default' ? combinedData : combinedData.filter(filters);

// Calculate the total number of pages based on the filtered items count
const pageCount = Math.ceil(filteredRequests.length / rowsPerPage);

  return (
    <div className="headd">
      <div>
        {confirmationVisible && (
          <div className="confirmation-modal">
            <p>Are you sure you want to send the mail?</p>
            <button onClick={handleConfirmSendReminderEmail}>Confirm</button>
            <button onClick={handleCancelSendReminderEmail}>Cancel</button>
          </div>

        )}


        {/* <button onClick={() => setConfirmationVisible(true)}>Send Reminder Mail</button> */}


      </div>
      <div>
        {denyConfirmationVisible && (
          <div className="confirmation-modal">
            {/* Conditional rendering for the message */}
            {selectedDenialReason === "" && (
              <p style={{ color: 'red' }}>Please select a reason before confirming:</p>
            )}
            {/* Dropdown menu for denial reasons */}
            <select style={{
              color: 'InactiveBorder', backgroundColor: '#ecf0f1', marginBottom: '2px',
              fontSize: "14px",
              height: "40px",
              borderRadius: "5px",
              paddingLeft: "10px",
              border: "1px solid #3498db",
              marginBottom: '20px',
              background: "#ecf0f1", // Light gray background
              color: "#2c3e50", // Dark text color
              outline: "none",
            }} value={selectedDenialReason} onChange={handleDenialReasonChange} className="reason-dropdown">
              <option value="">Select Denial Reason</option>
              <option value="lowScore">Low Score</option>
              <option value="outdatedImage">Outdated Image</option>
              <option value="incorrectScreenshot">Incorrect Screenshot</option>
              <option value="incorrectImageFormat">Incorrect Image Format</option>
              <option value="resigned">Resigned</option>
              <option value="otherBU">Other BU</option>
            </select>
            {/* Confirmation message */}
            <p>Are you sure you want to deny the request?</p>
            {/* Confirm and Cancel buttons */}
            <button onClick={handleDenyRequest} disabled={!selectedDenialReason} className="confirm-button">Confirm</button>
            <button onClick={closeDenyConfirmation} className="cancel-button">Cancel</button>
          </div>
        )}


      </div>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            border: 'none',
            background: 'transparent',
            marginLeft: '40%',
            maxWidth: '100%',
            maxHeight: '100%',
          }
        }}
      >
        {/* Make the entire modal draggable */}
        <Draggable>
          <div className="modal-content">
            {/* Navbar for icons */}
            <div className="navbar-image">
              {/* Styled close button */}
              <button className="close-button" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} size="2x" />
              </button>
              {/* Download button */}
              {selectedImage && selectedImage.includes("getCertificate") && (
                <a className="download-ref" href={selectedImage} download>
                  <FontAwesomeIcon icon={faDownload} size="2x" style={{ color: 'blue' }} />
                </a>
              )}
            </div>
            {/* Modal content */}
            <img src={selectedImage} alt="Selected" style={{ width: '100%', height: '100%' }} />
            {/* Conditionally render full-screen icon */}
            {selectedImage && selectedImage.includes("getDoSelectImage") && (
              <a className="fa-expand" href={selectedImage} expand>
                <FontAwesomeIcon icon={faExpand} size="2x" style={{ color: 'black', cursor: 'pointer' }} onClick={() => openModal(selectedImage)} />
              </a>
            )}
          </div>
        </Draggable>
      </Modal>






      <div className="navbar" style={{ backgroundColor: "rgb(112, 183, 184)", width: "auto" }}>

        <div className="user-info" style={{ marginLeft: "20px" }}>
          <p id="name">Welcome!!</p>
          <p id="date">
            {currentTime.toLocaleTimeString(undefined, timeOptions)}{" "}
            {currentTime.toLocaleDateString(undefined, dateOptions)}
          </p>
        </div>

        <div className="user-info" style={{ alignItems: "flex-end" }}>
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

      <div className="wrap">

        <div className="dashboard-container">

          <div className="dashboard-dropdown">
            <select
              className="search-text"
              value={searchOption}
              onChange={handleSearchOptionChange}
              onClose={handleDropdownClose} // Add onClose event handler
              style={{
                fontSize: "14px",
                height: "40px",
                borderRadius: "5px",
                border: "1px solid #3498db",
                background: "#ecf0f1", // Light gray background
                color: "#2c3e50", // Dark text color
                outline: "none",
              }}
            >
              <option value="default">Search Request</option>
              <option value="candidateName">By Candidate Email</option>
              <option value="plannedExamDate">By Exam Date</option>
              <option value="cloudPlatform">By Cloud</option>
              <option value="cloudExam">By Exam name</option>
              <option value="examResult">By Exam Result</option>
            </select>
            {(searchOption === 'candidateName' || searchOption === 'plannedExamDate' || searchOption === 'cloudPlatform' || searchOption === 'cloudExam' || searchOption === 'examResult') && (
              <input
                type="text"
                value={searchValue}
                placeholder={searchOption === 'plannedExamDate' ? "yyyy-mm-dd" : "Search..."}
                onChange={handleSearchInputChange}
                style={{
                  marginLeft: "8px",
                  padding: "8px",
                  fontSize: "14px",
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
                  fontWeight: "bold",
                  backgroundColor: "rgb(33, 61, 154)",
                  fontSize: "13px",
                  padding: "2px",
                  height: "40px",
                  width: "140px",
                  borderRadius: "5px",
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
          <table className="dashboard-table" style={{ width: "170%" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Cloud</th>
                <th>Exam</th>
                <th>DoSelect Score</th>
                <th>DoSelect Image</th>
                <th>Voucher code</th>
                <th>Issued Date</th>
                <th>Expiry Date</th>
                <th>Exam Date</th>
                <th>Result</th>
                <th>Certificate</th>
                <th>Validation Number</th>
                <th>R2D2 Image</th>
                <th>Deny Voucher</th>
                <th>Assign Voucher</th>


              </tr>
            </thead>

            <tbody>
              {filteredRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).sort((a, b) => {
                // Sort by voucher code availability (assigned requests first, then pending)
                if (a.voucherCode === null && b.voucherCode !== null) {
                  return -1; // Move rows with no voucher code (pending) to the top
                } else if (a.voucherCode !== null && b.voucherCode === null) {
                  return 1; // Move rows with voucher code (assigned) to the bottom
                } else {
                  // Sort by planned exam date
                  return new Date(a.plannedExamDate) - new Date(b.plannedExamDate);
                }
              }).map((row, index) => (
                <tr key={index}>
                  <td>{row.candidateName}</td>
                  <td>{row.candidateEmail}</td>
                  <td>{row.staffingAvailability}</td>
                  <td>{row.cloudPlatform}</td>
                  <td>{row.cloudExam}</td>
                  <td>{row.doSelectScore}</td>
                  <td>
                    {row.doSelectScoreImage ? (
                      <img
                        src={`http://localhost:8085/requests/getDoSelectImage/${row.id}`}
                        alt="DoSelect Image"
                        style={{ width: '50px', height: '50px', cursor: 'pointer' }}
                        onClick={() => openModal(`http://localhost:8085/requests/getDoSelectImage/${row.id}`)}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>

                  <td>{row.voucherCode}</td>
                  <td>{row.voucherIssueLocalDate}</td>
                  <td>{row.voucherExpiryLocalDate}</td>
                  <td>{row.plannedExamDate}</td>
                  <td>{row.examResult}</td>
                  <td>
                    {row.examResult === "Fail" || row.examResult === "Pending due to issue" ? (
                      <span style={{ fontSize: "12px" }}>N/A</span>
                    ) : (
                      <span
                        style={{
                          color: 'blue',
                          fontSize: "12px",
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                        onClick={() => openModal(`http://localhost:8085/requests/getCertificate/${row.id}`)}
                      >
                        {row.certificateFileImage}
                      </span>
                    )}
                  </td>
                  <td>{row.validationNumber}</td>
                  <td>
                    {(row.r2d2Screenshot !== null && row.r2d2Screenshot !== "") && (
                      <>
                        {(row.examResult !== "Fail" && row.examResult !== "Pending due to issue") && (
                          <span
                            style={{
                              color: 'blue',
                              fontSize: "12px",
                              textDecoration: 'underline',
                              cursor: 'pointer',
                            }}
                            onClick={() => fetchR2D2Image(row.id)}
                          >
                            View
                          </span>
                        )}
                        {(row.examResult === "Fail" || row.examResult === "Pending due to issue") && (
                          <span style={{ fontSize: "12px" }}>N/A</span>
                        )}
                      </>
                    )}
                  </td>





                  <td>

                    <button
                      className={row.voucherCode !== null ? 'disabled-button' : 'enabled-button'}
                      onClick={() => openDenyConfirmation(row)}
                      disabled={row.voucherCode !== null}
                      style={{
                        backgroundColor: row.voucherCode !== null ? "#95a5a6" : "rgb(230, 134, 134)",
                        fontSize: "12px",
                        height: "35px",
                        color: "#fff",
                        borderRadius: "5px",
                        border: "none"
                      }}
                    >
                      Deny Request
                    </button>
                  </td>
                  <td>
                    <button
                      className={row.voucherCode !== null ? 'disabled-button' : 'enabled-button'}
                      onClick={() => handleAssigneVoucherClick(row.candidateEmail, row.cloudExam, row.id)}
                      disabled={row.voucherCode !== null}
                      style={{
                        backgroundColor: row.voucherCode !== null ? "#95a5a6" : "#3498db", // Gray for disabled, Blue for enabled
                        fontSize: "12px",
                        height: "35px",
                        color: "#fff",
                        borderRadius: "5px",
                        border: "none"
                      }}
                    >
                      Assign Voucher
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>


          {requests.length === 0 && (
            <div style={{ display: "flex", marginLeft: "350px", marginTop: "50px" }}> <p style={{ backgroundColor: "yellow", fontStyle: "-moz-initial" }}>No requests found in this category</p>
            </div>

          )}

          {requests.length !== 0 && (<TablePagination style={{ width: "70%", marginLeft: "2%" }}
            rowsPerPageOptions={[5, 10, 20, 25, { label: 'All', value: filteredRequests.length }]}
            component="div"
            count={filteredRequests.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Rows per page"
          />
          )}
        </div>

      </div>

      <div className="footer-div" style={{ "height": "35px", "marginTop": "15px" }}>
        <footer>
          <p>&copy; {currentTime.getFullYear()} Capgemini. All rights reserved.</p>
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
              <FontAwesomeIcon icon={faList} size="1x" /> Requests</Link></p>
          </div>

          <div className="left-row">
            <p><Link to={'/vouchers'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faClipboardCheck} size="1x" />  Vouchers</Link></p>
          </div>

          <div className="left-row">
            <p><Link to={'/candidates'} style={{ "color": "white" }}>
              <FontAwesomeIcon icon={faUsers} size="1x" /> Eligibility</Link></p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default VoucherRequests;