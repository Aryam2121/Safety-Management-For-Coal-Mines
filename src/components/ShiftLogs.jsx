import React, { useState, useEffect } from 'react';
import axios from '../services/axios';
import { useDropzone } from 'react-dropzone';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'react-datepicker/dist/react-datepicker.css';

const ShiftHandoverLog = () => {
  const [logData, setLogData] = useState({
    shiftDetails: '',
    safetyIssues: '',
    nextShiftTasks: '',
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [previousLogs, setPreviousLogs] = useState([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState('Auto-saving every minute...');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPreviousLogs = async () => {
      try {
        const response = await axios.get('/previous-logs');
        setPreviousLogs(response.data);
      } catch (error) {
        console.error('Error fetching previous logs:', error);
      }
    };

    fetchPreviousLogs();
  }, []);

  useEffect(() => {
    const autoSave = setInterval(() => {
      localStorage.setItem('shiftHandoverLogData', JSON.stringify(logData));
      setAutoSaveStatus('Auto-saved at ' + new Date().toLocaleTimeString());
    }, 60000); // Auto-save every minute

    return () => clearInterval(autoSave);
  }, [logData]);

  const handleInputChange = (e) => {
    setLogData({ ...logData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setFilePreview(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*,application/pdf',
    onDrop: handleFileChange,
  });

  const handleNotesChange = (e) => {
    setAdditionalNotes(e.target.value);
  };

  const submitLog = async () => {
    const formData = new FormData();
    formData.append('shiftDetails', logData.shiftDetails);
    formData.append('safetyIssues', logData.safetyIssues);
    formData.append('nextShiftTasks', logData.nextShiftTasks);
    formData.append('additionalNotes', additionalNotes);
    if (file) {
      formData.append('file', file);
    }

    setLoading(true);
    setErrorMessage('');
    setUploadProgress(0);
    setUploading(true);

    try {
      await axios.post('/shift-logs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      alert('Log submitted successfully!');
      setLogData({ shiftDetails: '', safetyIssues: '', nextShiftTasks: '' });
      setFile(null);
      setFilePreview(null);
      setAdditionalNotes('');
      setUploadProgress(0);
    } catch (error) {
      console.error('Error submitting log:', error);
      setErrorMessage('Failed to submit log. Please try again.');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to submit this log?')) {
      submitLog();
    }
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Shift Handover Log</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="shiftDetails" className="text-lg font-medium text-gray-700">Shift Details</label>
          <textarea
            id="shiftDetails"
            name="shiftDetails"
            value={logData.shiftDetails}
            onChange={handleInputChange}
            rows="4"
            className="block w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            placeholder="Enter shift details..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="safetyIssues" className="text-lg font-medium text-gray-700">Safety Issues</label>
          <textarea
            id="safetyIssues"
            name="safetyIssues"
            value={logData.safetyIssues}
            onChange={handleInputChange}
            rows="4"
            className="block w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            placeholder="Enter safety issues..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="nextShiftTasks" className="text-lg font-medium text-gray-700">Next Shift Tasks</label>
          <textarea
            id="nextShiftTasks"
            name="nextShiftTasks"
            value={logData.nextShiftTasks}
            onChange={handleInputChange}
            rows="4"
            className="block w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            placeholder="Enter tasks for the next shift..."
          ></textarea>
        </div>

        <div>
          <label htmlFor="additionalNotes" className="text-lg font-medium text-gray-700">Additional Notes</label>
          <textarea
            id="additionalNotes"
            name="additionalNotes"
            value={additionalNotes}
            onChange={handleNotesChange}
            rows="4"
            className="block w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            placeholder="Add any additional notes (optional)..."
          ></textarea>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <div {...getRootProps()} className="p-6 border-dashed border-2 border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-100">
            <input {...getInputProps()} />
            <p className="text-gray-600">Drag & drop a file here, or click to select one (Image/PDF)</p>
            {filePreview && <img src={filePreview} alt="Preview" className="mt-4 max-w-full h-auto" />}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
        >
          {loading ? 'Submitting...' : 'Submit Log'}
        </button>

        {/* Error Message */}
        {errorMessage && <p className="text-red-600 mt-4 text-center">{errorMessage}</p>}

        {/* Upload Progress */}
        {uploading && (
          <div className="mt-4">
            <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
          </div>
        )}
      </form>

      {/* Auto-Save Status */}
      <div className="mt-6 text-sm text-gray-600 text-center">{autoSaveStatus}</div>

      {/* Previous Logs Section */}
      <div className="mt-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-800">Previous Shift Logs</h3>
        {previousLogs.length > 0 ? (
          <ul>
            {previousLogs.map((log, index) => (
              <li key={index} className="p-4 border border-gray-300 rounded-lg shadow-sm">
                <p><strong>Shift Details:</strong> {log.shiftDetails}</p>
                <p><strong>Safety Issues:</strong> {log.safetyIssues}</p>
                <p><strong>Next Shift Tasks:</strong> {log.nextShiftTasks}</p>
                <p><strong>Additional Notes:</strong> {log.additionalNotes}</p>
                {log.file && <a href={log.file} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Attached File</a>}
              </li>
            ))}
          </ul>
        ) : (
          <p>No previous logs available.</p>
        )}
      </div>
    </div>
  );
};

export default ShiftHandoverLog;
