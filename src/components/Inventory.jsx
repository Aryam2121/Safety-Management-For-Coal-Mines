import React, { useState, useRef } from 'react';
import { useResources } from '../context/ResourceContext';
import html2canvas from 'html2canvas';
import { Button, TextField, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Pagination, InputAdornment } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';

const Inventory = () => {
  const { resources } = useResources();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const inventoryRef = useRef(null); // Reference to the inventory table

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedResources = [...filteredResources].sort((a, b) => {
    const comparison = sortOrder === 'asc' ? a.available - b.available : b.available - a.available;
    return comparison !== 0 ? comparison : a.name.localeCompare(b.name);
  });

  const totalQuantity = sortedResources.reduce((total, item) => total + item.available, 0);

  const handleSortToggle = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };

  const handleConvertToImage = () => {
    html2canvas(inventoryRef.current).then(canvas => {
      const link = document.createElement('a');
      link.download = 'inventory.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page when rows per page is changed
  };

  const displayedResources = sortedResources.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>

      {/* Search Bar */}
      <TextField
        label="Search Resources"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
        fullWidth
        InputProps={{
          startAdornment: <InputAdornment position="start">🔍</InputAdornment>,
        }}
      />

      {/* Sort and Convert Buttons */}
      <div className="mb-4 flex space-x-4">
        <Tooltip title={`Sort by Available Quantity (${sortOrder === 'asc' ? 'Ascending' : 'Descending'})`} arrow>
          <Button
            onClick={handleSortToggle}
            variant="contained"
            color="primary"
            startIcon={<SortIcon />}
            fullWidth
          >
            Sort by Quantity ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
          </Button>
        </Tooltip>

        <Tooltip title="Convert Inventory to Image" arrow>
          <Button
            onClick={handleConvertToImage}
            variant="contained"
            color="success"
            fullWidth
          >
            Convert to Image
          </Button>
        </Tooltip>
      </div>

      {/* Inventory Table */}
      <div ref={inventoryRef}>
        <TableContainer component={Paper} className="mb-4">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Resource</TableCell>
                <TableCell align="right">Available Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedResources.map((item) => (
                <TableRow
                  key={item.id}
                  hover
                  className={`${item.available < 10 ? 'bg-red-100' : ''}`}
                >
                  <TableCell>{item.name}</TableCell>
                  <TableCell align="right">{item.available}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Pagination
          count={Math.ceil(sortedResources.length / rowsPerPage)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
        />
        <div>
          <label htmlFor="rows-per-page" className="mr-2">Rows per page:</label>
          <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border rounded p-2"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      {/* Total Quantity */}
      <div className="mt-4">
        <strong>Total Quantity:</strong> {totalQuantity}
      </div>
    </div>
  );
};

export default Inventory;
