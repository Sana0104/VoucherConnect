import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Paper,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    MenuItem,
    Select,
    TablePagination,
} from '@mui/material';
import Navbar from './Navbar';
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
 
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        whiteSpace: 'nowrap',
    },
 
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));
 
const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
    height: "2px",
}));
 
const ViewVouchers = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditDateModalOpen, setEditDateModalOpen] = useState(false);
    const [selectedExamIndex, setSelectedExamIndex] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [editIndex, setEditIndex] = useState(-1);
    const [resultOptions] = useState(['Pass', 'Fail', 'Pending due to issue']);
    const navigate = useNavigate();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const obj = localStorage.getItem("userInfo");
    const { username } = obj ? JSON.parse(obj) : { username: '' };
    const [error, setError] = useState(null);
    const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [certificateUploaded, setCertificateUploaded] = useState(false);
    const [uploadR2D2ScreenshotDialogOpen, setUploadR2D2ScreenshotDialogOpen] = useState(false);
    const [isValidationNumberEnabled, setValidationNumberEnabled] = useState(false);
    const [validationNumberError, setValidationNumberError] = useState('');
    const [showValidationPopup, setShowValidationPopup] = useState(false);
    const [validationNumberInput, setValidationNumberInput] = useState('');
    const [isValidationNumberSaved, setIsValidationNumberSaved] = useState(false);
    const [r2d2ScreenshotUploaded, setR2D2ScreenshotUploaded] = useState(false);

    const saveToLocalStorage = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    // Function to retrieve data from local storage
const loadFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await fetch(`http://localhost:8085/requests/${username}`);
                const result = await response.json();
                setData(result); // Set the data without sorting
                setLoading(false);
                // const sortedData = result.sort((a, b) => {
                //     const dateA = new Date(a.plannedExamDate);
                //     const dateB = new Date(b.plannedExamDate);
                //     return dateA - dateB;
                // });
                //  setData(sortedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };
 
        fetchVouchers();
    }, []);
 
    const handleRequestVoucher = () => {
        navigate('/requestform', { state: { username } });
    };
 
    const handleEditExamDate = (index) => {
        setSelectedExamIndex(index);
        setEditDateModalOpen(true);
    };
 
    const handleEditResult = (index) => {
        const voucher = data[index];
        if (!voucher.voucherCode) {
            setError('Voucher code is not available. Cannot edit result.');
            return;
        }
        const currentDate = new Date();
        const enabledDate = new Date(data[index].plannedExamDate);
        if (currentDate >= enabledDate) {
            setEditIndex(index);
            if (voucher.examResult === 'Pass') {
                setValidationNumberEnabled(true); // Enable validation number input
            }
            setError(null);
        } else {
            setError('Editing result is not allowed before the exam date.');
        }
    };
 
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };
 
    const handleSaveExamDate = async () => {
        try {
            const voucherToUpdate = data[selectedExamIndex];
            if (!voucherToUpdate.voucherCode) {
                throw new Error('Voucher code is not available. Cannot update exam date before receiving voucher code.');
            }
            const voucherCode = voucherToUpdate.voucherCode;
            const formattedDate = selectedDate.toISOString().split('T')[0];
            const response = await fetch(`http://localhost:8085/requests/updateExamDate/${voucherCode}/${formattedDate}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const updatedData = [...data];
                updatedData[selectedExamIndex].plannedExamDate = formattedDate;
                setData(updatedData);
                setEditDateModalOpen(false);
            } else {
                throw new Error('Failed to update exam date.');
            }
        } catch (error) {
            setError(error.message);
        }
    };
 
    const handleSaveResult = async (index) => {
        try {
          

            const voucherToUpdate = data[index];
            const updatedResult = data[index].examResult;
            if (updatedResult === 'Pass') {
                
                if (!voucherToUpdate.certificateFileImage) {
                    throw new Error('Certificate must be uploaded before changing the result to Pass');
                }
                if (!voucherToUpdate.validationNumber) {
                    throw new Error('Validation number must be filled before  before changing the result to Pass');
                }
                if (!voucherToUpdate.r2d2Screenshot) {
                    throw new Error('R2D2 screenshot must be uploaded before before changing the result to Pass');
                }
                const localStorageData = loadFromLocalStorage('data');
            }
 
            const response = await axios.put(`http://localhost:8085/requests/updateExamResult/${voucherToUpdate.voucherCode}/${updatedResult}`);
            if (response.status === 200) {
                const updatedData = [...data];
                updatedData[index].examResult = updatedResult;
                setData(updatedData);
                setError(null);
    
                if (updatedResult !== ' ') {
                    setEditIndex(-1);
                }
                window.location.reload();
            } else {
                throw new Error('Failed to update result.');
            }
        } catch (error) {
            console.error('Error updating result:', error);
            setError(error.message);
        }
    };
    const handleOpenUploadDialog = (index) => {
        setSelectedExamIndex(index);
        setSelectedFile(null);
        setUploadDialogOpen(true);
    };
 
    const handleCloseUploadDialog = () => {
        setUploadDialogOpen(false);
    };
    const handleOpenUploadR2D2ScreenshotDialog = (index) => {
        setSelectedExamIndex(index);
        setSelectedFile(null); // Reset selected file
        setUploadR2D2ScreenshotDialogOpen(true);
    };
 
    const handleCloseUploadR2D2ScreenshotDialog = () => {
        setUploadR2D2ScreenshotDialogOpen(false);
    };
 
    const handleUploadR2D2Screenshot = async () => {
        try {
            const formData = new FormData();
            formData.append('coupon', data[selectedExamIndex].voucherCode);
            formData.append('image', selectedFile);
 
            const response = await axios.post('http://localhost:8085/requests/uploadR2d2Screenshot', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
  // Existing code...
  setR2D2ScreenshotUploaded(true);
            if (response.status === 200) {
                const updatedData = [...data];
                updatedData[selectedExamIndex].r2d2Screenshot = response.data.r2d2Screenshot;
                setData(updatedData);
                setUploadR2D2ScreenshotDialogOpen(false);
                setR2D2ScreenshotUploaded(true);
                // Optionally, you can show a success message here
            } else {
                throw new Error('Failed to upload R2D2 screenshot. Server responded with status: ' + response.status);
            }
            // Save updated data to local storage
            saveToLocalStorage('data', data);
        } catch (error) {
            console.error('Error uploading R2D2 screenshot:', error);
            console.log('Error uploading R2D2 screenshot: ' + error.message);
            setError('Check the file is uploaded or not');
        }
    };
 
    const handleEnableValidationNumber = (index) => {
        setSelectedExamIndex(index);
        const voucher = data[index];
        if (!voucher.voucherCode) {
            setError('Voucher code is not available. Cannot enable validation number.');
            return;
        }
        // You may need to adjust the condition for enabling validation number based on your business logic
        const currentDate = new Date();
        const enabledDate = new Date(voucher.plannedExamDate);
        if (currentDate >= enabledDate) {
            setValidationNumberEnabled(true);
            setError(null);
        } else {
            setError('Enabling validation number is not allowed before the exam date.');
        }
    };
 
 
    const handleSaveValidationNumber = async () => {
        try {
            const voucherToUpdate = data[selectedExamIndex];
            const voucherRequestId = voucherToUpdate.id; // Assuming voucherRequestId is accessible in data
 
            const validationNumberInputTrimmed = validationNumberInput.trim();
 
            // Regular expression to match exactly 16 characters consisting of alphabets and numbers
            const validationRegex = /^[A-Za-z0-9]{16}$/;
 
            if (!validationRegex.test(validationNumberInputTrimmed)) {
                throw new Error('Validation number must be exactly 16 characters long and contain only alphabets and numbers.');
            }
          
            const response = await axios.put(`http://localhost:8085/requests/provideValidationNumber/${voucherRequestId}`, null, {
                params: {
                    validationNumber: validationNumberInput
                }
            });
            setIsValidationNumberSaved(true); 
            if (response.status === 200) {
                const updatedData = [...data];
                updatedData[selectedExamIndex].validationNumber = validationNumberInput;
                setData(updatedData);
                setValidationNumberError('');
                setValidationNumberInput('');
                setValidationNumberEnabled(false);
                setShowValidationPopup(true);
                setIsValidationNumberSaved(true); // Update the state to indicate validation number is saved
            } else {
                throw new Error('Failed to save validation number.');
            }
             // Save updated data to local storage
             saveToLocalStorage('data', data);
        } catch (error) {
            console.error('Error saving validation number:', error);
            setValidationNumberError('Error saving validation number: ' + error.message);
        }
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };
 
     const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('coupon', data[selectedExamIndex].voucherCode);
            formData.append('image', selectedFile);
            const response = await axios.post('http://localhost:8085/requests/uploadCertificate', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                const updatedData = [...data];
                updatedData[selectedExamIndex].certificateFileImage = response.data.certificateFileImage;
                setData(updatedData);
                setUploadDialogOpen(false);
                setCertificateUploaded(true);
                // Save updated data to local storage
                saveToLocalStorage('data', updatedData); // <-- Update this line
            } else {
                throw new Error('Failed to upload certificate.');
            }
        } catch (error) {
            console.error('Error uploading certificate:', error);
            console.error('Error uploading certificate: ' + error.message);
            setError('Check File is uploaded or not ');
        }
    };
 
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
 
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const getMaxDate = () => {
        const voucherIssuedDate = data[selectedExamIndex]?.voucherIssueLocalDate; // This is a placeholder for the voucher issued date
        if (voucherIssuedDate) {
            const maxDate = new Date(voucherIssuedDate);
            maxDate.setDate(maxDate.getDate() + 14); // Adding 14 days to voucher issued date
            return maxDate;
        } else {
            // If voucherIssuedDate is not available, set a default max date (e.g., 14 days from today)
            const defaultMaxDate = new Date();
            defaultMaxDate.setDate(defaultMaxDate.getDate() + 14);
            return defaultMaxDate;
        }
    };
 
    const acceptedFileFormats = ['.jpg', '.jpeg', '.png'];
    return (
        <>
            <Navbar />
            <div style={{ position: 'relative' }}>
                <Button onClick={handleRequestVoucher} variant="contained" color="success" style={{ position: 'absolute', top: '20px', left: '20px', marginTop: '-30px', zIndex: 1 }}>
                    Request Voucher
                </Button>
                <div className="container" style={{ marginTop: '30px', paddingTop: '80px' }}>
                    <Box>
                        <TableContainer component={Paper}>
                            <Table aria-label="customized table" style={{ width: "70%", marginLeft: "1%" }}>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ minWidth: '200px' }}>Exam Name</StyledTableCell>
                                        <StyledTableCell >Cloud Platform</StyledTableCell>
                                        <StyledTableCell >Voucher Code</StyledTableCell>
                                        <StyledTableCell >Voucher Issued Date</StyledTableCell>
 
                                        <StyledTableCell style={{ minWidth: '150px' }}>Exam Date</StyledTableCell>
                                        <StyledTableCell style={{ minWidth: '150px' }}>Result</StyledTableCell>
                                        <StyledTableCell style={{ minWidth: '200px' }}>Certificate</StyledTableCell>
                                        <StyledTableCell >Validation Number</StyledTableCell>
                                        <StyledTableCell >R2D2 Screenshot</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <StyledTableRow>
                                            <TableCell colSpan={7} className="table-cell">
                                                Loading...
                                            </TableCell>
                                        </StyledTableRow>
                                    ) : (
                                        data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((voucher, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell>{voucher.cloudExam}</StyledTableCell>
                                                <StyledTableCell>{voucher.cloudPlatform}</StyledTableCell>
                                                <StyledTableCell>{voucher.voucherCode ?? 'Requested'}</StyledTableCell>
                                                <StyledTableCell>{voucher.voucherIssueLocalDate ? voucher.voucherIssueLocalDate : 'Requested'}</StyledTableCell>
 
                                                <StyledTableCell>
                                                    {voucher.plannedExamDate}
                                                    <IconButton onClick={() => handleEditExamDate(index)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {editIndex === index ? (
                                                        <Select
                                                            value={voucher.examResult}
                                                            onChange={(e) => {
                                                                const newData = [...data];
                                                                newData[index].examResult = e.target.value;
                                                                setData(newData);
                                                            }}
                                                        >
                                                            {resultOptions.map((option, optionIndex) => (
                                                                <MenuItem
                                                                    key={optionIndex}
                                                                    value={option}
                                                                    style={{ color: option === 'Pending' ? 'red' : 'inherit' }}
                                                                >
                                                                    {option}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    ) : (
                                                        voucher.examResult
                                                    )}
                                                    {(voucher.examResult === 'Pending' && editIndex !== index) && (
                                                        <IconButton onClick={() => handleEditResult(index)}>
                                                            <EditIcon />
                                                        </IconButton>
                                                    )}
                                                    {(voucher.examResult !== 'Pending' && editIndex === index) && (
                                                        <IconButton onClick={() => handleSaveResult(index)}>
                                                            <SaveIcon />
                                                        </IconButton>
                                                    )}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {voucher.examResult === 'Pass' ? (
                                                        voucher.certificateFileImage ? (
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div>{voucher.certificateFileImage}</div>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                onClick={() => handleOpenUploadDialog(index)}
                                                            >
                                                                Upload
                                                            </Button>
                                                        )
                                                    ) : (
                                                        <span>N/A</span>
                                                    )}
                                                </StyledTableCell>
                                             
                                                <StyledTableCell>
                                                    {voucher.examResult === 'Pass' ? (
                                                        voucher.validationNumber ? (
                                                            <div>{voucher.validationNumber}</div> // Display the validation number if saved
                                                        ) : (
                                                            !isValidationNumberSaved ? (
                                                                <Button onClick={() => handleEnableValidationNumber(index)}>Enter</Button> // Enable "Enter" button if validation number is not saved and not already saved
                                                            ) : (
                                                                <span>N/A</span> // Display "N/A" if validation number is already saved
                                                            )
                                                        )
                                                    ) : (
                                                        <span>N/A</span> // Display "N/A" if exam result is not "Pass"
                                                    )}
                                                </StyledTableCell>
 
 
 
 
                                                <StyledTableCell>
                                                    {voucher.examResult === 'Pass' ? (
                                                        voucher.r2d2Screenshot ? (
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div>{voucher.r2d2Screenshot}</div>
                                                            </div>
                                                        ) : (
                                                            <Button
                                                                onClick={() => handleOpenUploadR2D2ScreenshotDialog(index)}
                                                            >
                                                                Upload
                                                            </Button>
                                                        )
                                                    ) : (
                                                        <span>N/A</span>
                                                    )}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination style={{ width: "70%", marginLeft: "2%" }}
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: data.length }]}
                                component="div"
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Rows per page"
                            />
                        </TableContainer>
                    </Box>
                </div>
                <Dialog open={isEditDateModalOpen} onClose={() => setEditDateModalOpen(false)}>
                    <DialogTitle>Edit Exam Date</DialogTitle>
                    <DialogContent sx={{ width: '300px', height: '300px' }}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            utcOffset={0}
                            minDate={new Date()}
                            maxDate={getMaxDate()}
                        // maxDate={
                        //     data[selectedExamIndex]?.voucherExpiryLocalDate
                        //         ? new Date(data[selectedExamIndex].voucherExpiryLocalDate)
                        //         : null
                        // }
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSaveExamDate}>Save</Button>
                        <Button onClick={() => setEditDateModalOpen(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={isUploadDialogOpen} onClose={handleCloseUploadDialog}>
                    <DialogTitle>Upload Certificate</DialogTitle>
                    <DialogContent>
                        <input type="file" onChange={handleFileChange} />
                    </DialogContent>
                    <span style={{ marginLeft: "20px", marginTop: "-20px", }} className="file-format-info">
                        Accepted formats: {acceptedFileFormats.join(', ')}
                    </span>
                    <DialogActions>
                        <Button onClick={handleUpload}>Upload</Button>
                        <Button onClick={handleCloseUploadDialog}>Cancel</Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={isValidationNumberEnabled} // Change to isValidationNumberEnabled
                    onClose={() => setValidationNumberEnabled(false)} // Adjust the closing action
                    aria-labelledby="validation-dialog-title"
                >
                    <DialogTitle id="validation-dialog-title">Enter Validation Number</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="validation-number"
                            label="Validation Number"
                            type="text"
                            fullWidth
                            value={validationNumberInput}
                            onChange={(e) => {
                                // Limit input length to 16 characters
                                if (e.target.value.length <= 16) {
                                    setValidationNumberInput(e.target.value);
                                }
                            }}
                            error={!!validationNumberError} // Set error state
                            helperText={validationNumberError} // Display error message
                        />
                    </DialogContent>
 
                    <DialogActions>
                        <Button onClick={handleSaveValidationNumber}>Save</Button>
                    </DialogActions>
                </Dialog>
 
                <Dialog open={uploadR2D2ScreenshotDialogOpen} onClose={handleCloseUploadR2D2ScreenshotDialog}>
    <DialogTitle>Upload R2D2 Screenshot</DialogTitle>
    <DialogContent>
        <input type="file" onChange={handleFileChange} />
    </DialogContent>
    <span style={{ marginLeft: "20px", marginTop: "-20px", }} className="file-format-info">
        Accepted formats: {acceptedFileFormats.join(', ')}
    </span>
    <DialogActions>
        <Button onClick={handleUploadR2D2Screenshot}>Upload</Button>
        <Button onClick={handleCloseUploadR2D2ScreenshotDialog}>Cancel</Button>
    </DialogActions>
</Dialog>
 
                <Snackbar
                    open={certificateUploaded}
                    autoHideDuration={6000}
                    onClose={() => setCertificateUploaded(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    style={{ bottom: '80px' }}
                >
                    <MuiAlert
                        onClose={() => setCertificateUploaded(false)}
                        severity="success"
                        sx={{ width: '100%', maxWidth: '100%' }}
                        style={{ backgroundColor: 'green', color: 'white', fontSize: '20px', padding: '20px' }}
                    >
                        Certificate uploaded successfully
                    </MuiAlert>
                </Snackbar>
                <Snackbar
                    open={r2d2ScreenshotUploaded}
                    autoHideDuration={6000}
                    onClose={() => setR2D2ScreenshotUploaded(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    style={{ bottom: '80px' }}
                >
                    <MuiAlert
                        onClose={() => setR2D2ScreenshotUploaded(false)}
                        severity="success"
                        sx={{ width: '100%', maxWidth: '100%' }}
                        style={{ backgroundColor: 'green', color: 'white', fontSize: '20px', padding: '20px' }}
                    >
                        R2D2 screenshot uploaded successfully
                    </MuiAlert>
                </Snackbar>
                {error && (
                    <Snackbar
                        open={!!error}
                        autoHideDuration={6000}
                        onClose={() => setError(null)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        style={{ bottom: '80px' }}
                    >
                        <MuiAlert
                            onClose={() => setError(null)}
                            severity="error"
                            sx={{ width: '100%', maxWidth: '100%' }}
                            style={{ backgroundColor: 'red', color: 'white', fontSize: '20px', padding: '20px' }}
                        >
                            {error}
                        </MuiAlert>
                    </Snackbar>
                )}
            </div>
        </>
    );
};
 
export default ViewVouchers;