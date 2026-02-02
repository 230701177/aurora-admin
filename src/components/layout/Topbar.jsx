import { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import useAuth from '../../hooks/useAuth';
import {
  Clock,
  LogOut,
  Bell,
  User,
  Shield,
  Activity,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Database,
  FileText,
  Wrench,
  Menu,
  X,
  Edit2,
  Check
} from 'lucide-react';
import './Topbar.css';

const Topbar = () => {
  const location = useLocation();
  const { settings } = useSettings();
  const { user, updateUser, logout } = useAuth();
  const [currentTime, setCurrentTime] = useState({ time: '', date: '' });
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');

  // Update temp name when user data loads/changes
  useEffect(() => {
    if (user?.name) {
      setNewName(user.name);
    } else {
      setNewName('Administrator');
    }
  }, [user]);

  const handleSaveName = () => {
    if (newName.trim()) {
      updateUser({ name: newName });
      setIsEditingName(false);
      setShowUserMenu(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setShowUserMenu(false);
    setNewName(user?.name || 'Administrator');
  };

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: settings?.timeFormat === '12h'
      });
      const dateString = now.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      setCurrentTime({ time: timeString, date: dateString });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [settings?.timeFormat]);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
    { path: '/services', icon: <Wrench size={18} />, label: 'Services' },
    { path: '/logs', icon: <FileText size={18} />, label: 'Logs' },
    { path: '/resources', icon: <Activity size={18} />, label: 'Resources' },
    { path: '/storage', icon: <Database size={18} />, label: 'Storage' },
    { path: '/security', icon: <ShieldCheck size={18} />, label: 'Security' },
    { path: '/settings', icon: <Settings size={18} />, label: 'Settings' },
  ];

  return (
    <>
      <header className="topbar">
        {/* Animated Background Gradient */}
        <div className="topbar-gradient"></div>

        {/* Left Section */}
        <div className="topbar-left">
          {/* Logo & Brand */}
          <div className="topbar-brand">
            <div className="brand-icon">
              <Shield size={24} />
              <div className="brand-icon-glow"></div>
            </div>
            <div className="brand-text">
              <span className="brand-name">AURORA</span>
              <span className="brand-tagline">Admin Console</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="topbar-nav desktop-nav">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Section */}
        <div className="topbar-right">
          {/* Time Display */}
          <div className="topbar-time">
            <Clock size={16} className="time-icon" />
            <div className="time-content">
              <span className="time-value">{currentTime.time}</span>
              <span className="time-date">{currentTime.date}</span>
            </div>
          </div>

          {/* Notifications */}
          <div className="topbar-notifications">
            <button
              className="notification-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={30} />
              <span className="notification-badge">3</span>
            </button>

            {showNotifications && (
              <>
                <div
                  className="notification-overlay"
                  onClick={() => setShowNotifications(false)}
                ></div>
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h4>Notifications</h4>
                    <span className="notification-count">3 new</span>
                  </div>
                  <div className="notification-list">
                    <div className="notification-item unread">
                      <div className="notification-icon success">
                        <Shield size={16} />
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">Security Update</p>
                        <p className="notification-text">System security patches applied successfully</p>
                        <span className="notification-time">2 minutes ago</span>
                      </div>
                    </div>
                    <div className="notification-item unread">
                      <div className="notification-icon warning">
                        <Activity size={16} />
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">High CPU Usage</p>
                        <p className="notification-text">Server CPU usage exceeded 80%</p>
                        <span className="notification-time">15 minutes ago</span>
                      </div>
                    </div>
                    <div className="notification-item unread">
                      <div className="notification-icon info">
                        <Database size={16} />
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">Backup Completed</p>
                        <p className="notification-text">Daily backup finished successfully</p>
                        <span className="notification-time">1 hour ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="topbar-user">
            <button
              className="user-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                <User size={16} />
              </div>
              <span className="user-name">{user?.name || 'Admin'}</span>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="user-menu-overlay"
                  onClick={() => setShowUserMenu(false)}
                ></div>
                <div className="user-dropdown">
                  <div className="user-dropdown-header">
                    <div className="user-avatar large">
                      <User size={24} />
                    </div>
                    <div className="user-info">
                      {isEditingName ? (
                        <div className="user-name-edit">
                          <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="user-name-input"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveName();
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button onClick={(e) => { e.stopPropagation(); handleSaveName(); }} className="action-btn save" title="Save">
                            <Check size={16} />
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }} className="action-btn cancel" title="Cancel">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <div className="user-name-display">
                          <p className="user-fullname">{user?.name || 'Administrator'}</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); setIsEditingName(true); }}
                            className="edit-name-btn"
                            title="Edit Name"
                          >
                            <Edit2 size={12} />
                          </button>
                        </div>
                      )}
                      <p className="user-email">{user?.email || 'admin@aurora.com'}</p>
                    </div>
                  </div>
                  <div className="user-dropdown-items">
                    {/* Links removed to show "details only" */}
                    <div className="user-dropdown-item" style={{ cursor: 'default', opacity: 0.7 }}>
                      <Shield size={16} />
                      <span>Role: {user?.role || 'Administrator'}</span>
                    </div>

                    <div className="user-dropdown-divider"></div>
                    <button onClick={handleLogout} className="user-dropdown-item danger">
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="topbar-logout"
            title="Logout"
          >
            <LogOut size={24} />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      {showMobileMenu && (
        <div className="mobile-nav-overlay" onClick={() => setShowMobileMenu(false)}>
          <nav className="mobile-nav" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-nav-header">
              <h3>Navigation</h3>
              <button onClick={() => setShowMobileMenu(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="mobile-nav-items">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `mobile-nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={() => setShowMobileMenu(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal">
          <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}></div>
          <div className="modal-content">
            <div className="modal-icon">
              <LogOut size={32} />
            </div>
            <h3 className="modal-title">Confirm Logout</h3>
            <p className="modal-text">
              Are you sure you want to logout from the Aurora admin panel?
            </p>
            <div className="modal-actions">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="modal-btn modal-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="modal-btn modal-confirm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
