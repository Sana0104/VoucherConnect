import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
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
 
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await fetch(`http://localhost:8085/requests/${username}`);
                const result = await response.json();
                const sortedData = result.sort((a, b) => {
                    const dateA = new Date(a.plannedExamDate);
                    const dateB = new Date(b.plannedExamDate);
                    return dateA - dateB;
                });
                setData(sortedData);
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
            const response = await axios.put(`http://localhost:8085/requests/${voucherToUpdate.voucherCode}/${updatedResult}`);
            if (response.status === 200) {
                const updatedData = [...data];
                updatedData[index].examResult = updatedResult;
                setData(updatedData);
                setError(null);
                if (updatedResult !== 'Pending due to issue') {
                    setEditIndex(-1);
                }
            } else {
                throw new Error('Failed to update result.');
            }
        } catch (error) {
            console.error('Error updating result:', error);
            setError('Error updating result.');
        }
    };
 
    const handleOpenUploadDialog = (index) => {
        setSelectedExamIndex(index);
        setUploadDialogOpen(true);
    };
 
    const handleCloseUploadDialog = () => {
        setUploadDialogOpen(false);
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
            } else {
                throw new Error('Failed to upload certificate.');
            }
        } catch (error) {
            console.error('Error uploading certificate:', error);
            setError('Error uploading certificate.');
        }
    };
 
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
 
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
 
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
                                        <StyledTableCell >Voucher Expiry Date</StyledTableCell>
                                        <StyledTableCell style={{ minWidth: '150px' }}>Exam Date</StyledTableCell>
                                        <StyledTableCell style={{ minWidth: '150px' }}>Result</StyledTableCell>
                                        <StyledTableCell style={{ minWidth: '200px' }}>Certificate</StyledTableCell>
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
                                                <StyledTableCell>{voucher.voucherExpiryLocalDate ? voucher.voucherExpiryLocalDate : 'Requested'}</StyledTableCell>
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
                                                                {/* <img src={voucher.certificateFileImage} style={{ width: '100px', height: 'auto' }} /> */}
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
                            maxDate={
                                data[selectedExamIndex]?.voucherExpiryLocalDate
                                    ? new Date(data[selectedExamIndex].voucherExpiryLocalDate)
                                    : null
                            }
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
                    <DialogActions>
                        <Button onClick={handleUpload}>Upload</Button>
                        <Button onClick={handleCloseUploadDialog}>Cancel</Button>
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