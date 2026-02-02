// ...Logs page...
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

const Logs = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filters, setFilters] = useState({
    service: 'all',
    level: 'all',
    search: '',
  });
  const logContainerRef = useRef(null);
  const [services] = useState([
    { id: 'all', name: 'All Services' },
    { id: 'nginx', name: 'Nginx' },
    { id: 'postgres', name: 'PostgreSQL' },
    { id: 'redis', name: 'Redis' },
    { id: 'app', name: 'Application' },
    { id: 'system', name: 'System' },
  ]);
  const [levels] = useState([
    { id: 'all', name: 'All Levels' },
    { id: 'error', name: 'Errors' },
    { id: 'warn', name: 'Warnings' },
    { id: 'info', name: 'Info' },
    { id: 'debug', name: 'Debug' },
  ]);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('aurora_auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchLogs = async () => {
      try {
        // In real app, use your API client
        // const data = await apiClient.get('/logs');

        // Generate mock logs
        const newLogs = generateMockLogs(20);
        setLogs(prev => {
          const combined = [...prev, ...newLogs];
          // Keep only last 500 logs
          return combined.slice(-500);
        });
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();

    let interval;
    if (autoRefresh) {
      const refreshRate = (settings?.logsRefresh || 10) * 1000;
      interval = setInterval(fetchLogs, refreshRate);
    }

    return () => clearInterval(interval);
  }, [navigate, autoRefresh, settings?.logsRefresh]);

  useEffect(() => {
    const applyFilters = () => {
      let result = [...logs];

      if (filters.service !== 'all') {
        result = result.filter(log => log.service === filters.service);
      }

      setFilteredLogs(result);
    };

    applyFilters();
  }, [logs, filters]);

  useEffect(() => {
    // Scroll to bottom when new logs arrive
    if (logContainerRef.current && autoRefresh) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoRefresh]);

  const generateMockLogs = (count) => {
    const services = ['nginx', 'postgres', 'redis', 'app', 'system'];
    const levels = ['info', 'warn', 'error', 'debug'];
    const messages = [
      'Request completed successfully',
      'Database connection established',
      'Cache miss for key',
      'User authentication successful',
      'Failed to connect to external service',
      'Memory usage exceeded threshold',
      'Backup job started',
      'Security scan completed',
      'High CPU usage detected',
      'Network latency increased',
    ];

    return Array.from({ length: count }, (_, i) => {
      const service = services[Math.floor(Math.random() * services.length)];
      const level = levels[Math.floor(Math.random() * levels.length)];
      const timestamp = new Date(Date.now() - Math.random() * 3600000).toISOString();

      return {
        id: Date.now() + i,
        timestamp,
        service,
        level,
        message: `${messages[Math.floor(Math.random() * messages.length)]} [${Math.random().toString(36).substr(2, 8)}]`,
      };
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearLogs = () => {
    setLogs([]);
    setFilteredLogs([]);
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'error': return '#fca5a5';
      case 'warn': return '#fcd34d';
      case 'info': return '#93c5fd';
      case 'debug': return '#cbd5e1';
      default: return '#e5e7eb';
    }
  };

  const getServiceColor = (service) => {
    const colors = {
      nginx: '#60a5fa',
      postgres: '#34d399',
      redis: '#f87171',
      app: '#a78bfa',
      system: '#fbbf24',
    };
    return colors[service] || '#9ca3af';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Logs</h1>

        <div style={styles.controls}>
          <div style={styles.controlGroup}>
            <Button
              variant={autoRefresh ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              {autoRefresh ? 'Auto-refresh: ON' : 'Auto-refresh: OFF'}
            </Button>

            <Button
              variant="secondary"
              size="small"
              onClick={handleClearLogs}
            >
              Clear Logs
            </Button>

            <div style={styles.stats}>
              <span style={styles.stat}>
                {filteredLogs.length} logs
              </span>
              <span style={styles.stat}>
                {logs.length} total
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card style={styles.filtersCard}>
        <div style={styles.filtersGrid}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Service</label>
            <div style={styles.filterButtons}>
              {services.map(service => (
                <button
                  key={service.id}
                  style={{
                    ...styles.filterButton,
                    ...(filters.service === service.id ? styles.filterButtonActive : {}),
                    borderColor: getServiceColor(service.id),
                  }}
                  onClick={() => handleFilterChange('service', service.id)}
                >
                  {service.name}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Level</label>
            <div style={styles.filterButtons}>
              {levels.map(level => (
                <button
                  key={level.id}
                  style={{
                    ...styles.filterButton,
                    ...(filters.level === level.id ? styles.filterButtonActive : {}),
                    borderColor: getLevelColor(level.id),
                  }}
                  onClick={() => handleFilterChange('level', level.id)}
                >
                  {level.name}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Search</label>
            <input
              type="text"
              placeholder="Search logs..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>
      </Card>

      {/* Logs Container */}
      <Card style={styles.logsCard}>
        <div
          ref={logContainerRef}
          style={styles.logsContainer}
        >
          {filteredLogs.length === 0 ? (
            <div style={styles.emptyState}>
              No logs found. Try adjusting your filters.
            </div>
          ) : (
            filteredLogs.map((log, index) => {
              const showDate = index === 0 ||
                formatDate(filteredLogs[index - 1].timestamp) !== formatDate(log.timestamp);

              return (
                <div key={log.id}>
                  {showDate && (
                    <div style={styles.dateSeparator}>
                      {formatDate(log.timestamp)}
                    </div>
                  )}

                  <div style={styles.logEntry}>
                    <div style={styles.logTimestamp}>
                      {formatTimestamp(log.timestamp)}
                    </div>

                    <div style={styles.logService}>
                      <span style={{
                        ...styles.serviceBadge,
                        backgroundColor: getServiceColor(log.service),
                      }}>
                        {log.service}
                      </span>
                    </div>

                    <div style={styles.logLevel}>
                      <span style={{
                        ...styles.levelBadge,
                        color: getLevelColor(log.level),
                        borderColor: getLevelColor(log.level),
                      }}>
                        {log.level.toUpperCase()}
                      </span>
                    </div>

                    <div style={{
                      ...styles.logMessage,
                      color: getLevelColor(log.level),
                    }}>
                      {log.message}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Footer Actions */}
      <div style={styles.footer}>
        <div style={styles.footerInfo}>
          <span style={styles.infoItem}>
            <span style={{ ...styles.infoDot, backgroundColor: '#fca5a5' }}></span>
            Error
          </span>
          <span style={styles.infoItem}>
            <span style={{ ...styles.infoDot, backgroundColor: '#fcd34d' }}></span>
            Warning
          </span>
          <span style={styles.infoItem}>
            <span style={{ ...styles.infoDot, backgroundColor: '#93c5fd' }}></span>
            Info
          </span>
          <span style={styles.infoItem}>
            <span style={{ ...styles.infoDot, backgroundColor: '#cbd5e1' }}></span>
            Debug
          </span>
        </div>

        <div style={styles.footerActions}>
          <Button
            variant="secondary"
            size="small"
            onClick={() => logContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Scroll to Top
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => logContainerRef.current?.scrollTo({
              top: logContainerRef.current.scrollHeight,
              behavior: 'smooth'
            })}
          >
            Scroll to Bottom
          </Button>
        </div>
      </div>
    </div>
  );
};

// Inbuilt CSS Styles
const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#0f172a',
    minHeight: '100vh',
    color: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Courier New", monospace',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#f1f5f9',
    margin: 0,
  },
  controls: {
    display: 'flex',
    gap: '1rem',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  stats: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  stat: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  filtersCard: {
    padding: '1.5rem',
  },
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  filterLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    fontWeight: '600',
  },
  filterButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  filterButton: {
    padding: '0.375rem 0.75rem',
    fontSize: '0.75rem',
    backgroundColor: 'transparent',
    color: '#cbd5e1',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  },
  filterButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    fontWeight: '600',
  },
  searchInput: {
    padding: '0.5rem 0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    color: '#f8fafc',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'all 0.2s ease',
    ':focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
    },
  },
  logsCard: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    backgroundColor: '#111827',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
  },
  logsContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    backgroundColor: '#111827',
    fontFamily: '"Courier New", monospace',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    maxHeight: 'calc(100vh - 300px)',
  },
  dateSeparator: {
    padding: '0.5rem 0',
    margin: '0.5rem 0',
    color: '#64748b',
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    fontWeight: '600',
  },
  logEntry: {
    display: 'grid',
    gridTemplateColumns: '80px 100px 80px 1fr',
    gap: '1rem',
    padding: '0.25rem 0',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
  },
  logTimestamp: {
    color: '#94a3b8',
    fontSize: '0.75rem',
    whiteSpace: 'nowrap',
  },
  logService: {
    display: 'flex',
  },
  serviceBadge: {
    padding: '0.125rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '600',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  logLevel: {
    display: 'flex',
  },
  levelBadge: {
    padding: '0.125rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.7rem',
    fontWeight: '600',
    backgroundColor: 'transparent',
    border: '1px solid',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  logMessage: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    ':hover': {
      whiteSpace: 'normal',
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
  },
  emptyState: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#64748b',
    fontSize: '0.95rem',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  footerInfo: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  infoDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  footerActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  // Responsive adjustments
  '@media (max-width: 768px)': {
    container: {
      padding: '1rem',
    },
    header: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    controlGroup: {
      width: '100%',
      justifyContent: 'space-between',
    },
    logEntry: {
      gridTemplateColumns: '1fr',
      gap: '0.25rem',
      padding: '0.5rem 0',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    },
    logTimestamp: {
      fontSize: '0.7rem',
    },
    logMessage: {
      whiteSpace: 'normal',
      wordBreak: 'break-word',
    },
    footer: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    footerActions: {
      width: '100%',
      justifyContent: 'flex-end',
    },
  },
  // Scrollbar styling
  '::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  '::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
  },
  '::-webkit-scrollbar-thumb:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
};

export default Logs;
