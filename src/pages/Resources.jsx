// ...Resources page...
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';

const Resources = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pollingInterval, setPollingInterval] = useState((settings?.resourcesRefresh || 2) * 1000);
  const [timeRange, setTimeRange] = useState(300); // 5 minutes in seconds
  const [historyData, setHistoryData] = useState({
    cpu: [],
    memory: [],
    load: []
  });
  const chartRefs = {
    cpu: useRef(null),
    memory: useRef(null),
    load: useRef(null)
  };

  useEffect(() => {
    if (settings?.resourcesRefresh) {
      setPollingInterval(settings.resourcesRefresh * 1000);
    }
  }, [settings?.resourcesRefresh]);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('aurora_auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchResources = async () => {
      try {
        // In real app, use your API client
        // const data = await apiClient.get('/resources');

        // Mock data
        const now = Date.now();
        const mockResources = {
          timestamp: now,
          cpu: {
            usage: 42.5 + (Math.random() * 10),
            cores: 8,
            frequency: 3.2,
            processes: 245,
            threads: 1842
          },
          memory: {
            used: 12.4,
            total: 32,
            cached: 4.2,
            buffers: 0.8,
            swapUsed: 1.2,
            swapTotal: 8
          },
          load: {
            one: 1.24 + (Math.random() * 0.5),
            five: 1.08,
            fifteen: 0.92
          },
          disk: {
            read: 12.5,
            write: 4.8,
            iops: 450
          },
          network: {
            inbound: 125,
            outbound: 45,
            connections: 142
          }
        };

        setResources(mockResources);

        // Update history data
        setHistoryData(prev => {
          const newCpu = [...prev.cpu, { time: now, value: mockResources.cpu.usage }].slice(-60);
          const newMemory = [...prev.memory, { time: now, value: mockResources.memory.used }].slice(-60);
          const newLoad = [...prev.load, { time: now, value: mockResources.load.one }].slice(-60);

          return {
            cpu: newCpu,
            memory: newMemory,
            load: newLoad
          };
        });
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
    const interval = setInterval(fetchResources, pollingInterval);

    return () => clearInterval(interval);
  }, [navigate, pollingInterval]);

  useEffect(() => {
    if (!resources) return;

    const drawCharts = () => {
      // Draw CPU chart
      drawLineChart(chartRefs.cpu.current, historyData.cpu, '#3b82f6', 'CPU Usage (%)');

      // Draw Memory chart
      drawLineChart(chartRefs.memory.current, historyData.memory, '#10b981', 'Memory Used (GB)');

      // Draw Load chart
      drawLineChart(chartRefs.load.current, historyData.load, '#f59e0b', 'Load Average');
    };

    drawCharts();
    const interval = setInterval(drawCharts, 1000); // 1s refresh for animations
    return () => clearInterval(interval);
  }, [resources, historyData, chartRefs.cpu, chartRefs.load, chartRefs.memory]);

  const drawLineChart = (canvas, data, color, label) => {
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (data.length < 2) return;

    // Calculate min/max values
    const values = data.map(d => d.value);
    const maxValue = Math.max(...values) * 1.1;
    const minValue = Math.min(...values) * 0.9;
    const valueRange = maxValue - minValue;

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = height - (i / 5) * height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    data.forEach((point, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((point.value - minValue) / valueRange) * height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw gradient under line
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '00');

    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw label
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(label, 10, 15);
  };

  const formatMemory = (gb) => {
    return `${gb.toFixed(1)} GB`;
  };

  const getCpuUsageColor = (usage) => {
    if (usage > 80) return '#ef4444';
    if (usage > 60) return '#f59e0b';
    return '#10b981';
  };

  const getLoadColor = (load) => {
    const cores = resources?.cpu?.cores || 1;
    if (load > cores * 1.5) return '#ef4444';
    if (load > cores) return '#f59e0b';
    return '#10b981';
  };

  const handleTimeRangeChange = (seconds) => {
    setTimeRange(seconds);
    // Filter history data to new range
    const cutoff = Date.now() - (seconds * 1000);
    setHistoryData(prev => ({
      cpu: prev.cpu.filter(item => item.time > cutoff),
      memory: prev.memory.filter(item => item.time > cutoff),
      load: prev.load.filter(item => item.time > cutoff)
    }));
  };

  if (loading || !resources) {
    return <Loader />;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Resources</h1>

        <div style={styles.controls}>
          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Polling:</label>
            <div style={styles.buttonGroup}>
              {[1000, 2000, 5000, 10000].map(interval => (
                <Button
                  key={interval}
                  variant={pollingInterval === interval ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => setPollingInterval(interval)}
                >
                  {interval === 1000 ? '1s' : `${interval / 1000}s`}
                </Button>
              ))}
            </div>
          </div>

          <div style={styles.controlGroup}>
            <label style={styles.controlLabel}>Time range:</label>
            <div style={styles.buttonGroup}>
              {[60, 300, 600, 1800].map(seconds => (
                <Button
                  key={seconds}
                  variant={timeRange === seconds ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => handleTimeRangeChange(seconds)}
                >
                  {seconds === 60 ? '1m' :
                    seconds === 300 ? '5m' :
                      seconds === 600 ? '10m' : '30m'}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CPU Section */}
      <Card style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>CPU Usage</h2>
          <div style={styles.currentValue}>
            <span style={{
              color: getCpuUsageColor(resources?.cpu?.usage || 0),
              fontWeight: '700'
            }}>
              {resources?.cpu?.usage.toFixed(1)}%
            </span>
            <span style={styles.subValue}>
              of {resources?.cpu?.cores} cores
            </span>
          </div>
        </div>

        <div style={styles.chartContainer}>
          <canvas
            ref={chartRefs.cpu}
            style={styles.chartCanvas}
            width={800}
            height={200}
          />
        </div>

        <div style={styles.metricsGrid}>
          <div style={styles.metric}>
            <div style={styles.metricLabel}>Frequency</div>
            <div style={styles.metricValue}>
              {resources?.cpu?.frequency.toFixed(1)} GHz
            </div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricLabel}>Processes</div>
            <div style={styles.metricValue}>
              {resources?.cpu?.processes}
            </div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricLabel}>Threads</div>
            <div style={styles.metricValue}>
              {resources?.cpu?.threads}
            </div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricLabel}>User Space</div>
            <div style={styles.metricValue}>
              {(resources?.cpu?.usage * 0.7).toFixed(1)}%
            </div>
          </div>
          <div style={styles.metric}>
            <div style={styles.metricLabel}>System Space</div>
            <div style={styles.metricValue}>
              {(resources?.cpu?.usage * 0.3).toFixed(1)}%
            </div>
          </div>
        </div>
      </Card>

      {/* Memory Section */}
      <Card style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Memory</h2>
          <div style={styles.currentValue}>
            <span style={{ color: '#10b981', fontWeight: '700' }}>
              {formatMemory(resources?.memory?.used || 0)}
            </span>
            <span style={styles.subValue}>
              of {formatMemory(resources?.memory?.total || 0)}
            </span>
          </div>
        </div>

        <div style={styles.chartContainer}>
          <canvas
            ref={chartRefs.memory}
            style={styles.chartCanvas}
            width={800}
            height={200}
          />
        </div>

        <div style={styles.memoryGrid}>
          <div style={styles.memoryBar}>
            <div style={styles.barLabel}>Used</div>
            <div style={styles.barContainer}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${((resources?.memory?.used || 0) / (resources?.memory?.total || 1)) * 100}%`,
                  backgroundColor: '#10b981'
                }}
              />
            </div>
            <div style={styles.barValue}>
              {formatMemory(resources?.memory?.used || 0)}
            </div>
          </div>

          <div style={styles.memoryBar}>
            <div style={styles.barLabel}>Cached</div>
            <div style={styles.barContainer}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${((resources?.memory?.cached || 0) / (resources?.memory?.total || 1)) * 100}%`,
                  backgroundColor: '#3b82f6'
                }}
              />
            </div>
            <div style={styles.barValue}>
              {formatMemory(resources?.memory?.cached || 0)}
            </div>
          </div>

          <div style={styles.memoryBar}>
            <div style={styles.barLabel}>Buffers</div>
            <div style={styles.barContainer}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${((resources?.memory?.buffers || 0) / (resources?.memory?.total || 1)) * 100}%`,
                  backgroundColor: '#8b5cf6'
                }}
              />
            </div>
            <div style={styles.barValue}>
              {formatMemory(resources?.memory?.buffers || 0)}
            </div>
          </div>

          <div style={styles.memoryBar}>
            <div style={styles.barLabel}>Swap</div>
            <div style={styles.barContainer}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${((resources?.memory?.swapUsed || 0) / (resources?.memory?.swapTotal || 1)) * 100}%`,
                  backgroundColor: '#f59e0b'
                }}
              />
            </div>
            <div style={styles.barValue}>
              {formatMemory(resources?.memory?.swapUsed || 0)} / {formatMemory(resources?.memory?.swapTotal || 0)}
            </div>
          </div>
        </div>
      </Card>

      {/* Load Average Section */}
      <Card style={styles.sectionCard}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Load Average</h2>
          <div style={styles.currentValue}>
            <span style={{
              color: getLoadColor(resources?.load?.one || 0),
              fontWeight: '700'
            }}>
              {resources?.load?.one.toFixed(2)}
            </span>
            <span style={styles.subValue}>
              {resources?.load?.five.toFixed(2)} / {resources?.load?.fifteen.toFixed(2)}
            </span>
          </div>
        </div>

        <div style={styles.chartContainer}>
          <canvas
            ref={chartRefs.load}
            style={styles.chartCanvas}
            width={800}
            height={200}
          />
        </div>

        <div style={styles.loadGrid}>
          <div style={styles.loadMetric}>
            <div style={styles.loadLabel}>1 minute</div>
            <div style={{
              ...styles.loadValue,
              color: getLoadColor(resources?.load?.one || 0)
            }}>
              {resources?.load?.one.toFixed(2)}
            </div>
            <div style={styles.loadBar}>
              <div
                style={{
                  ...styles.loadBarFill,
                  width: `${Math.min((resources?.load?.one || 0) / (resources?.cpu?.cores || 1) * 50, 100)}%`,
                  backgroundColor: getLoadColor(resources?.load?.one || 0)
                }}
              />
              <div style={styles.coreMarker}>
                {resources?.cpu?.cores} cores
              </div>
            </div>
          </div>

          <div style={styles.loadMetric}>
            <div style={styles.loadLabel}>5 minutes</div>
            <div style={{
              ...styles.loadValue,
              color: getLoadColor(resources?.load?.five || 0)
            }}>
              {resources?.load?.five.toFixed(2)}
            </div>
            <div style={styles.loadBar}>
              <div
                style={{
                  ...styles.loadBarFill,
                  width: `${Math.min((resources?.load?.five || 0) / (resources?.cpu?.cores || 1) * 50, 100)}%`,
                  backgroundColor: getLoadColor(resources?.load?.five || 0)
                }}
              />
            </div>
          </div>

          <div style={styles.loadMetric}>
            <div style={styles.loadLabel}>15 minutes</div>
            <div style={{
              ...styles.loadValue,
              color: getLoadColor(resources?.load?.fifteen || 0)
            }}>
              {resources?.load?.fifteen.toFixed(2)}
            </div>
            <div style={styles.loadBar}>
              <div
                style={{
                  ...styles.loadBarFill,
                  width: `${Math.min((resources?.load?.fifteen || 0) / (resources?.cpu?.cores || 1) * 50, 100)}%`,
                  backgroundColor: getLoadColor(resources?.load?.fifteen || 0)
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats Footer */}
      <div style={styles.footerGrid}>
        <div style={styles.footerCard}>
          <div style={styles.footerTitle}>Disk I/O</div>
          <div style={styles.footerValue}>
            {resources?.disk?.read.toFixed(0)} MB/s read
          </div>
          <div style={styles.footerValue}>
            {resources?.disk?.write.toFixed(0)} MB/s write
          </div>
          <div style={styles.footerSubValue}>
            {resources?.disk?.iops.toFixed(0)} IOPS
          </div>
        </div>

        <div style={styles.footerCard}>
          <div style={styles.footerTitle}>Network</div>
          <div style={styles.footerValue}>
            {resources?.network?.inbound.toFixed(0)} Mbps in
          </div>
          <div style={styles.footerValue}>
            {resources?.network?.outbound.toFixed(0)} Mbps out
          </div>
          <div style={styles.footerSubValue}>
            {resources?.network?.connections.toFixed(0)} connections
          </div>
        </div>

        <div style={styles.footerCard}>
          <div style={styles.footerTitle}>Last Updated</div>
          <div style={styles.footerValue}>
            {new Date(resources?.timestamp || Date.now()).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            })}
          </div>
          <div style={styles.footerSubValue}>
            Polling every {pollingInterval / 1000}s
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
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#f1f5f9',
    margin: 0,
  },
  controls: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap',
  },
  controlGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  controlLabel: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    whiteSpace: 'nowrap',
  },
  buttonGroup: {
    display: 'flex',
    gap: '0.25rem',
  },
  sectionCard: {
    padding: '1.5rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: 0,
  },
  currentValue: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '0.75rem',
  },
  subValue: {
    fontSize: '0.875rem',
    color: '#94a3b8',
  },
  chartContainer: {
    width: '100%',
    height: '200px',
    marginBottom: '1.5rem',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  chartCanvas: {
    width: '100%',
    height: '100%',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  metricLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  metricValue: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#f8fafc',
  },
  memoryGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  memoryBar: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr 100px',
    alignItems: 'center',
    gap: '1rem',
  },
  barLabel: {
    fontSize: '0.875rem',
    color: '#cbd5e1',
    textAlign: 'right',
  },
  barContainer: {
    height: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.5s ease',
  },
  barValue: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    textAlign: 'right',
  },
  loadGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
  },
  loadMetric: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  loadLabel: {
    fontSize: '0.875rem',
    color: '#cbd5e1',
  },
  loadValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
  },
  loadBar: {
    height: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    position: 'relative',
    overflow: 'hidden',
  },
  loadBarFill: {
    height: '100%',
    borderRadius: '12px',
    transition: 'width 0.5s ease',
  },
  coreMarker: {
    position: 'absolute',
    top: '0',
    left: '50%',
    height: '100%',
    width: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    fontSize: '0.7rem',
    color: 'rgba(255, 255, 255, 0.5)',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '4px',
  },
  footerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  footerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  footerTitle: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  footerValue: {
    fontSize: '0.95rem',
    color: '#e2e8f0',
    marginBottom: '0.25rem',
  },
  footerSubValue: {
    fontSize: '0.75rem',
    color: '#64748b',
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
    controls: {
      width: '100%',
      flexDirection: 'column',
      gap: '1rem',
    },
    chartContainer: {
      height: '150px',
    },
    memoryBar: {
      gridTemplateColumns: '1fr',
      gap: '0.5rem',
    },
    barLabel: {
      textAlign: 'left',
    },
    barValue: {
      textAlign: 'left',
    },
    metricsGrid: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
  },
  '@media (max-width: 480px)': {
    metricsGrid: {
      gridTemplateColumns: '1fr',
    },
    loadGrid: {
      gridTemplateColumns: '1fr',
    },
    footerGrid: {
      gridTemplateColumns: '1fr',
    },
  },
};

export default Resources;
