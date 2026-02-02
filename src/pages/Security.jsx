import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  Settings,
  Globe,
  FileText,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import StatusBadge from '../components/ui/StatusBadge';

const Security = () => {
  const navigate = useNavigate();
  const [security, setSecurity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [auditLogs, setAuditLogs] = useState([]);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('aurora_auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchSecurity();
    const interval = setInterval(fetchSecurity, 60000); // Poll every 60 seconds

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchSecurity = async () => {
    try {
      // In real app, use your API client
      // const data = await apiClient.get('/security');

      // Mock security data
      const mockSecurity = {
        timestamp: new Date().toISOString(),
        overallStatus: 'secure',

        firewall: {
          status: 'active',
          rules: 24,
          defaultPolicy: 'drop',
          activePorts: [22, 80, 443, 3000],
          lastUpdated: '2 hours ago',
          version: 'iptables v1.8.9'
        },

        ssh: {
          status: 'secure',
          port: 22,
          protocol: 'SSH-2.0',
          keyAuthentication: true,
          passwordAuthentication: false,
          rootLogin: false,
          lastSuccessfulLogin: '2024-01-15 14:30:22 UTC',
          lastFailedAttempt: '2024-01-15 03:15:44 UTC',
          failedAttempts24h: 2
        },

        system: {
          packagesUpdated: '2 days ago',
          securityUpdates: 0,
          kernelVersion: '5.15.0-91-generic',
          selinux: 'disabled',
          apparmor: 'enforced',
          automaticUpdates: true
        },

        network: {
          openPorts: 4,
          exposedServices: 3,
          vpnConnected: true,
          dnsSec: true,
          tlsVersion: 'TLS 1.3'
        },

        monitoring: {
          intrusionDetection: 'active',
          fileIntegrity: 'monitoring',
          logMonitoring: 'active',
          lastScan: '2024-01-15 00:00:00 UTC',
          threatsDetected: 0
        }
      };

      // Mock audit logs
      const mockLogs = [
        { id: 1, timestamp: '2024-01-15 14:30:22', event: 'SSH login successful', user: 'admin', source: '192.168.1.100', severity: 'info' },
        { id: 2, timestamp: '2024-01-15 03:15:44', event: 'SSH failed login attempt', user: 'root', source: '203.0.113.45', severity: 'warning' },
        { id: 3, timestamp: '2024-01-14 22:45:12', event: 'Firewall rule updated', user: 'system', source: 'localhost', severity: 'info' },
        { id: 4, timestamp: '2024-01-14 18:20:33', event: 'Package security update', user: 'system', source: 'localhost', severity: 'info' },
        { id: 5, timestamp: '2024-01-14 12:05:18', event: 'Suspicious port scan detected', user: 'system', source: '198.51.100.23', severity: 'warning' },
        { id: 6, timestamp: '2024-01-14 08:15:09', event: 'Successful system backup', user: 'backup', source: 'localhost', severity: 'info' },
        { id: 7, timestamp: '2024-01-13 23:30:55', event: 'SSH login successful', user: 'admin', source: '192.168.1.100', severity: 'info' },
        { id: 8, timestamp: '2024-01-13 19:45:27', event: 'VPN connection established', user: 'admin', source: 'client-vpn', severity: 'info' }
      ];

      setSecurity(mockSecurity);
      setAuditLogs(mockLogs);
    } catch (error) {
      console.error('Failed to fetch security data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'secure': '#10b981',
      'active': '#10b981',
      'enforced': '#10b981',
      'monitoring': '#3b82f6',
      'warning': '#f59e0b',
      'inactive': '#ef4444',
      'disabled': '#ef4444',
      'critical': '#ef4444'
    };
    return statusMap[status] || '#6b7280';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Security</h1>
          <div style={styles.subtitle}>
            Last updated: {formatTimestamp(security?.timestamp)}
          </div>
        </div>

        <div style={styles.overallStatus}>
          <div style={styles.statusLabel}>Overall Status</div>
          <div style={{
            ...styles.statusBadge,
            backgroundColor: getStatusColor(security?.overallStatus),
            color: '#0f172a',
            fontWeight: '700'
          }}>
            {security?.overallStatus.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Main Security Grid */}
      <div style={styles.securityGrid}>
        {/* Firewall Card */}
        <Card style={styles.securityCard}>
          <div
            style={styles.cardHeader}
            onClick={() => toggleSection('firewall')}
          >
            <div style={styles.cardTitle}>
              <span style={styles.cardIcon}>
                <Shield size={20} color="#3b82f6" />
              </span>
              Firewall
            </div>
            <StatusBadge
              status={security?.firewall.status}
              color={getStatusColor(security?.firewall.status)}
            />
          </div>

          <div style={styles.cardContent}>
            <div style={styles.metricRow}>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Rules</div>
                <div style={styles.metricValue}>{security?.firewall.rules}</div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Default Policy</div>
                <div style={styles.metricValue}>{security?.firewall.defaultPolicy}</div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Active Ports</div>
                <div style={styles.metricValue}>{security?.firewall.activePorts.length}</div>
              </div>
            </div>

            {expandedSection === 'firewall' && (
              <div style={styles.expandedContent}>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>Version</div>
                  <div style={styles.detailValue}>{security?.firewall.version}</div>
                </div>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>Last Updated</div>
                  <div style={styles.detailValue}>{security?.firewall.lastUpdated}</div>
                </div>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>Open Ports</div>
                  <div style={styles.portList}>
                    {security?.firewall.activePorts.map((port, index) => (
                      <span key={index} style={styles.portBadge}>{port}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* SSH Access Card */}
        <Card style={styles.securityCard}>
          <div
            style={styles.cardHeader}
            onClick={() => toggleSection('ssh')}
          >
            <div style={styles.cardTitle}>
              <span style={styles.cardIcon}>
                <Lock size={20} color="#3b82f6" />
              </span>
              SSH Access
            </div>
            <StatusBadge
              status={security?.ssh.status}
              color={getStatusColor(security?.ssh.status)}
            />
          </div>

          <div style={styles.cardContent}>
            <div style={styles.metricRow}>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Port</div>
                <div style={styles.metricValue}>{security?.ssh.port}</div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Protocol</div>
                <div style={styles.metricValue}>{security?.ssh.protocol}</div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Failed (24h)</div>
                <div style={{
                  ...styles.metricValue,
                  color: security?.ssh.failedAttempts24h > 5 ? '#ef4444' :
                    security?.ssh.failedAttempts24h > 0 ? '#f59e0b' : '#10b981'
                }}>
                  {security?.ssh.failedAttempts24h}
                </div>
              </div>
            </div>

            {expandedSection === 'ssh' && (
              <div style={styles.expandedContent}>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>Key Authentication</div>
                  <div style={{
                    ...styles.detailValue,
                    color: security?.ssh.keyAuthentication ? '#10b981' : '#ef4444'
                  }}>
                    {security?.ssh.keyAuthentication ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>Password Authentication</div>
                  <div style={{
                    ...styles.detailValue,
                    color: !security?.ssh.passwordAuthentication ? '#10b981' : '#ef4444'
                  }}>
                    {security?.ssh.passwordAuthentication ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>Root Login</div>
                  <div style={{
                    ...styles.detailValue,
                    color: !security?.ssh.rootLogin ? '#10b981' : '#ef4444'
                  }}>
                    {security?.ssh.rootLogin ? 'Allowed' : 'Disabled'}
                  </div>
                </div>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>Last Successful Login</div>
                  <div style={styles.detailValue}>
                    {formatTimestamp(security?.ssh.lastSuccessfulLogin)}
                  </div>
                </div>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>Last Failed Attempt</div>
                  <div style={styles.detailValue}>
                    {formatTimestamp(security?.ssh.lastFailedAttempt)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* System Security Card */}
        <Card style={styles.securityCard}>
          <div
            style={styles.cardHeader}
            onClick={() => toggleSection('system')}
          >
            <div style={styles.cardTitle}>
              <span style={styles.cardIcon}>
                <Settings size={20} color="#3b82f6" />
              </span>
              System Security
            </div>
            <div style={{
              ...styles.statusDot,
              backgroundColor: security?.system.securityUpdates === 0 ? '#10b981' : '#ef4444'
            }} />
          </div>

          <div style={styles.cardContent}>
            <div style={styles.metricRow}>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Security Updates</div>
                <div style={{
                  ...styles.metricValue,
                  color: security?.system.securityUpdates === 0 ? '#10b981' : '#ef4444'
                }}>
                  {security?.system.securityUpdates}
                </div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Kernel</div>
                <div style={styles.metricValue}>
                  {security?.system.kernelVersion.split('-')[0]}
                </div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Packages Updated</div>
                <div style={styles.metricValue}>
                  {security?.system.packagesUpdated}
                </div>
              </div>
            </div>

            {expandedSection === 'system' && (
              <div style={styles.expandedContent}>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>AppArmor</div>
                  <div style={{
                    ...styles.detailValue,
                    color: getStatusColor(security?.system.apparmor)
                  }}>
                    {security?.system.apparmor}
                  </div>
                </div>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>SELinux</div>
                  <div style={{
                    ...styles.detailValue,
                    color: security?.system.selinux === 'disabled' ? '#6b7280' : '#10b981'
                  }}>
                    {security?.system.selinux}
                  </div>
                </div>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>Automatic Updates</div>
                  <div style={{
                    ...styles.detailValue,
                    color: security?.system.automaticUpdates ? '#10b981' : '#ef4444'
                  }}>
                    {security?.system.automaticUpdates ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Network Security Card */}
        <Card style={styles.securityCard}>
          <div
            style={styles.cardHeader}
            onClick={() => toggleSection('network')}
          >
            <div style={styles.cardTitle}>
              <span style={styles.cardIcon}>
                <Globe size={20} color="#3b82f6" />
              </span>
              Network Security
            </div>
            <div style={{
              ...styles.statusDot,
              backgroundColor: security?.network.openPorts <= 5 ? '#10b981' : '#f59e0b'
            }} />
          </div>

          <div style={styles.cardContent}>
            <div style={styles.metricRow}>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Open Ports</div>
                <div style={{
                  ...styles.metricValue,
                  color: security?.network.openPorts <= 5 ? '#10b981' :
                    security?.network.openPorts <= 10 ? '#f59e0b' : '#ef4444'
                }}>
                  {security?.network.openPorts}
                </div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>Exposed Services</div>
                <div style={styles.metricValue}>
                  {security?.network.exposedServices}
                </div>
              </div>
              <div style={styles.metric}>
                <div style={styles.metricLabel}>VPN</div>
                <div style={{
                  ...styles.metricValue,
                  color: security?.network.vpnConnected ? '#10b981' : '#ef4444'
                }}>
                  {security?.network.vpnConnected ? 'Connected' : 'Disconnected'}
                </div>
              </div>
            </div>

            {expandedSection === 'network' && (
              <div style={styles.expandedContent}>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>TLS Version</div>
                  <div style={{
                    ...styles.detailValue,
                    color: security?.network.tlsVersion === 'TLS 1.3' ? '#10b981' : '#f59e0b'
                  }}>
                    {security?.network.tlsVersion}
                  </div>
                </div>
                <div style={styles.detailSection}>
                  <div style={styles.detailLabel}>DNSSEC</div>
                  <div style={{
                    ...styles.detailValue,
                    color: security?.network.dnsSec ? '#10b981' : '#ef4444'
                  }}>
                    {security?.network.dnsSec ? 'Enabled' : 'Disabled'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Audit Logs */}
      <Card style={styles.auditCard}>
        <div style={styles.auditHeader}>
          <h2 style={styles.auditTitle}>
            <span style={styles.auditIcon}>
              <FileText size={20} color="#3b82f6" />
            </span>
            Security Audit Log
          </h2>
          <div style={styles.auditStats}>
            {auditLogs.filter(log => log.severity === 'warning').length} warnings in last 7 days
          </div>
        </div>

        <div style={styles.auditLogs}>
          {auditLogs.slice(0, 6).map((log) => (
            <div key={log.id} style={styles.logEntry}>
              <div style={styles.logTimestamp}>
                {formatTimestamp(log.timestamp)}
              </div>
              <div style={styles.logEvent}>
                <span style={{
                  ...styles.severityDot,
                  backgroundColor: getSeverityColor(log.severity)
                }} />
                {log.event}
              </div>
              <div style={styles.logDetails}>
                <span style={styles.logUser}>{log.user}</span>
                <span style={styles.logSource}>from {log.source}</span>
              </div>
            </div>
          ))}
        </div>

        {auditLogs.length > 6 && (
          <div style={styles.auditFooter}>
            Showing 6 of {auditLogs.length} recent events
          </div>
        )}
      </Card>

      {/* Security Summary */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryHeader}>
          <h3 style={styles.summaryTitle}>Security Summary</h3>
          <Button
            variant="secondary"
            size="small"
            onClick={fetchSecurity}
          >
            Refresh Status
          </Button>
        </div>

        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <div style={styles.summaryIcon}>
              <CheckCircle2 size={20} color="#10b981" />
            </div>
            <div>
              <div style={styles.summaryLabel}>Firewall Active</div>
              <div style={styles.summaryValue}>{security?.firewall.rules} rules configured</div>
            </div>
          </div>

          <div style={styles.summaryItem}>
            <div style={styles.summaryIcon}>
              <CheckCircle2 size={20} color="#10b981" />
            </div>
            <div>
              <div style={styles.summaryLabel}>SSH Secure</div>
              <div style={styles.summaryValue}>
                Last login: {formatTimestamp(security?.ssh.lastSuccessfulLogin)}
              </div>
            </div>
          </div>

          <div style={styles.summaryItem}>
            <div style={styles.summaryIcon}>
              {security?.system.securityUpdates === 0 ? (
                <CheckCircle2 size={20} color="#10b981" />
              ) : (
                <AlertTriangle size={20} color="#f59e0b" />
              )}
            </div>
            <div>
              <div style={styles.summaryLabel}>System Updates</div>
              <div style={styles.summaryValue}>
                {security?.system.securityUpdates === 0 ? 'Up to date' : `${security?.system.securityUpdates} updates pending`}
              </div>
            </div>
          </div>

          <div style={styles.summaryItem}>
            <div style={styles.summaryIcon}>
              <CheckCircle2 size={20} color="#10b981" />
            </div>
            <div>
              <div style={styles.summaryLabel}>Monitoring Active</div>
              <div style={styles.summaryValue}>
                {security?.monitoring.threatsDetected} threats detected
              </div>
            </div>
          </div>
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
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#f1f5f9',
    margin: '0 0 0.25rem 0',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: '#94a3b8',
  },
  overallStatus: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statusLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  statusBadge: {
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  securityGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  securityCard: {
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  cardIcon: {
    fontSize: '1.25rem',
  },
  statusDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  metricRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '0.75rem',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
  },
  metricValue: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#f8fafc',
  },
  expandedContent: {
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  detailSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  detailValue: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#e2e8f0',
  },
  portList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.25rem',
  },
  portBadge: {
    padding: '0.125rem 0.5rem',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    color: '#93c5fd',
    fontSize: '0.75rem',
    borderRadius: '4px',
    fontFamily: 'monospace',
  },
  auditCard: {
    padding: '1.5rem',
  },
  auditHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  auditTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  auditIcon: {
    fontSize: '1.25rem',
  },
  auditStats: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '0.375rem 0.75rem',
    borderRadius: '4px',
  },
  auditLogs: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  logEntry: {
    display: 'grid',
    gridTemplateColumns: '140px 1fr auto',
    gap: '1rem',
    padding: '0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '6px',
    alignItems: 'center',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
  },
  logTimestamp: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  logEvent: {
    fontSize: '0.875rem',
    color: '#e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  severityDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  logDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.125rem',
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  logUser: {
    fontWeight: '500',
  },
  logSource: {
    fontSize: '0.7rem',
  },
  auditFooter: {
    marginTop: '1rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    fontSize: '0.75rem',
    color: '#94a3b8',
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  summaryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  summaryTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: 0,
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
  },
  summaryIcon: {
    fontSize: '1.25rem',
  },
  summaryLabel: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: '0.25rem',
  },
  summaryValue: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    lineHeight: 1.4,
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
    overallStatus: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    securityGrid: {
      gridTemplateColumns: '1fr',
    },
    metricRow: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    logEntry: {
      gridTemplateColumns: '1fr',
      gap: '0.5rem',
    },
    logDetails: {
      alignItems: 'flex-start',
    },
    summaryGrid: {
      gridTemplateColumns: '1fr',
    },
  },
  '@media (max-width: 480px)': {
    metricRow: {
      gridTemplateColumns: '1fr',
    },
  },
};

export default Security;
