import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  TableSortLabel,
  IconButton,
  Tooltip,
  Grid,
  Pagination,
  Chip
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const mockAuditLogs = [
  { id: 1, user: 'John Doe', action: 'Login', timestamp: '2024-09-20 12:34:56', details: 'User logged into the system.' },
  { id: 2, user: 'Jane Smith', action: 'Create Project', timestamp: '2024-09-20 14:12:45', details: 'New project "Coal Mine Safety" created.' },
  // More logs...
];

const AuditLog = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setLogs(mockAuditLogs);
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filteredLogs = mockAuditLogs.filter((log) =>
      log.user.toLowerCase().includes(value.toLowerCase()) ||
      log.action.toLowerCase().includes(value.toLowerCase()) ||
      log.details.toLowerCase().includes(value.toLowerCase())
    );
    setLogs(filteredLogs);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setLogs(mockAuditLogs);
  };

  const handleSort = (field) => {
    const direction = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(direction);
    const sortedLogs = [...logs].sort((a, b) => {
      if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setLogs(sortedLogs);
  };

  const handleFilter = (action) => {
    setFilter(action);
    if (action) {
      const filteredLogs = mockAuditLogs.filter((log) => log.action === action);
      setLogs(filteredLogs);
    } else {
      setLogs(mockAuditLogs);
    }
  };

  const handleClearFilter = () => {
    setFilter('');
    setLogs(mockAuditLogs);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page when rows per page changes
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Audit Log
      </Typography>

      <Grid container spacing={3} justifyContent="space-between" alignItems="center" style={{ marginBottom: '20px' }}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={handleSearch}
            InputProps={{
              endAdornment: searchTerm ? (
                <IconButton onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              ) : (
                <SearchIcon />
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} md={6} style={{ textAlign: 'right' }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClearFilter}
            style={{ marginLeft: '8px' }}
          >
            Clear Filters
          </Button>
          <Tooltip title="Filter by action">
            <IconButton onClick={() => handleFilter(filter ? '' : 'Login')}>
              <FilterListIcon color={filter ? 'primary' : 'inherit'} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active
                  direction={sortDirection}
                  onClick={() => handleSort('user')}
                >
                  User
                </TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
              <TableCell>
                <TableSortLabel
                  active
                  direction={sortDirection}
                  onClick={() => handleSort('timestamp')}
                >
                  Timestamp
                </TableSortLabel>
              </TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.slice((page - 1) * rowsPerPage, page * rowsPerPage).map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.details}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={2} justifyContent="flex-end" style={{ marginTop: '20px' }}>
        <Grid item>
          <Pagination
            count={Math.ceil(logs.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            color="primary"
          />
        </Grid>

        <Grid item>
          <TextField
            select
            label="Rows per page"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            variant="outlined"
            size="small"
            SelectProps={{
              native: true,
            }}
          >
            {[5, 10, 25].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AuditLog;
