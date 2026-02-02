// ...StatusBadge component...
import { useMemo } from 'react';

const StatusBadge = ({
  status,
  label,
  color,
  size = 'medium',
  variant = 'filled',
  showDot = true,
  pulse = false,
  className = '',
  style = {}
}) => {
  // Determine color based on status if color not provided
  const badgeColor = useMemo(() => {
    if (color) return color;
    
    const statusLower = (status || '').toLowerCase();
    const labelLower = (label || '').toLowerCase();
    
    // Check status first
    if (statusLower.includes('running') || 
        statusLower.includes('online') || 
        statusLower.includes('healthy') ||
        statusLower.includes('success') ||
        statusLower.includes('active') ||
        labelLower.includes('running') ||
        labelLower.includes('online') ||
        labelLower.includes('healthy')) {
      return 'var(--color-status-online, #22c55e)';
    }
    
    if (statusLower.includes('degraded') || 
        statusLower.includes('warning') || 
        statusLower.includes('caution') ||
        statusLower.includes('pending') ||
        labelLower.includes('degraded') ||
        labelLower.includes('warning')) {
      return 'var(--color-status-degraded, #facc15)';
    }
    
    if (statusLower.includes('stopped') || 
        statusLower.includes('offline') || 
        statusLower.includes('error') ||
        statusLower.includes('critical') ||
        statusLower.includes('failed') ||
        labelLower.includes('stopped') ||
        labelLower.includes('offline') ||
        labelLower.includes('error')) {
      return 'var(--color-status-offline, #ef4444)';
    }
    
    if (statusLower.includes('maintenance') || 
        statusLower.includes('info') || 
        labelLower.includes('maintenance')) {
      return 'var(--color-status-maintenance, #3b82f6)';
    }
    
    // Default neutral color
    return 'var(--color-badge-neutral, #6b7280)';
  }, [status, label, color]);

  // Determine text color based on variant and color
  const textColor = useMemo(() => {
    if (variant === 'outline') {
      return badgeColor;
    }
    
    // For filled badges, use appropriate contrast text
    const colorStr = badgeColor.toLowerCase();
    if (colorStr.includes('#facc15') || colorStr.includes('warning')) {
      return 'var(--color-badge-warning-text, #0f172a)'; // Dark text for yellow
    }
    return 'var(--color-badge-primary-text, #ffffff)';
  }, [badgeColor, variant]);

  // Generate label from status if not provided
  const badgeLabel = useMemo(() => {
    if (label) return label;
    
    const statusLower = (status || '').toLowerCase();
    
    if (statusLower.includes('running')) return 'RUNNING';
    if (statusLower.includes('online')) return 'ONLINE';
    if (statusLower.includes('healthy')) return 'HEALTHY';
    if (statusLower.includes('degraded')) return 'DEGRADED';
    if (statusLower.includes('warning')) return 'WARNING';
    if (statusLower.includes('stopped')) return 'STOPPED';
    if (statusLower.includes('offline')) return 'OFFLINE';
    if (statusLower.includes('error')) return 'ERROR';
    if (statusLower.includes('critical')) return 'CRITICAL';
    if (statusLower.includes('maintenance')) return 'MAINTENANCE';
    
    return status ? status.toUpperCase() : 'UNKNOWN';
  }, [status, label]);

  // Size configurations
  const sizeConfig = {
    small: {
      padding: '0.125rem 0.5rem',
      fontSize: '0.6875rem',
      dotSize: '6px',
      gap: '0.25rem',
    },
    medium: {
      padding: '0.25rem 0.75rem',
      fontSize: '0.75rem',
      dotSize: '8px',
      gap: '0.375rem',
    },
    large: {
      padding: '0.375rem 1rem',
      fontSize: '0.875rem',
      dotSize: '10px',
      gap: '0.5rem',
    }
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  return (
    <div
      className={`status-badge ${className}`}
      style={{
        ...styles.badge,
        ...(variant === 'filled' ? styles.badgeFilled : styles.badgeOutline),
        ...(pulse ? styles.pulseAnimation : {}),
        backgroundColor: variant === 'filled' ? badgeColor : 'transparent',
        borderColor: badgeColor,
        color: textColor,
        padding: config.padding,
        fontSize: config.fontSize,
        gap: config.gap,
        ...style
      }}
      title={status || badgeLabel}
      role="status"
      aria-label={`Status: ${badgeLabel}`}
    >
      {showDot && (
        <span
          style={{
            ...styles.dot,
            backgroundColor: variant === 'filled' ? textColor : badgeColor,
            width: config.dotSize,
            height: config.dotSize,
            ...(pulse ? styles.pulseDot : {}),
          }}
        />
      )}
      
      <span style={styles.label}>
        {badgeLabel}
      </span>
    </div>
  );
};

// Inbuilt CSS Styles
const styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    borderWidth: '1px',
    borderStyle: 'solid',
    fontWeight: '600',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    userSelect: 'none',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-family-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
  },
  badgeFilled: {
    borderColor: 'transparent',
  },
  badgeOutline: {
    backgroundColor: 'transparent',
  },
  dot: {
    borderRadius: '50%',
    flexShrink: 0,
    transition: 'background-color 0.2s ease',
  },
  label: {
    fontWeight: '600',
    letterSpacing: '0.05em',
  },
  pulseAnimation: {
    animation: 'pulse 2s infinite',
  },
  pulseDot: {
    animation: 'pulse 2s infinite',
  },
  // Animations
  '@keyframes pulse': {
    '0%, 100%': {
      opacity: 1,
    },
    '50%': {
      opacity: 0.7,
    },
  },
};

export default StatusBadge;
