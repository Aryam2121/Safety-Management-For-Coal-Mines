import React, { useState, useEffect } from 'react';
import axios from '../services/axios';
import { useDropzone } from 'react-dropzone';
import ProgressBar from 'react-bootstrap/ProgressBar';
import 'react-datepicker/dist/react-datepicker.css';
import { Editor } from '@tinymce/tinymce-react';
import { CircularProgress } from '@mui/material';

const SafetyManagementPlan = () => {
  const [smpData, setSmpData] = useState([{ riskAssessment: '', controlMeasures: '', riskLevel: '', priority: '', progress: 0 }]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index, e) => {
    const newSmpData = [...smpData];
    newSmpData[index][e.target.name] = e.target.value;
    setSmpData(newSmpData);
  };

  const handleFileChange = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setFilePreview(URL.createObjectURL(acceptedFiles[0]));
    }
  };

  const addMoreFields = () => {
    setSmpData([...smpData, { riskAssessment: '', controlMeasures: '', riskLevel: '', priority: '', progress: 0 }]);
  };

  const removeFields = (index) => {
    if (window.confirm('Are you sure you want to remove this field?')) {
      const newSmpData = smpData.filter((_, i) => i !== index);
      setSmpData(newSmpData);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*,application/pdf',
    onDrop: handleFileChange,
  });

  const handleProgressChange = (index, value) => {
    const newSmpData = [...smpData];
    newSmpData[index].progress = value;
    setSmpData(newSmpData);
  };

  const validateForm = () => {
    for (const item of smpData) {
      if (!item.riskAssessment || !item.controlMeasures || !item.riskLevel || !item.priority) {
        return false;
      }
    }
    return true;
  };

  const submitSMP = async () => {
    if (!validateForm()) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('smpData', JSON.stringify(smpData));
    if (file) {
      formData.append('file', file);
    }

    setLoading(true);

    try {
      await axios.post('/safety-plan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccessMessage('Safety Management Plan submitted successfully!');
      setErrorMessage('');
      setIsDraftSaved(false); // Clear draft status
    } catch (error) {
      console.error('Error submitting SMP:', error);
      setErrorMessage('Error submitting Safety Management Plan. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const saveDraft = () => {
    localStorage.setItem('smpDraft', JSON.stringify(smpData));
    setIsDraftSaved(true);
  };

  const loadDraft = () => {
    const draft = localStorage.getItem('smpDraft');
    if (draft) {
      setSmpData(JSON.parse(draft));
      setIsDraftSaved(true);
    }
  };

  useEffect(() => {
    loadDraft();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">Safety Management Plan</h2>

      {successMessage && <div className="bg-green-100 text-green-800 p-4 rounded mb-4">{successMessage}</div>}
      {errorMessage && <div className="bg-red-100 text-red-800 p-4 rounded mb-4">{errorMessage}</div>}
      {isDraftSaved && <div className="bg-yellow-100 text-yellow-800 p-4 rounded mb-4">Draft saved successfully!</div>}

      <form onSubmit={(e) => { e.preventDefault(); submitSMP(); }}>

        {smpData.map((item, index) => (
          <div key={index} className="mb-6 p-6 border border-gray-200 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Risk Assessment #{index + 1}</h3>

            <Editor
              apiKey="y85cli9lxbiruvszifm8p7ba3fflegj7wfu377wdbpt3f7rg"
              value={item.riskAssessment}
              init={{ height: 150 }}
              onEditorChange={(content) => handleInputChange(index, { target: { name: 'riskAssessment', value: content } })}
              className="mb-4"
            />

            <Editor
              apiKey="y85cli9lxbiruvszifm8p7ba3fflegj7wfu377wdbpt3f7rg"
              value={item.controlMeasures}
              init={{ height: 150 }}
              onEditorChange={(content) => handleInputChange(index, { target: { name: 'controlMeasures', value: content } })}
              className="mb-4"
            />

            <label className="block text-lg font-medium mb-2">Risk Level</label>
            <select name="riskLevel" value={item.riskLevel} onChange={(e) => handleInputChange(index, e)} className="block w-full p-3 border rounded-lg mb-4">
              <option value="">Select Risk Level</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <label className="block text-lg font-medium mb-2">Priority</label>
            <select name="priority" value={item.priority} onChange={(e) => handleInputChange(index, e)} className="block w-full p-3 border rounded-lg mb-4">
              <option value="">Select Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <label className="block text-lg font-medium mb-2">Progress</label>
            <ProgressBar now={item.progress} label={`${item.progress}%`} className="mb-4" />
            <input
              type="range"
              min="0"
              max="100"
              value={item.progress}
              onChange={(e) => handleProgressChange(index, e.target.value)}
              className="w-full mb-4"
            />

            <button type="button" onClick={() => removeFields(index)} className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2 hover:bg-red-600 transition-colors">Remove</button>
          </div>
        ))}

        <button type="button" onClick={addMoreFields} className="bg-blue-500 text-white px-6 py-2 rounded-lg mb-4 hover:bg-blue-600 transition-colors">Add More</button>

        <div {...getRootProps({ className: 'dropzone p-6 border-2 border-dashed border-gray-300 rounded-lg mb-4 cursor-pointer' })}>
          <input {...getInputProps()} />
          <p className="text-center text-lg font-medium">Drag & drop a file here, or click to select one</p>
          {filePreview && file.type.startsWith('image/') && <img src={filePreview} alt="Preview" className="mt-4 max-w-full h-auto" />}
          {filePreview && file.type.startsWith('application/pdf') && <iframe src={filePreview} title="PDF Preview" className="mt-4 w-full h-64" />}
        </div>

        <div className="flex justify-between mb-4">
          <button type="button" onClick={saveDraft} className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors">Save Draft</button>
          <button type="submit" disabled={loading} className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-500">
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit SMP'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SafetyManagementPlan;
