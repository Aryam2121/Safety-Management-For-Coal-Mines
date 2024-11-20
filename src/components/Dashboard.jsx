import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, ArcElement, PointElement } from 'chart.js';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Registering Chart.js components
ChartJS.register(Title, Tooltip, Legend, LineElement, BarElement, CategoryScale, LinearScale, PointElement, ArcElement);

const Dashboard = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false); // Dark Mode Toggle

  // Dummy Data for Charts
  const lineChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Productivity Over the Week',
        data: [70, 75, 80, 85, 90, 85, 80],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
      },
    ],
  };

  const pieChartData = {
    labels: ['Safe', 'Warning', 'Critical'],
    datasets: [
      {
        label: 'Safety Compliance Breakdown',
        data: [70, 20, 10],
        backgroundColor: ['#34D399', '#FBBF24', '#F87171'],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: ['Dept A', 'Dept B', 'Dept C', 'Dept D'],
    datasets: [
      {
        label: 'Department Performance',
        data: [60, 80, 70, 90],
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        borderWidth: 1,
      },
    ],
  };

  // Dummy mine locations data
  const mineLocations = [
    { name: 'Mine 1', latitude: 20.5937, longitude: 78.9629 },
    { name: 'Mine 2', latitude: 22.5726, longitude: 88.3639 },
    { name: 'Mine 3', latitude: 19.0760, longitude: 72.8777 },
  ];

  // Dummy upcoming maintenance data
  const upcomingMaintenance = [
    { task: 'Conveyor Belt Inspection', date: '2024-09-30' },
    { task: 'Equipment Calibration', date: '2024-10-05' },
  ];

  // Filter upcoming maintenance based on search term
  const filteredMaintenance = upcomingMaintenance.filter(item =>
    item.task.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dark Mode Styling Toggle
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white' : 'bg-gradient-to-r from-white to-gray-100 text-gray-900'} transition-all`}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Dashboard</h2>
          <button 
            onClick={toggleDarkMode} 
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-all transform hover:scale-105">
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* Date Range Picker */}
        <div className="mb-4 flex space-x-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className={`border p-2 rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className={`border p-2 rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Line Chart Card */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <h3 className="font-bold text-xl mb-2 text-white">Productivity Over the Week</h3>
            <div className="h-48">
              <Line data={lineChartData} options={{
                responsive: true,
                plugins: {
                  tooltip: {
                    backgroundColor: '#333',
                    titleColor: '#fff',
                    bodyColor: '#fff',
                    displayColors: false,
                  },
                },
              }} />
            </div>
          </div>

          {/* Pie Chart Card */}
          <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <h3 className="font-bold text-xl mb-2 text-white">Safety Compliance Breakdown</h3>
            <div className="h-48">
              <Pie data={pieChartData} />
            </div>
          </div>

          {/* Bar Chart Card */}
          <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <h3 className="font-bold text-xl mb-2 text-white">Department Performance</h3>
            <div className="h-48">
              <Bar data={barChartData} />
            </div>
          </div>

          {/* Total Production */}
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <h3 className="font-bold text-xl text-white">Total Production</h3>
            <p className="text-2xl font-semibold text-white">1,500 Tons</p>
          </div>

          {/* Safety Compliance */}
          <div className="bg-gradient-to-r from-green-300 to-teal-500 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
            <h3 className="font-bold text-xl text-white">Safety Compliance</h3>
            <p className="text-2xl font-semibold text-white">95%</p>
          </div>

          {/* Map Visualization */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-500 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 col-span-2">
            <h3 className="font-bold text-xl text-white mb-2">Mine Locations</h3>
            <div className="h-96">
              <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full w-full rounded-lg shadow-xl">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {mineLocations.map((mine, index) => (
                  <Marker key={index} position={[mine.latitude, mine.longitude]}>
                    <Popup>{mine.name}</Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Maintenance Search */}
          <div className="bg-yellow-200 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-all col-span-2">
            <input
              type="text"
              placeholder="Search Maintenance"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full p-2 rounded-md ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-200'}`}
            />
            <ul className="mt-2">
              {filteredMaintenance.map((item, index) => (
                <li key={index} className="border-b py-2 text-gray-700 dark:text-white">
                  <strong>{item.task}</strong> - {item.date}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
