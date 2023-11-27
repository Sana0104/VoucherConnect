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
    TextField,
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
import {  useNavigate } from 'react-router-dom';
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
    const { username } = JSON.parse(obj);
 
    const [isEditing, setIsEditing] = useState(-1);
    const [error, setError] = useState(null);
 
    useEffect(() => {
        const fetchVouchers = async () => {
            try {
 
                const response = await fetch(`http://localhost:8085/requests/${username}`);
                const result = await response.json();
                setData(result);
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
            console.log('Voucher code is not available. Cannot edit result.');
            setError('Voucher code is not available. Cannot edit result.');
            return;
        }
 
        const currentDate = new Date();
        const enabledDate = new Date(data[index].plannedExamDate);
 
        if (currentDate >= enabledDate) {
            setEditIndex(index);
            setIsEditing(index);
            setError(null);
        } else {
            console.log('Editing is not allowed before', enabledDate);
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
                console.error('Failed to update exam date:', response.status);
                throw new Error('Failed to update exam date.');
            }
        } catch (error) {
            console.error('Error updating exam date:', error.message);
            setError(error.message);
        }
    };
 
    const handleCancelEditDate = () => {
        setEditDateModalOpen(false);
        setSelectedExamIndex(null);
    };
 
    const handleSaveResult = async (index) => {
        try {
            const voucherToUpdate = data[index];
            const updatedResult = data[index].examResult;
 
            const response = await axios.put(`http://localhost:8085/requests/${voucherToUpdate.voucherCode}/${updatedResult}`);
            console.log("code is", voucherToUpdate.voucherCode);
            console.log(voucherToUpdate.examResult);
            if (response.ok) {
                const updatedData = [...data];
                updatedData[index].examResult = updatedResult;
                setData(updatedData);
                setError(null);
            } else {
                console.error('Failed to update result');
            }
        } catch (error) {
            console.error('Error updating result:', error);
        }
        finally {
            window.location.reload();  
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
                            <Table aria-label="customized table" style={{ width: "70%", marginLeft: "2%" }}>
                                <TableHead>
                                    <StyledTableRow>
                                        <StyledTableCell style={{ minWidth: '200px' }}>Exam Name</StyledTableCell>
                                        <StyledTableCell >Cloud Platform</StyledTableCell>
                                        <StyledTableCell >Voucher Code</StyledTableCell>
                                        <StyledTableCell >Voucher Issued Date</StyledTableCell>
                                        <StyledTableCell >Voucher Expiry Date</StyledTableCell>
                                        <StyledTableCell style={{ minWidth: '150px' }}>Exam Date</StyledTableCell>
                                        <StyledTableCell style={{ minWidth: '200px' }}>Result</StyledTableCell>
                                    </StyledTableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        <StyledTableRow>
                                            <TableCell colSpan={7} className="table-cell">
                                                Loading Data.......
                                            </TableCell>
                                        </StyledTableRow>
                                    ) : (
                                        data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((voucher, index) => (
                                            <StyledTableRow key={index}>
                                                <StyledTableCell >{voucher.cloudExam}</StyledTableCell>
                                                <StyledTableCell >{voucher.cloudPlatform}</StyledTableCell>
                                                <StyledTableCell>{voucher.voucherCode ?? 'Pending'}</StyledTableCell>
                                                <StyledTableCell >{voucher.voucherIssueLocalDate ? voucher.voucherIssueLocalDate : 'Pending'}</StyledTableCell>
                                                <StyledTableCell >{voucher.voucherExpiryLocalDate ? voucher.voucherExpiryLocalDate : 'Pending'}</StyledTableCell>
                                                <StyledTableCell >
                                                    {voucher.plannedExamDate}
                                                    <IconButton onClick={() => handleEditExamDate(index)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </StyledTableCell>
                                                <StyledTableCell className="table-cell">
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
                                                                <MenuItem key={optionIndex} value={option}>
                                                                    {option}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    ) : (
                                                        voucher.examResult
                                                    )}
                                                    {isEditing === index ? (
                                                        <>
                                                            <IconButton onClick={() => handleSaveResult(index)}>
                                                                <SaveIcon />
                                                            </IconButton>
 
                                                        </>
                                                    ) : (
                                                        <IconButton onClick={() => handleEditResult(index)}>
                                                            <EditIcon />
                                                        </IconButton>
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
                <Dialog open={isEditDateModalOpen} onClose={handleCancelEditDate}>
                    <DialogTitle>Edit Exam Date</DialogTitle>
                    <DialogContent sx={{ width: '300px', height: '300px' }}>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy-MM-dd"
                            utcOffset={0}
                            minDate={new Date()}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSaveExamDate}>Save</Button>
                        <Button onClick={handleCancelEditDate}>Cancel</Button>
                    </DialogActions>
                </Dialog>
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