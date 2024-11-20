import React, { useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Button, Select, MenuItem, TextField, Switch, FormControlLabel, InputLabel, Grid, Card, CardContent } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Registering the necessary chart elements
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const DataVisualization = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [chartType, setChartType] = useState('line');
  const [theme, setTheme] = useState('light');
  const [customLabels, setCustomLabels] = useState('');
  const [customData, setCustomData] = useState('');
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState(dayjs());

  const handleChartTypeChange = (event) => {
    setChartType(event.target.value);
  };

  const handleAddData = () => {
    const labels = customLabels.split(',').map(label => label.trim());
    const data = customData.split(',').map(value => Number(value.trim()));
    
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
          {chartData.labels.length > 0 && chartData.datasets.length > 0 ? (
            <ChartComponent data={chartData} options={{ maintainAspectRatio: false }} />
          ) : (
            <p>No data available for the selected chart type.</p>
          )}
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default DataVisualization;
