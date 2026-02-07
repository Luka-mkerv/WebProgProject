import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications/${userId}`);
      setNotifications(res.data);
      const unread = res.data.filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axios.put(`${API_URL}/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/notifications/${userId}/read-all`);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await axios.delete(`${API_URL}/notifications/${notificationId}`);
      fetchNotifications();
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const Icon = {
    Bell: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z" fill="#102a43"/>
        <path d="M18 16v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 10-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.99 2A1 1 0 005 20h14a1 1 0 00.99-1.01L18 16z" fill="#0066ff"/>
      </svg>
    ),
    Clipboard: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2H8a2 2 0 00-2 2v1h12V4a2 2 0 00-2-2z" fill="#00d4ff"/>
        <path d="M6 7v13a2 2 0 002 2h8a2 2 0 002-2V7H6z" fill="#fff" stroke="#cbd5e1"/>
      </svg>
    ),
    Mail: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2z" fill="#fff" stroke="#cbd5e1"/>
        <path d="M4 6l8 7 8-7" stroke="#0066ff" strokeWidth="1.2" fill="none"/>
      </svg>
    ),
    Check: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17l-5-5" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    Cross: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18M6 6l12 12" stroke="#e74c3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'shift':
        return Icon.Clipboard;
      case 'request':
        return Icon.Mail;
      case 'approval':
        return Icon.Check;
      default:
        return Icon.Bell;
    }
  };

  return (
    <div className="notification-bell-container">
      <button
        className="notification-bell"
        onClick={() => setShowDropdown(!showDropdown)}
        title="Notifications"
        aria-label="Notifications"
      >
        <span style={{display:'inline-flex',alignItems:'center',gap:8}}>{Icon.Bell}</span>
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications yet</div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && handleMarkAsRead(notification._id)}
                >
                  <div className="notification-content">
                    <span className="notification-icon" style={{display:'inline-flex',alignItems:'center'}}>{getNotificationIcon(notification.type)}</span>
                    <div className="notification-text">
                      <p>{notification.message}</p>
                      <span className="notification-time">
                        {new Date(notification.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button
                    className="notification-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification._id);
                    }}
                    aria-label="Delete notification"
                  >
                    {Icon.Cross}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
