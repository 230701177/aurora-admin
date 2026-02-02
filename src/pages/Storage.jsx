import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Disc,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

const Storage = () => {
  const navigate = useNavigate();
  const [storage, setStorage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('mount');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('aurora_auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchStorage();
    const interval = setInterval(fetchStorage, 30000); // Poll every 30 seconds (storage is slow-changing)

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchStorage = async () => {
    try {
      // In real app, use your API client
      // const data = await apiClient.get('/storage');

      // Mock storage data
      const mockStorage = {
        total: {
          used: 842,
          capacity: 2048,
          percentage: 41.1
        },
        drives: [
          {
            id: 'ssd-1',
            name: 'NVMe SSD',
            mount: '/',
            type: 'SSD',
            capacity: 512,
            used: 245,
            free: 267,
            percentage: 47.9,
            filesystem: 'ext4',
            iops: 85000,
            readSpeed: 3500,
            writeSpeed: 2500,
            temperature: 42,
            health: 'Good',
            lastScrub: '2024-01-15'
          },
          {
            id: 'hdd-1',
            name: 'Database Storage',
            mount: '/var/lib/postgresql',
            type: 'HDD',
            capacity: 1024,
            used: 485,
            free: 539,
            percentage: 47.4,
            filesystem: 'xfs',
            iops: 180,
            readSpeed: 180,
            writeSpeed: 160,
            temperature: 36,
            health: 'Good',
            lastScrub: '2024-01-10'
          },
          {
            id: 'hdd-2',
            name: 'Backup Volume',
            mount: '/backup',
            type: 'HDD',
            capacity: 2048,
            used: 112,
            free: 1936,
            percentage: 5.5,
            filesystem: 'ext4',
            iops: 150,
            readSpeed: 160,
            writeSpeed: 140,
            temperature: 34,
            health: 'Excellent',
            lastScrub: '2024-01-12'
          },
          {
            id: 'ssd-2',
            name: 'Cache Volume',
            mount: '/cache',
            type: 'SSD',
            capacity: 256,
            used: 198,
            free: 58,
            percentage: 77.3,
            filesystem: 'btrfs',
            iops: 92000,
            readSpeed: 3200,
            writeSpeed: 2800,
            temperature: 48,
            health: 'Warning',
            lastScrub: '2024-01-14'
          }
        ],
        partitions: [
          { mount: '/boot', used: 0.8, capacity: 1, percentage: 80, type: 'SSD' },
          { mount: '/tmp', used: 2.4, capacity: 10, percentage: 24, type: 'RAM' },
          { mount: '/home', used: 45, capacity: 100, percentage: 45, type: 'SSD' },
        ]
      };

      setStorage(mockStorage);
    } catch (error) {
      console.error('Failed to fetch storage:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatBytes = (gb) => {
    if (gb >= 1024) {
      return `${(gb / 1024).toFixed(1)} TB`;
    }
    return `${gb.toFixed(0)} GB`;
  };

  const getUsageColor = (percentage, type) => {
    if (type === 'SSD') {
      if (percentage > 90) return '#ef4444'; // Critical
      if (percentage > 75) return '#f59e0b'; // Warning
      return '#10b981'; // Good
    } else {
      if (percentage > 95) return '#ef4444'; // HDDs have more tolerance
      if (percentage > 85) return '#f59e0b';
      return '#10b981';
    }
  };

  const getHealthColor = (health) => {
    switch (health?.toLowerCase()) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getDriveIcon = (type) => {
    return type === 'SSD' ? <Zap size={20} color="#3b82f6" /> : <Disc size={20} color="#94a3b8" />;
  };

  const getSpeedColor = (speed, type) => {
    if (type === 'SSD') {
      if (speed > 3000) return '#10b981';
      if (speed > 2000) return '#3b82f6';
      return '#f59e0b';
    } else {
      if (speed > 200) return '#10b981';
      if (speed > 150) return '#3b82f6';
      return '#f59e0b';
    }
  };

  const sortDrives = (drives) => {
    const sorted = [...drives];

    switch (sortBy) {
      case 'usage':
        return sorted.sort((a, b) => b.percentage - a.percentage);
      case 'free':
        return sorted.sort((a, b) => b.free - a.free);
      case 'type':
        return sorted.sort((a, b) => b.type.localeCompare(a.type));
      case 'mount':
      default:
        return sorted.sort((a, b) => a.mount.localeCompare(b.mount));
    }
  };

  const handleCleanup = (driveId) => {
    // In real app, this would trigger a cleanup process
    console.log(`Starting cleanup for drive ${driveId}`);
    alert(`Cleanup process started for selected drive. This may take several minutes.`);
  };

  if (loading) {
    return <Loader />;
  }

  const sortedDrives = sortDrives(storage?.drives || []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Storage</h1>
          <div style={styles.subtitle}>
            Total: {formatBytes(storage?.total.used || 0)} used of {formatBytes(storage?.total.capacity || 0)} ({storage?.total.percentage.toFixed(1)}%)
          </div>
        </div>

        <div style={styles.controls}>
          <div style={styles.sortControl}>
            <label style={styles.sortLabel}>Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={styles.sortSelect}
            >
              <option value="mount">Mount Point</option>
              <option value="usage">Usage %</option>
              <option value="free">Free Space</option>
              <option value="type">Drive Type</option>
            </select>
          </div>

          <Button
            variant="secondary"
            size="small"
            onClick={() => fetchStorage()}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Drives Grid */}
      <div style={styles.drivesGrid}>
        {sortedDrives.map((drive) => {
          const usageColor = getUsageColor(drive.percentage, drive.type);
          const isHighUsage = drive.percentage > (drive.type === 'SSD' ? 75 : 85);

          return (
            <Card key={drive.id} style={styles.driveCard}>
              <div style={styles.driveHeader}>
                <div style={styles.driveTitle}>
                  <span style={styles.driveIcon}>{getDriveIcon(drive.type)}</span>
                  <div>
                    <h3 style={styles.driveName}>{drive.name}</h3>
                    <div style={styles.driveMount}>{drive.mount}</div>
                  </div>
                </div>

                <div style={styles.driveTypeBadge}>
                  {drive.type}
                </div>
              </div>

              {/* Usage Bar */}
              <div style={styles.usageSection}>
                <div style={styles.usageHeader}>
                  <div style={styles.usageLabel}>
                    <span style={{ color: usageColor, fontWeight: '600' }}>
                      {drive.percentage.toFixed(1)}%
                    </span>
                    <span style={styles.usageSubtext}>
                      ({formatBytes(drive.used)} used)
                    </span>
                  </div>
                  <div style={styles.usageFree}>
                    {formatBytes(drive.free)} free
                  </div>
                </div>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: `${drive.percentage}%`,
                      backgroundColor: usageColor,
                      boxShadow: isHighUsage ? `0 0 8px ${usageColor}40` : 'none'
                    }}
                  />
                  <div style={styles.progressLabels}>
                    <span style={styles.progressLabel}>0%</span>
                    <span style={styles.progressLabel}>100%</span>
                  </div>
                </div>

                <div style={styles.capacityLabel}>
                  Capacity: {formatBytes(drive.capacity)}
                </div>
              </div>

              {/* Drive Details */}
              <div style={styles.driveDetails}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Filesystem</span>
                  <span style={styles.detailValue}>{drive.filesystem}</span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Health</span>
                  <span style={{
                    ...styles.detailValue,
                    color: getHealthColor(drive.health)
                  }}>
                    {drive.health}
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Temperature</span>
                  <span style={{
                    ...styles.detailValue,
                    color: drive.temperature > 50 ? '#ef4444' :
                      drive.temperature > 45 ? '#f59e0b' : '#10b981'
                  }}>
                    {drive.temperature}°C
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Performance</span>
                  <span style={{
                    ...styles.detailValue,
                    color: getSpeedColor(drive.readSpeed, drive.type)
                  }}>
                    {drive.readSpeed} MB/s read
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>IOPS</span>
                  <span style={styles.detailValue}>
                    {drive.iops.toLocaleString()}
                  </span>
                </div>

                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Last Scrub</span>
                  <span style={styles.detailValue}>
                    {drive.lastScrub}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {isHighUsage && (
                <div style={styles.actionSection}>
                  <Button
                    variant="warning"
                    size="small"
                    fullWidth
                    onClick={() => handleCleanup(drive.id)}
                  >
                    <AlertTriangle size={14} /> Review Files for Cleanup
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Partitions Section */}
      <Card style={styles.partitionsCard}>
        <h2 style={styles.sectionTitle}>System Partitions</h2>
        <div style={styles.partitionsList}>
          {storage?.partitions.map((partition, index) => (
            <div key={index} style={styles.partitionItem}>
              <div style={styles.partitionHeader}>
                <span style={styles.partitionMount}>{partition.mount}</span>
                <span style={styles.partitionType}>{partition.type}</span>
              </div>

              <div style={styles.partitionUsage}>
                <div style={styles.partitionBar}>
                  <div
                    style={{
                      ...styles.partitionFill,
                      width: `${partition.percentage}%`,
                      backgroundColor: getUsageColor(partition.percentage, partition.type)
                    }}
                  />
                </div>
                <div style={styles.partitionStats}>
                  <span style={styles.partitionUsed}>
                    {partition.used} GB used
                  </span>
                  <span style={styles.partitionTotal}>
                    of {partition.capacity} GB
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Stats */}
      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <div style={styles.summaryTitle}>SSD Summary</div>
          <div style={styles.summaryContent}>
            {(() => {
              const ssdDrives = storage?.drives.filter(d => d.type === 'SSD') || [];
              const total = ssdDrives.reduce((sum, d) => sum + d.capacity, 0);
              const used = ssdDrives.reduce((sum, d) => sum + d.used, 0);
              const percentage = total > 0 ? (used / total) * 100 : 0;

              return (
                <>
                  <div style={styles.summaryValue}>{ssdDrives.length} drives</div>
                  <div style={styles.summaryValue}>{formatBytes(total)} total</div>
                  <div style={styles.summaryValue}>{formatBytes(used)} used ({percentage.toFixed(1)}%)</div>
                </>
              );
            })()}
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryTitle}>HDD Summary</div>
          <div style={styles.summaryContent}>
            {(() => {
              const hddDrives = storage?.drives.filter(d => d.type === 'HDD') || [];
              const total = hddDrives.reduce((sum, d) => sum + d.capacity, 0);
              const used = hddDrives.reduce((sum, d) => sum + d.used, 0);
              const percentage = total > 0 ? (used / total) * 100 : 0;

              return (
                <>
                  <div style={styles.summaryValue}>{hddDrives.length} drives</div>
                  <div style={styles.summaryValue}>{formatBytes(total)} total</div>
                  <div style={styles.summaryValue}>{formatBytes(used)} used ({percentage.toFixed(1)}%)</div>
                </>
              );
            })()}
          </div>
        </div>

        <div style={styles.summaryCard}>
          <div style={styles.summaryTitle}>Recommendations</div>
          <div style={styles.recommendations}>
            {(() => {
              const highUsageDrives = storage?.drives.filter(d =>
                d.percentage > (d.type === 'SSD' ? 75 : 85)
              ) || [];

              if (highUsageDrives.length === 0) {
                return (
                  <div style={styles.recommendation}>
                    <CheckCircle2 size={16} color="#10b981" /> Storage usage is within healthy limits
                  </div>
                );
              }

              return highUsageDrives.map((drive, index) => (
                <div key={index} style={styles.recommendation}>
                  <AlertTriangle size={16} color="#f59e0b" /> Consider cleaning up <strong>{drive.mount}</strong> ({drive.percentage.toFixed(1)}% full)
                </div>
              ));
            })()}
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
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  sortControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  sortLabel: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  sortSelect: {
    padding: '0.375rem 0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    color: '#f8fafc',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':focus': {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)',
    },
  },
  drivesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '1.5rem',
  },
  driveCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  driveHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  driveTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  driveIcon: {
    fontSize: '1.5rem',
  },
  driveName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: '0 0 0.125rem 0',
  },
  driveMount: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    fontFamily: 'monospace',
  },
  driveTypeBadge: {
    padding: '0.25rem 0.75rem',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#cbd5e1',
    fontSize: '0.75rem',
    fontWeight: '600',
    borderRadius: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  usageSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  usageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  usageLabel: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
  },
  usageSubtext: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  usageFree: {
    fontSize: '0.95rem',
    color: '#cbd5e1',
    fontWeight: '500',
  },
  progressBar: {
    height: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '12px',
    transition: 'width 1s ease', // Slow transition for storage data
  },
  progressLabels: {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 0.75rem',
    pointerEvents: 'none',
  },
  progressLabel: {
    fontSize: '0.75rem',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  capacityLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    textAlign: 'center',
  },
  driveDetails: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '1.5rem',
  },
  detailLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  detailValue: {
    fontSize: '0.875rem',
    color: '#e2e8f0',
    fontWeight: '500',
    textAlign: 'right',
  },
  actionSection: {
    marginTop: '0.5rem',
  },
  partitionsCard: {
    padding: '1.5rem',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: '0 0 1rem 0',
  },
  partitionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  partitionItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  partitionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  partitionMount: {
    fontSize: '0.875rem',
    color: '#e2e8f0',
    fontFamily: 'monospace',
    fontWeight: '500',
  },
  partitionType: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '0.125rem 0.5rem',
    borderRadius: '4px',
  },
  partitionUsage: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  partitionBar: {
    flex: 1,
    height: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  partitionFill: {
    height: '100%',
    borderRadius: '6px',
    transition: 'width 1s ease',
  },
  partitionStats: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.5rem',
    minWidth: '140px',
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
  partitionUsed: {
    color: '#e2e8f0',
    fontWeight: '500',
  },
  partitionTotal: {
    color: '#64748b',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  summaryTitle: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.75rem',
    fontWeight: '600',
  },
  summaryContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  summaryValue: {
    fontSize: '0.95rem',
    color: '#e2e8f0',
  },
  recommendations: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  recommendation: {
    fontSize: '0.875rem',
    color: '#e2e8f0',
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
    drivesGrid: {
      gridTemplateColumns: '1fr',
    },
    driveDetails: {
      gridTemplateColumns: '1fr',
    },
    partitionUsage: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: '0.5rem',
    },
    partitionStats: {
      width: '100%',
      justifyContent: 'space-between',
    },
    summaryGrid: {
      gridTemplateColumns: '1fr',
    },
  },
};

export default Storage;
