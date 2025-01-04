import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AiOutlineWarning, AiOutlineExclamationCircle } from 'react-icons/ai';
import { FiCheckCircle } from 'react-icons/fi';
import { MdDeleteForever } from 'react-icons/md';

const Alerts = () => {
    const [alerts, setAlerts] = useState([]);
    const [message, setMessage] = useState('');
    const [type, setType] = useState('warning');
    const [createdBy, setCreatedBy] = useState('60d5f84f5b5f5c4d7b8f5d1b');
    const [resolved, setResolved] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                setLoading(true);
                const res = await axios.get('http://localhost:5000/api/alerts/getallalerts', {
                    params: {
                        type,
                        resolved,
                        page,
                        limit: 10,
                        sort: '-timestamp',
                    }
                });
                setAlerts(res.data.alerts);
                setTotalPages(res.data.totalPages);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setToast({ type: 'error', message: 'Failed to fetch alerts. Please try again later.' });
                console.error('Error fetching alerts:', error);
            }
        };
        fetchAlerts();
    }, [type, resolved, page]);

    const handleAddAlert = async () => {
        try {
            const newAlert = { message, type, createdBy };
            const res = await axios.post('http://localhost:5000/api/alerts/addAlert', newAlert);
            setAlerts([res.data, ...alerts]);
            setMessage('');
            setType('warning');
            setShowModal(false);
            setToast({ type: 'success', message: 'Alert added successfully!' });
        } catch (error) {
            setToast({ type: 'error', message: 'Error adding alert. Please try again.' });
            console.error('Error adding alert:', error);
        }
    };

    const handleResolveAlert = async (Id, resolvedBy) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/alerts/resolveAlert/${Id}`, { resolvedBy });
            console.log('Alert resolved:', response.data);
            setAlerts(alerts.map(alert => alert._id === Id ? { ...alert, resolved: true } : alert));
        } catch (error) {
            console.error('Error resolving alert:', error);
            setToast({ type: 'error', message: 'Failed to resolve alert. Please try again.' });
        }
    };

    const handleDeleteAlert = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/alerts/deleteAlert/${id}`);
            setAlerts(alerts.filter(alert => alert._id !== id));
            setToast({ type: 'success', message: 'Alert deleted successfully!' });
        } catch (error) {
            setToast({ type: 'error', message: 'Error deleting alert. Please try again.' });
            console.error('Error deleting alert:', error);
        }
    };

    const handleMarkAllResolved = async () => {
        try {
            await axios.put('http://localhost:5000/api/alerts/resolveAllAlerts');
            setAlerts(alerts.map(alert => ({ ...alert, resolved: true })));
            setToast({ type: 'success', message: 'All alerts resolved successfully!' });
        } catch (error) {
            setToast({ type: 'error', message: 'Error resolving all alerts.' });
            console.error('Error resolving all alerts:', error);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 rounded-lg shadow-lg">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-5 right-5 px-4 py-2 rounded-md text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'} shadow-lg transition-all duration-300 transform scale-90`}>
                    {toast.message}
                </div>
            )}

            <h2 className="text-3xl font-semibold mb-6 text-gray-800">Real-time Safety Alerts</h2>

            {/* Add New Alert Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96 transition-all transform scale-95">
                        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Alert</h3>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter alert message"
                            className="border p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="border p-3 mb-4 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="warning">Warning</option>
                            <option value="critical">Critical</option>
                        </select>
                        <div className="flex justify-between items-center">
                            <button
                                onClick={handleAddAlert}
                                className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Add Alert
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Alert Button */}
            <div className="mb-6 p-6 bg-white rounded-lg shadow-md transition duration-300 transform hover:scale-105 cursor-pointer">
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    Add New Alert
                </button>
            </div>

            {/* Mark All as Resolved */}
            <div className="mb-6 p-6 bg-white rounded-lg shadow-md transition duration-300 transform hover:scale-105 cursor-pointer">
                <button
                    onClick={handleMarkAllResolved}
                    className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200"
                >
                    Mark All as Resolved
                </button>
            </div>

            {/* Filter and Pagination */}
            <div className="flex items-center justify-between mb-6 space-x-4">
                <div className="flex items-center space-x-4">
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="border p-3 rounded-lg w-32 focus:ring-2 focus:ring-blue-400 bg-white hover:bg-gray-50 transition duration-200"
                    >
                        <option value="warning">Warning</option>
                        <option value="critical">Critical</option>
                    </select>

                    <select
                        value={resolved}
                        onChange={(e) => setResolved(e.target.value === 'all' ? null : e.target.value === 'true')}
                        className="border p-3 rounded-lg w-32 focus:ring-2 focus:ring-blue-400 bg-white hover:bg-gray-50 transition duration-200"
                    >
                        <option value="all">All</option>
                        <option value="true">Resolved</option>
                        <option value="false">Unresolved</option>
                    </select>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center space-x-4">
                    <button
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                        className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition duration-200"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700 font-medium">Page {page} of {totalPages}</span>
                    <button
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                        className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition duration-200"
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Alert List */}
            {loading ? (
                <div className="flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                </div>
            ) : (
                <ul className="space-y-4">
                    {alerts.map((alert) => (
                        <li key={alert._id} className={`flex justify-between items-center p-6 mb-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ${alert.resolved ? 'bg-green-100' : 'bg-yellow-100'}`}>
                            <div className="flex items-center space-x-4">
                                <div className={`text-2xl ${alert.type === 'critical' ? 'text-red-600' : 'text-yellow-600'}`}>
                                    {alert.type === 'critical' ? <AiOutlineExclamationCircle /> : <AiOutlineWarning />}
                                </div>
                                <div>
                                    <p className="font-semibold">{alert.type.toUpperCase()}:</p>
                                    <p>{alert.message}</p>
                                    <p className="text-sm text-gray-600">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                                    <p className="text-sm text-gray-600">Created By: {alert.createdBy}</p>
                                    {alert.resolved && (
                                        <p className="text-sm text-green-600 mt-2">Resolved at: {new Date(alert.resolvedAt).toLocaleTimeString()}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex space-x-4">
                                {!alert.resolved && (
                                    <button
                                        onClick={() => handleResolveAlert(alert._id, 'admin')}
                                        className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200"
                                        title="Resolve Alert"
                                    >
                                        <FiCheckCircle className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDeleteAlert(alert._id)}
                                    className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-200"
                                    title="Delete Alert"
                                >
                                    <MdDeleteForever className="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Alerts;
