import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Tooltip,
  Divider,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import MarkAsUnreadIcon from '@mui/icons-material/MarkAsUnread';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

// Generate random notification messages
const randomMessages = [
  'New message received!',
  'System update completed.',
  'New comment on your post.',
  'Warning: Server overload detected!',
  'User X joined the system.',
  'Your password will expire soon.',
  'Critical error: Database connection lost.',
  'Maintenance scheduled for tomorrow.',
  'Low disk space on server.',
  'New friend request from John.',
];

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate random notifications arriving every 3 seconds
    const intervalId = setInterval(() => {
      const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
      const newNotification = {
        id: Date.now() + Math.random(), // Unique ID
        message: randomMessage,
        read: false,
        timestamp: Date.now(),
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }, 3000); // New notification every 3 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: false } : notification
      )
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const handleBulkAction = (action) => {
    if (action === 'read') {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, read: true }))
      );
    } else if (action === 'unread') {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, read: false }))
      );
    } else if (action === 'delete') {
      setNotifications([]);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'read') return notification.read;
    if (filter === 'unread') return !notification.read;
    return true;
  });

  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Notifications
      </Typography>

      {/* Filter buttons */}
      <div style={{ marginBottom: '20px' }}>
        <Button
          variant={filter === 'all' ? 'contained' : 'outlined'}
          onClick={() => setFilter('all')}
          style={{ margin: '5px' }}
        >
          All
        </Button>
        <Button
          variant={filter === 'unread' ? 'contained' : 'outlined'}
          onClick={() => setFilter('unread')}
          style={{ margin: '5px' }}
        >
          Unread
        </Button>
        <Button
          variant={filter === 'read' ? 'contained' : 'outlined'}
          onClick={() => setFilter('read')}
          style={{ margin: '5px' }}
        >
          Read
        </Button>
      </div>

      {/* Bulk actions */}
      <Button variant="outlined" onClick={() => handleBulkAction('delete')} color="error">
        Delete All
      </Button>

      {/* Notification list */}
      {filteredNotifications.length === 0 ? (
        <Alert severity="info">No notifications available</Alert>
      ) : (
        <List>
          {filteredNotifications.map((notification) => (
            <React.Fragment key={notification.id}>
              <ListItem
                style={{
                  backgroundColor: notification.read ? '#f5f5f5' : '#fff',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <Badge
                  color="secondary"
                  variant="dot"
                  invisible={notification.read}
                >
                  <ListItemText
                    primary={notification.message}
                    secondary={`Received: ${new Date(notification.timestamp).toLocaleString()}`}
                  />
                </Badge>
                <Tooltip title="Mark as Read">
                  <IconButton
                    onClick={() =>
                      notification.read
                        ? markAsUnread(notification.id)
                        : markAsRead(notification.id)
                    }
                  >
                    {notification.read ? (
                      <MarkAsUnreadIcon color="primary" />
                    ) : (
                      <MarkEmailReadIcon color="secondary" />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Notification">
                  <IconButton onClick={() => deleteNotification(notification.id)}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </Container>
  );
};

export default Notifications;
