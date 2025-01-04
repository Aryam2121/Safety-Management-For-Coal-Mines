import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Button, Select, MenuItem, TextField, Switch, FormControlLabel, InputLabel, Grid, Card, CardContent, CircularProgress, Snackbar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { saveAs } from 'file-saver'; // for saving chart image and CSV export
import html2pdf from 'html2pdf.js';
// Registering the necessary chart elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const DataVisualization = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartType, setChartType] = useState('line');
  const [theme, setTheme] = useState('light');
  const [customLabels, setCustomLabels] = useState('');
  const [customData, setCustomData] = useState('');
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState(dayjs());
  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [openExportDialog, setOpenExportDialog] = useState(false);

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleAddData = () => {
    const labels = customLabels.split(',').map(label => label.trim());
    const data = customData.split(',').map(value => Number(value.trim()));
    
    if (labels.length === 0 || data.length === 0) {
      setSnackbarMessage('Please provide valid labels and data.');
      setSnackbarOpen(true);
      return;
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Custom Dataset',
          data,
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
        },
      ],
    });
  };
  const handleExportPDF = () => {
    const chartContainer = document.querySelector('.chart-container');
    const opt = {
      margin:       1,
      filename:     'chart.pdf',
      image:        { type: 'png', quality: 1 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(chartContainer).set(opt).save();
  };
  const handleExportChart = () => {
    const chartCanvas = document.querySelector('canvas');
    const imageUrl = chartCanvas.toDataURL('image/png');
    saveAs(imageUrl, 'chart.png');
  };

  const handleExportData = () => {
    const dataToExport = chartData.datasets[0].data.map((value, index) => ({
      label: chartData.labels[index],
      data: value,
    }));

    const csvContent = 'Label,Data\n' + dataToExport.map(item => `${item.label},${item.data}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'chart_data.csv');
  };

  const handlePresetDateRange = (range) => {
    if (range === 'lastWeek') {
      setStartDate(dayjs().subtract(1, 'week'));
      setEndDate(dayjs());
    } else if (range === 'lastMonth') {
      setStartDate(dayjs().subtract(1, 'month'));
      setEndDate(dayjs());
    } else if (range === 'thisYear') {
      setStartDate(dayjs().startOf('year'));
      setEndDate(dayjs());
    }
  };

  const ChartComponent = chartType === 'line' ? Line : chartType === 'bar' ? Bar : Pie;

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={`p-6 rounded shadow-md ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
        <h2 className="text-2xl font-bold mb-4">Productivity Data Visualization</h2>
        
        {/* Dark Mode Toggle */}
        <FormControlLabel
          control={<Switch checked={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />}
          label="Dark Mode"
        />

        <Grid container spacing={3} className="mb-4">
          <Grid item xs={12} sm={6}>
            {/* Chart Type Selection */}
            <Card>
              <CardContent>
                <InputLabel>Chart Type</InputLabel>
                <Select value={chartType} onChange={handleChartTypeChange} fullWidth>
                  <MenuItem value="line">Line Chart</MenuItem>
                  <MenuItem value="bar">Bar Chart</MenuItem>
                  <MenuItem value="pie">Pie Chart</MenuItem>
                </Select>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            {/* Date Range Picker */}
            <Card>
              <CardContent>
                <InputLabel>Date Range</InputLabel>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <DatePicker
                      label="Start Date"
                      value={startDate}
                      onChange={setStartDate}
                      renderInput={(props) => <TextField {...props} fullWidth />}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <DatePicker
                      label="End Date"
                      value={endDate}
                      onChange={setEndDate}
                      renderInput={(props) => <TextField {...props} fullWidth />}
                    />
                  </Grid>
                </Grid>
                <div>
                  <Button variant="outlined" onClick={() => handlePresetDateRange('lastWeek')}>Last Week</Button>
                  <Button variant="outlined" onClick={() => handlePresetDateRange('lastMonth')}>Last Month</Button>
                  <Button variant="outlined" onClick={() => handlePresetDateRange('thisYear')}>This Year</Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Data Input */}
        <div className="mb-4 flex items-center space-x-4">
          <TextField
            label="Labels (comma-separated)"
            variant="outlined"
            value={customLabels}
            onChange={(e) => setCustomLabels(e.target.value)}
            fullWidth
          />
          <TextField
            label="Data (comma-separated)"
            variant="outlined"
            value={customData}
            onChange={(e) => setCustomData(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={handleAddData} style={{ marginLeft: '10px' }}>Add Data</Button>
        </div>

        {/* Chart Display */}
        <div className="chart-container" style={{ width: '100%', height: '400px' }}>
          {loading ? (
            <CircularProgress />
          ) : chartData.labels.length > 0 && chartData.datasets.length > 0 ? (
            <ChartComponent data={chartData} options={{ maintainAspectRatio: false }} />
          ) : (
            <p>No data available for the selected chart type.</p>
          )}
        </div>

        {/* Export Buttons */}
        <div className="mt-4">
          <Button variant="outlined" onClick={handleExportChart}>Export Chart as Image</Button>
          <Button variant="outlined" onClick={handleExportData} style={{ marginLeft: '10px' }}>Export Data as CSV</Button>
          <Button variant="outlined" onClick={handleExportPDF} style={{ marginLeft: '10px' }}>Export Chart as PDF</Button>
        </div>

        {/* Snackbar for validation feedback */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </div>
    </LocalizationProvider>
  );
};

export default DataVisualization;
