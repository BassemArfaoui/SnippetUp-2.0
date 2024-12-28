import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Notification from '../parts/Notification';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // Material-UI Icon


export default function NotificationSide() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true); // For the first loading state
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  const isInitialMount = useRef(true); // Track if it's the first render

  // Function to calculate the time since the notification
  const timeSince = (notificationTime) => {
    const now = new Date();
    const timeDiff = now - new Date(notificationTime);

    const seconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else {
      return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
    }
  };

  // Function to fetch notifications
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/notifications/1', {
        params: { limit, offset }
      });
      const newNotifications = response.data;

      if (newNotifications.length < limit) {
        setHasMore(false);
      }

      setNotifications((prevNotifications) => [
        ...prevNotifications,
        ...newNotifications
      ]);
      setOffset((prevOffset) => prevOffset + limit);
    } catch (error) {
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
      setInitialLoading(false); 
    }
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchNotifications(); 
    }
  }, []); 

  if (initialLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0">
      <div className="ps-2">
        <div
          className="p-4 notification-side primary-scrollbar"
          style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}
        >
          {notifications.map((notification) => (
            <Notification
              key={notification.id}
              type={notification.type}
              title={notification.post_title || 'No title'}
              time={timeSince(notification.time)} 
              fromFullname={notification.from_firstname + ' ' + notification.from_lastname}
            />
          ))}

          {loading && !initialLoading && (
            <div className="d-flex justify-content-center my-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {hasMore && !loading && (
            <div className="d-flex justify-content-center my-0">
              <IconButton onClick={fetchNotifications} aria-label="Load More">
                <ExpandMoreIcon  className='text-primary ' style={{fontSize:'62px'}} />
              </IconButton>
            </div>
          )}

          {error && <div>{error}</div>}
        </div>
      </div>
    </div>
  );
}
