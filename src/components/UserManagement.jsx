import React, { useEffect, useState } from 'react';
import axios from '../services/axios';
import Modal from 'react-modal'; // Ensure react-modal is installed

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', role: 'Worker', email: '' });
  const [editUser, setEditUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [userDetailModalOpen, setUserDetailModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleBulkAction = async () => {
    try {
      // Example: Bulk activation/deactivation
      await axios.post('/users/bulk-action', { action: bulkAction, userIds: users.map(user => user.id) });
      // Refresh users list
      const response = await axios.get('/users');
      setUsers(response.data);
      setBulkAction('');
    } catch (error) {
      console.error('Error performing bulk action:', error);
    }
  };

  const addUser = async () => {
    try {
      await axios.post('/users', newUser);
      setNewUser({ username: '', role: 'Worker', email: '' });
      // Refresh users list
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const updateUser = async (id) => {
    try {
      await axios.put(`/users/${id}`, editUser);
      setEditUser(null);
      // Refresh users list
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/users/${id}`);
      // Refresh users list
      const response = await axios.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setUserDetailModalOpen(true);
  };

  const closeUserDetailModal = () => {
    setUserDetailModalOpen(false);
    setSelectedUser(null);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={handleSearch}
          className="block w-full p-2 border mb-4"
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleInputChange}
          className="block w-full p-2 border mb-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleInputChange}
          className="block w-full p-2 border mb-2"
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleInputChange}
          className="block w-full p-2 border mb-2"
        >
          <option value="Admin">Admin</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Worker">Worker</option>
        </select>
        <button
          onClick={addUser}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add User
        </button>
      </div>

      {editUser && (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Edit User</h3>
          <input
            type="text"
            name="username"
            value={editUser.username}
            onChange={handleEditChange}
            className="block w-full p-2 border mb-2"
          />
          <input
            type="email"
            name="email"
            value={editUser.email}
            onChange={handleEditChange}
            className="block w-full p-2 border mb-2"
          />
          <select
            name="role"
            value={editUser.role}
            onChange={handleEditChange}
            className="block w-full p-2 border mb-2"
          >
            <option value="Admin">Admin</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Worker">Worker</option>
          </select>
          <button
            onClick={() => updateUser(editUser.id)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update User
          </button>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Existing Users</h3>
        <ul>
          {currentUsers.map((user) => (
            <li key={user.id} className="mb-2 p-2 border-b flex justify-between items-center">
              {user.username} - {user.role}
              <div>
                <button
                  onClick={() => viewUserDetails(user)}
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                >
                  View Details
                </button>
                <button
                  onClick={() => setEditUser(user)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteUser(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <Pagination
          usersPerPage={usersPerPage}
          totalUsers={filteredUsers.length}
          paginate={paginate}
          currentPage={currentPage}
        />
      </div>

      {/* User Details Modal */}
      <Modal
        isOpen={userDetailModalOpen}
        onRequestClose={closeUserDetailModal}
        contentLabel="User Details"
        className="Modal"
        overlayClassName="Overlay"
      >
        {selectedUser && (
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">User Details</h3>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <button
              onClick={closeUserDetailModal}
              className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
            >
              Close
            </button>
          </div>
        )}
      </Modal>

      {/* Bulk Actions */}
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-2">Bulk Actions</h3>
        <select
          value={bulkAction}
          onChange={(e) => setBulkAction(e.target.value)}
          className="block w-full p-2 border mb-2"
        >
          <option value="">Select Action</option>
          <option value="activate">Activate</option>
          <option value="deactivate">Deactivate</option>
        </select>
        <button
          onClick={handleBulkAction}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

const Pagination = ({ usersPerPage, totalUsers, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-center">
        {pageNumbers.map(number => (
          <li key={number} className="mx-1">
            <button
              onClick={() => paginate(number)}
              className={`px-4 py-2 border rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default UserManagement;
