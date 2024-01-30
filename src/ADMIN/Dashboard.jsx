import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './Graph.css';
function Dashboard() {
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]);
  const [awsVouchers, setAwsVouchers] = useState(0);
  const [gcpVouchers, setGcpVouchers] = useState(0);
  const [azureVouchers, setAzureVouchers] = useState(0);

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
    <main className='main-container'>
      <div className='main-title'>
        <h3>DASHBOARD</h3>
      </div>

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
            <Bar dataKey="passed" fill="#4caf50" onClick={(entry) => handleBarClick(entry)}/>
            <Bar dataKey="failed" fill="#f44336" onClick={(entry) => handleBarClick(entry)} />
            <Bar dataKey="pending" fill="#ffeb3b" onClick={(entry) => handleBarClick(entry)}/>
          </BarChart>
        {/* </ResponsiveContainer> */}
      </div>

      
    </main>
  );
}

export default Dashboard;
