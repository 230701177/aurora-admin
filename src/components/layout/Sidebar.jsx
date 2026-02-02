import { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Database,
  Activity,
  FileText,
  Wrench,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  TrendingUp
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('');

  useEffect(() => {
    const currentPath = location.pathname;
    const page = currentPath.split('/')[1] || 'dashboard';
    setActivePage(page);
  }, [location]);

  const navItems = [
    {
      id: 'dashboard',
      path: '/',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      badge: null,
      exact: true
    },
    {
      id: 'services',
      path: '/services',
      icon: <Wrench size={20} />,
      label: 'Services',
      badge: '12',
      exact: false
    },
    {
      id: 'logs',
      path: '/logs',
      icon: <FileText size={20} />,
      label: 'Logs',
      badge: null,
      exact: false
    },
    {
      id: 'resources',
      path: '/resources',
      icon: <Activity size={20} />,
      label: 'Resources',
      badge: null,
      exact: false
    },
    {
      id: 'storage',
      path: '/storage',
      icon: <Database size={20} />,
      label: 'Storage',
      badge: null,
      exact: false
    },
    {
      id: 'security',
      path: '/security',
      icon: <ShieldCheck size={20} />,
      label: 'Security',
      badge: '2',
      exact: false
    },
    {
      id: 'settings',
      path: '/settings',
      icon: <Settings size={20} />,
      label: 'Settings',
      badge: null,
      exact: false
    }
  ];

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Animated Background */}
      <div className="sidebar-gradient"></div>

      {/* Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon-wrapper">
            <Sparkles className="logo-icon" size={28} />
            <div className="logo-icon-glow"></div>
          </div>
          {!collapsed && (
            <div className="logo-text-wrapper">
              <span className="logo-text">AURORA</span>
              <span className="logo-subtitle">Control Panel</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="collapse-btn"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Quick Stats (when expanded) */}
      {!collapsed && (
        <div className="sidebar-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <TrendingUp size={16} />
            </div>
            <div className="stat-content">
              <span className="stat-value">98.5%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Zap size={16} />
            </div>
            <div className="stat-content">
              <span className="stat-value">24ms</span>
              <span className="stat-label">Response</span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section">
          {!collapsed && <div className="nav-section-title">Main Menu</div>}
          {navItems.map((item) => {
            const isActive = activePage === item.id;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.exact}
                className={({ isActive: isNavActive }) =>
                  `nav-item ${isNavActive ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`
                }
                title={collapsed ? item.label : ''}
              >
                <div className="nav-item-content">
                  <div className="nav-icon">{item.icon}</div>
                  {!collapsed && (
                    <>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && (
                        <span className="nav-badge">{item.badge}</span>
                      )}
                    </>
                  )}
                </div>
                {isActive && <div className="nav-indicator"></div>}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        {!collapsed && (
          <div className="footer-status">
            <div className="status-indicator online"></div>
            <div className="status-info">
              <span className="status-title">System Status</span>
              <span className="status-value">All Systems Operational</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="footer-status-collapsed">
            <div className="status-indicator online"></div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
