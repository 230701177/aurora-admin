// ...Services page...
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import Loader from '../components/ui/Loader';

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('aurora_auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchServices();
    const interval = setInterval(fetchServices, 15000); // Poll every 15 seconds for services

    return () => clearInterval(interval);
  }, [navigate]);

  const fetchServices = async () => {
    try {
      // In real app, use your API client
      // const data = await apiClient.get('/services');
      
      // Mock data for demonstration
      const mockServices = [
        {
          id: 'nginx',
          name: 'Nginx Web Server',
          description: 'Main web server and reverse proxy',
          status: 'running', // running, degraded, stopped
          uptime: '15d 7h 23m',
          cpu: 2.5,
          memory: 120,
          port: 80,
          autoRestart: true,
          lastRestart: '2 hours ago'
        },
        {
          id: 'postgres',
          name: 'PostgreSQL Database',
          description: 'Primary application database',
          status: 'running',
          uptime: '15d 7h 15m',
          cpu: 15.2,
          memory: 850,
          port: 5432,
          autoRestart: true,
          lastRestart: '1 day ago'
        },
        {
          id: 'redis',
          name: 'Redis Cache',
          description: 'In-memory data store',
          status: 'degraded',
          uptime: '2d 1h 45m',
          cpu: 8.7,
          memory: 320,
          port: 6379,
          autoRestart: false,
          lastRestart: '2 days ago'
        },
        {
          id: 'app-backend',
          name: 'Application Backend',
          description: 'Main application API server',
          status: 'running',
          uptime: '1d 12h 30m',
          cpu: 42.5,
          memory: 1200,
          port: 3000,
          autoRestart: true,
          lastRestart: '6 hours ago'
        },
        {
          id: 'monitoring',
          name: 'Monitoring Agent',
          description: 'System metrics collector',
          status: 'stopped',
          uptime: 'N/A',
          cpu: 0,
          memory: 0,
          port: 9090,
          autoRestart: false,
          lastRestart: '3 days ago'
        },
        {
          id: 'backup',
          name: 'Backup Service',
          description: 'Automated database backups',
          status: 'running',
          uptime: '7d 3h 10m',
          cpu: 1.2,
          memory: 80,
          port: null,
          autoRestart: true,
          lastRestart: '1 week ago'
        }
      ];

      setServices(mockServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAction = async (serviceId, action) => {
    setActionInProgress(serviceId);
    
    try {
      // In real app: await apiClient.post(`/services/${serviceId}/${action}`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      // Update local state
      setServices(prev => prev.map(service => {
        if (service.id === serviceId) {
          const newStatus = action === 'start' ? 'running' : 
                           action === 'stop' ? 'stopped' : 'running';
          
          return {
            ...service,
            status: newStatus,
            lastRestart: action === 'restart' ? 'Just now' : service.lastRestart
          };
        }
        return service;
      }));
      
      setSelectedService(null); // Close confirmation
    } catch (error) {
      console.error(`Failed to ${action} service:`, error);
      alert(`Failed to ${action} service. Please try again.`);
    } finally {
      setActionInProgress(null);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'running': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'stopped': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getActionButton = (service) => {
    const isDisabled = actionInProgress === service.id;
    
    switch(service.status) {
      case 'running':
        return (
          <Button
            variant="danger"
            size="small"
            onClick={() => setSelectedService({...service, action: 'restart'})}
            disabled={isDisabled}
            loading={isDisabled}
          >
            {isDisabled ? 'Processing...' : 'Restart'}
          </Button>
        );
      case 'stopped':
        return (
          <Button
            variant="success"
            size="small"
            onClick={() => handleServiceAction(service.id, 'start')}
            disabled={isDisabled}
            loading={isDisabled}
          >
            {isDisabled ? 'Starting...' : 'Start'}
          </Button>
        );
      default:
        return (
          <Button
            variant="warning"
            size="small"
            onClick={() => setSelectedService({...service, action: 'restart'})}
            disabled={isDisabled}
            loading={isDisabled}
          >
            {isDisabled ? 'Processing...' : 'Restart'}
          </Button>
        );
    }
  };

  const renderServiceRow = (service) => (
    <div key={service.id} style={styles.serviceRow}>
      <div style={styles.serviceInfo}>
        <div style={styles.serviceHeader}>
          <h3 style={styles.serviceName}>{service.name}</h3>
          <StatusBadge 
            status={service.status}
            color={getStatusColor(service.status)}
          />
        </div>
        <p style={styles.serviceDescription}>{service.description}</p>
        
        <div style={styles.serviceDetails}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Uptime:</span>
            <span style={styles.detailValue}>{service.uptime}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>CPU:</span>
            <span style={styles.detailValue}>{service.cpu}%</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Memory:</span>
            <span style={styles.detailValue}>{service.memory} MB</span>
          </div>
          {service.port && (
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Port:</span>
              <span style={styles.detailValue}>{service.port}</span>
            </div>
          )}
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Auto-restart:</span>
            <span style={{
              ...styles.detailValue,
              color: service.autoRestart ? '#10b981' : '#94a3b8'
            }}>
              {service.autoRestart ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
      
      <div style={styles.serviceActions}>
        {getActionButton(service)}
        <div style={styles.lastRestart}>
          Last restart: {service.lastRestart}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Services</h1>
        <div style={styles.stats}>
          <div style={styles.stat}>
            <div style={styles.statValue}>
              {services.filter(s => s.status === 'running').length}
            </div>
            <div style={styles.statLabel}>Running</div>
          </div>
          <div style={styles.stat}>
            <div style={{...styles.statValue, color: '#f59e0b'}}>
              {services.filter(s => s.status === 'degraded').length}
            </div>
            <div style={styles.statLabel}>Degraded</div>
          </div>
          <div style={styles.stat}>
            <div style={{...styles.statValue, color: '#ef4444'}}>
              {services.filter(s => s.status === 'stopped').length}
            </div>
            <div style={styles.statLabel}>Stopped</div>
          </div>
        </div>
      </div>

      {/* Services List */}
      <Card style={styles.servicesCard}>
        <div style={styles.servicesList}>
          {services.map(renderServiceRow)}
        </div>
      </Card>

      {/* Confirmation Modal */}
      {selectedService && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>
              Confirm {selectedService.action}
            </h3>
            <p style={styles.modalText}>
              Are you sure you want to {selectedService.action} <strong>{selectedService.name}</strong>?
              {selectedService.action === 'restart' && ' This will cause a brief service interruption.'}
            </p>
            
            <div style={styles.modalActions}>
              <Button
                variant="secondary"
                onClick={() => setSelectedService(null)}
                disabled={actionInProgress === selectedService.id}
              >
                Cancel
              </Button>
              <Button
                variant={selectedService.action === 'restart' ? 'danger' : 'success'}
                onClick={() => handleServiceAction(selectedService.id, selectedService.action)}
                loading={actionInProgress === selectedService.id}
                disabled={actionInProgress === selectedService.id}
              >
                {selectedService.action === 'restart' ? 'Restart Service' : 'Start Service'}
              </Button>
            </div>
          </div>
        </div>
      )}
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
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#f1f5f9',
    margin: 0,
  },
  stats: {
    display: 'flex',
    gap: '2rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  stat: {
    textAlign: 'center',
    minWidth: '80px',
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#10b981',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  servicesCard: {
    padding: 0,
    overflow: 'hidden',
  },
  servicesList: {
    display: 'flex',
    flexDirection: 'column',
  },
  serviceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.02)',
    },
    ':last-child': {
      borderBottom: 'none',
    },
  },
  serviceInfo: {
    flex: 1,
  },
  serviceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.5rem',
  },
  serviceName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#e2e8f0',
    margin: 0,
  },
  serviceDescription: {
    fontSize: '0.875rem',
    color: '#94a3b8',
    margin: '0 0 1rem 0',
    lineHeight: 1.5,
  },
  serviceDetails: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.5rem',
  },
  detailItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  detailLabel: {
    fontSize: '0.75rem',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  detailValue: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  serviceActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.75rem',
    minWidth: '120px',
  },
  lastRestart: {
    fontSize: '0.75rem',
    color: '#64748b',
    textAlign: 'right',
  },
  // Modal Styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    animation: 'fadeIn 0.2s ease',
  },
  modal: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    padding: '2rem',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    animation: 'slideUp 0.3s ease',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#f1f5f9',
    margin: '0 0 1rem 0',
  },
  modalText: {
    fontSize: '0.95rem',
    color: '#cbd5e1',
    lineHeight: 1.6,
    margin: '0 0 2rem 0',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
  },
  // Animations
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  '@keyframes slideUp': {
    from: { 
      opacity: 0,
      transform: 'translateY(20px)' 
    },
    to: { 
      opacity: 1,
      transform: 'translateY(0)' 
    },
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
    stats: {
      width: '100%',
      justifyContent: 'space-between',
    },
    serviceRow: {
      flexDirection: 'column',
      gap: '1rem',
    },
    serviceActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      minWidth: 'auto',
    },
    lastRestart: {
      textAlign: 'left',
    },
  },
  '@media (max-width: 480px)': {
    stats: {
      flexDirection: 'column',
      gap: '1rem',
      alignItems: 'flex-start',
    },
    stat: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      minWidth: 'auto',
    },
    serviceDetails: {
      flexDirection: 'column',
      gap: '0.75rem',
    },
  },
};

export default Services;
