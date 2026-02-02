import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

const defaultSettings = {
    // Notifications
    emailNotifications: false,
    pushNotifications: true,
    notifyOnErrors: true,
    notifyOnRestarts: false,

    // Data Refresh (seconds)
    dashboardRefresh: 30,
    logsRefresh: 10,
    resourcesRefresh: 5,

    // Data Management
    autoClearLogs: false,
    logRetention: 7,
    maxHistoryData: 30,

    // Time & Date
    timeFormat: '24h',
    dateFormat: 'yyyy-mm-dd',
    timezone: 'UTC'
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);

    // Load settings from localStorage on mount
    useEffect(() => {
        try {
            const savedSettings = localStorage.getItem('auroraSettings');
            if (savedSettings) {
                setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Save settings to localStorage whenever they change
    const updateSettings = (newSettings) => {
        setSettings(prev => {
            const updated = { ...prev, ...newSettings };
            localStorage.setItem('auroraSettings', JSON.stringify(updated));
            return updated;
        });
    };

    // Helper to format date based on settings
    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);

        // Simple timezone handling (for display purposes)
        // In a real app, use date-fns-tz or dayjs
        // This is a basic implementation
        const options = {
            timeZone: settings.timezone === 'UTC' ? 'UTC' : undefined,
            hour12: settings.timeFormat === '12h',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };

        if (settings.timezone !== 'UTC' && settings.timezone) {
            options.timeZone = settings.timezone;
        }

        return d.toLocaleString(undefined, options);
    };

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSettings,
            loading,
            formatDate
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
