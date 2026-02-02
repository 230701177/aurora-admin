// ...Dashboard page...
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import Card from '../components/ui/Card';
import StatusBadge from '../components/ui/StatusBadge';
import Loader from '../components/ui/Loader';
import LineChart from '../components/charts/LineChart';
import UsageChart from '../components/charts/UsageChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('aurora_auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchDashboardData();

    // Use dynamic refresh rate from settings
    const refreshRate = (settings?.dashboardRefresh || 30) * 1000;
    const interval = setInterval(fetchDashboardData, refreshRate);

    return () => clearInterval(interval);
  }, [navigate, settings?.dashboardRefresh]);

  const fetchDashboardData = async () => {
    try {
      // In real app, use your API client
      // const data = await apiClient.get('/dashboard');

      // Mock data for demonstration
      const mockData = {
        serverStatus: 'online', // online, degraded, offline
        uptime: '15d 7h 23m',
        cpu: {
          current: 42.5,
          trend: [30, 35, 40, 45, 42, 38, 42.5],
          max: 85.0
        },
        memory: {
          used: 8.2,
          total: 16,
          percentage: 51.25,
          trend: [45, 48, 50, 52, 51, 49, 51.25]
        },
        disk: {
          used: 245,
          total: 500,
          percentage: 49,
          partitions: [
            { name: 'Root', used: 120, total: 200, percentage: 60 },
            { name: 'Data', used: 95, total: 250, percentage: 38 },
            { name: 'Backup', used: 30, total: 50, percentage: 60 }
          ]
        },
        network: {
          inbound: 125,
          outbound: 45,
          connections: 142
        }
      };

      setDashboardData(mockData);
      setLastUpdated(new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      }));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // const getStatusColor = (status) => {
  //   switch(status) {
  //     case 'online': return '#10b981';
  //     case 'degraded': return '#f59e0b';
  //     case 'offline': return '#ef4444';
  //     default: return '#6b7280';
  //   }
  // };

  const formatBytes = (bytes) => {
    const sizes = ['GB', 'TB'];
    if (bytes === 0) return '0 GB';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        {lastUpdated && (
          <div style={styles.lastUpdated}>
            Last updated: {lastUpdated}
          </div>
        )}
      </div>

      {/* Top Section - Server Status */}
      <div style={styles.grid}>
        {/* Server Status Card */}
        <Card style={styles.statusCard}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Server Status</h2>
            <StatusBadge
              status={dashboardData.serverStatus}
              label={dashboardData.serverStatus.charAt(0).toUpperCase() + dashboardData.serverStatus.slice(1)}
            />
          </div>
          <div style={styles.metricsRow}>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>Uptime</div>
              <div style={styles.metricValue}>{dashboardData.uptime}</div>
            </div>
            <div style={styles.metric}>
              <div style={styles.metricLabel}>Network</div>
              <div style={styles.metricValue}>{dashboardData.network.connections} connections</div>
            </div>
          </div>
        </Card>

        {/* CPU Usage Card */}
        <Card>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>CPU Usage</h2>
            <div style={styles.currentValue}>
              {dashboardData.cpu.current.toFixed(1)}%
            </div>
          </div>
          <LineChart
            data={dashboardData.cpu.trend}
            color="#3b82f6"
            height={120}
          />
          <div style={styles.chartFooter}>
            <div style={styles.chartStat}>
              <span style={styles.chartStatLabel}>Max:</span>
              <span style={styles.chartStatValue}>{dashboardData.cpu.max.toFixed(1)}%</span>
            </div>
          </div>
        </Card>

        {/* RAM Usage Card */}
        <Card>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Memory</h2>
            <div style={styles.currentValue}>
              {dashboardData.memory.percentage.toFixed(1)}%
            </div>
          </div>
          <UsageChart
            used={dashboardData.memory.used}
            total={dashboardData.memory.total}
            unit="GB"
            color="#10b981"
            height={120}
          />
          <div style={styles.chartFooter}>
            <div style={styles.chartStat}>
              <span style={styles.chartStatLabel}>Used:</span>
              <span style={styles.chartStatValue}>
                {dashboardData.memory.used.toFixed(1)}/{dashboardData.memory.total} GB
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom Section - Disk Usage */}
      <Card style={styles.diskCard}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Disk Usage</h2>
          <div style={styles.currentValue}>
            {dashboardData.disk.percentage}% ({formatBytes(dashboardData.disk.used)}/{formatBytes(dashboardData.disk.total)})
          </div>
        </div>

        <div style={styles.diskGrid}>
          {dashboardData.disk.partitions.map((partition, index) => (
            <div key={index} style={styles.partition}>
              <div style={styles.partitionHeader}>
                <span style={styles.partitionName}>{partition.name}</span>
                <span style={styles.partitionPercentage}>{partition.percentage}%</span>
              </div>
              <div style={styles.progressBar}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${partition.percentage}%`,
                    backgroundColor: partition.percentage > 80 ? '#ef4444' :
                      partition.percentage > 60 ? '#f59e0b' : '#10b981'
                  }}
                />
              </div>
              <div style={styles.partitionDetails}>
                <span style={styles.partitionDetail}>
                  {partition.used} GB used
                </span>
                <span style={styles.partitionDetail}>
                  {partition.total - partition.used} GB free
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Stats Footer */}
      <div style={styles.statsFooter}>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Inbound Traffic</div>
          <div style={styles.statValue}>{dashboardData.network.inbound} Mbps</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Outbound Traffic</div>
          <div style={styles.statValue}>{dashboardData.network.outbound} Mbps</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Active Processes</div>
          <div style={styles.statValue}>142</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statLabel}>Load Average</div>
          <div style={styles.statValue}>1.24, 1.08, 0.92</div>
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
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#f1f5f9',
    margin: 0,
  },
  lastUpdated: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statusCard: {
    gridColumn: 'span 1',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: 0,
  },
  currentValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#f8fafc',
  },
  metricsRow: {
    display: 'flex',
    gap: '2rem',
    marginTop: '1rem',
  },
  metric: {
    flex: 1,
  },
  metricLabel: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
  },
  metricValue: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#f8fafc',
  },
  chartFooter: {
    marginTop: '1rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  chartStat: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartStatLabel: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  chartStatValue: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#f8fafc',
  },
  diskCard: {
    marginBottom: '2rem',
  },
  diskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginTop: '1.5rem',
  },
  partition: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  partitionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem',
  },
  partitionName: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  partitionPercentage: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#f8fafc',
  },
  progressBar: {
    height: '6px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '3px',
    overflow: 'hidden',
    marginBottom: '0.75rem',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  partitionDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  partitionDetail: {
    display: 'block',
  },
  statsFooter: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    padding: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  statItem: {
    textAlign: 'center',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
  },
  statValue: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#f8fafc',
  },
  // Responsive adjustments
  '@media (max-width: 768px)': {
    container: {
      padding: '1rem',
    },
    grid: {
      gridTemplateColumns: '1fr',
    },
    metricsRow: {
      flexDirection: 'column',
      gap: '1rem',
    },
    diskGrid: {
      gridTemplateColumns: '1fr',
    },
    statsFooter: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
};

export default Dashboard;
