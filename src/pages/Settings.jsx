import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Bell, Database, Clock, RefreshCw } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const { settings: globalSettings, updateSettings, loading: contextLoading } = useSettings();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize with default values, will be updated by effect
  const [settings, setSettings] = useState(globalSettings);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('aurora_auth_token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  // Sync with global settings when they load
  useEffect(() => {
    if (globalSettings && !hasUnsavedChanges) {
      setSettings(globalSettings);
      setLoading(false);
    }
  }, [globalSettings, hasUnsavedChanges]);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      // Simulate API save
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update global context (which handles localStorage)
      updateSettings(settings);

      setHasUnsavedChanges(false);
      setShowSaveConfirm(true);

      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowSaveConfirm(false);
      }, 3000);

    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all settings to default values? This cannot be undone.')) {
      const defaultSettings = {
        emailNotifications: false,
        pushNotifications: true,
        notifyOnErrors: true,
        notifyOnRestarts: false,
        dashboardRefresh: 30,
        logsRefresh: 10,
        resourcesRefresh: 5,
        autoClearLogs: false,
        logRetention: 7,
        maxHistoryData: 30,
        timeFormat: '24h',
        dateFormat: 'yyyy-mm-dd',
        timezone: 'UTC'
      };

      setSettings(defaultSettings);
      setHasUnsavedChanges(true);
    }
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="section-card">
      <div className="section-header">
        {Icon && <Icon size={20} className="section-icon" />}
        <h3 className="section-title">{title}</h3>
      </div>
      {children}
    </div>
  );

  const SettingRow = ({ label, description, children }) => (
    <div className="setting-row">
      <div className="setting-label">
        <div className="setting-name">{label}</div>
        {description && (
          <div className="setting-description">{description}</div>
        )}
      </div>
      <div className="setting-control">
        {children}
      </div>
    </div>
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="settings-container">
      {/* Header */}
      <div className="settings-header">
        <div>
          <h1 className="settings-title">System Settings</h1>
          <div className="settings-subtitle">
            Manage core configuration and preferences
          </div>
        </div>

        <div className="header-actions">
          {hasUnsavedChanges && (
            <div className="unsaved-badge">
              Unsaved changes
            </div>
          )}
        </div>
      </div>

      {/* Save Confirmation */}
      {showSaveConfirm && (
        <div className="save-confirmation">
          <CheckCircle2 size={18} /> Settings saved successfully
        </div>
      )}

      {/* Settings Sections */}
      <div className="settings-grid">

        {/* Notifications */}
        <SettingSection title="Notifications" icon={Bell}>
          <SettingRow
            label="Email Notifications"
            description="Receive crucial alerts via email"
          >
            <label className="switch-label">
              <input
                type="checkbox"
                className="switch-input"
                checked={settings.emailNotifications}
                onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </SettingRow>

          <SettingRow
            label="Push Notifications"
            description="Browser notifications for real-time alerts"
          >
            <label className="switch-label">
              <input
                type="checkbox"
                className="switch-input"
                checked={settings.pushNotifications}
                onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </SettingRow>

          <SettingRow
            label="Error Alerts"
            description="Notify immediately when system errors occur"
          >
            <label className="switch-label">
              <input
                type="checkbox"
                className="switch-input"
                checked={settings.notifyOnErrors}
                onChange={(e) => handleSettingChange('notifications', 'notifyOnErrors', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </SettingRow>
        </SettingSection>

        {/* Data Refresh */}
        <SettingSection title="Data Refresh Cycle" icon={RefreshCw}>
          <SettingRow
            label="Dashboard Rate"
            description="Update frequency for dashboard widgets"
          >
            <select
              value={settings.dashboardRefresh}
              onChange={(e) => handleSettingChange('refresh', 'dashboardRefresh', parseInt(e.target.value))}
              className="setting-select"
            >
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>1m</option>
            </select>
          </SettingRow>

          <SettingRow
            label="Logs Fetch Rate"
            description="Frequency of checking for new log entries"
          >
            <select
              value={settings.logsRefresh}
              onChange={(e) => handleSettingChange('refresh', 'logsRefresh', parseInt(e.target.value))}
              className="setting-select"
            >
              <option value={5}>5s</option>
              <option value={10}>10s</option>
              <option value={30}>30s</option>
              <option value={60}>1m</option>
            </select>
          </SettingRow>
        </SettingSection>

        {/* Data Management */}
        <SettingSection title="Data Management" icon={Database}>
          <SettingRow
            label="Auto-clear Logs"
            description="Automatically purge old logs periodically"
          >
            <label className="switch-label">
              <input
                type="checkbox"
                className="switch-input"
                checked={settings.autoClearLogs}
                onChange={(e) => handleSettingChange('data', 'autoClearLogs', e.target.checked)}
              />
              <span className="switch-slider"></span>
            </label>
          </SettingRow>

          <SettingRow
            label="Log Retention"
            description="Duration to keep logs before deletion"
          >
            <select
              value={settings.logRetention}
              onChange={(e) => handleSettingChange('data', 'logRetention', parseInt(e.target.value))}
              className="setting-select"
            >
              <option value={1}>1 Day</option>
              <option value={3}>3 Days</option>
              <option value={7}>7 Days</option>
              <option value={14}>14 Days</option>
              <option value={30}>30 Days</option>
            </select>
          </SettingRow>
        </SettingSection>

        {/* Time Preferences */}
        <SettingSection title="Time & Date" icon={Clock}>
          <SettingRow
            label="Time Format"
            description="Display format for all timestamp fields"
          >
            <select
              value={settings.timeFormat}
              onChange={(e) => handleSettingChange('time', 'timeFormat', e.target.value)}
              className="setting-select"
            >
              <option value="12h">12-hour (AM/PM)</option>
              <option value="24h">24-hour</option>
            </select>
          </SettingRow>

          <SettingRow
            label="Timezone"
            description="System timezone for data visualization"
          >
            <select
              value={settings.timezone}
              onChange={(e) => handleSettingChange('time', 'timezone', e.target.value)}
              className="setting-select"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">EST (New York)</option>
              <option value="America/Chicago">CST (Chicago)</option>
              <option value="America/Los_Angeles">PST (Los Angeles)</option>
              <option value="Europe/London">GMT (London)</option>
              <option value="Asia/Tokyo">JST (Tokyo)</option>
            </select>
          </SettingRow>
        </SettingSection>

      </div>

      {/* Bottom Action Bar */}
      <div className="action-bar">
        <div className="action-bar-content">
          <div className="action-bar-text">
            {hasUnsavedChanges ? (
              <>
                <span className="unsaved-dot"></span>
                You have unsaved changes
              </>
            ) : (
              <span style={{ color: '#64748b' }}>Settings up to date</span>
            )}
          </div>

          <div className="action-bar-buttons">
            <Button
              variant="secondary"
              size="medium"
              onClick={handleReset}
              disabled={saving}
            >
              Reset All
            </Button>

            <Button
              variant="primary"
              size="medium"
              onClick={handleSave}
              loading={saving}
              disabled={!hasUnsavedChanges || saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
