// ...Button component...
import { useMemo } from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  icon,
  iconPosition = 'left',
  title,
  className = '',
  style = {}
}) => {
  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  };

  // Variant styles
  const variantStyles = useMemo(() => {
    const styles = {
      primary: {
        backgroundColor: 'var(--color-button-primary, #3b82f6)',
        color: 'var(--color-button-primary-text, #ffffff)',
        borderColor: 'var(--color-button-primary, #3b82f6)',
        hoverBackground: 'var(--color-button-primary-hover, #2563eb)',
        activeBackground: 'var(--color-button-primary-active, #1d4ed8)',
      },
      danger: {
        backgroundColor: 'var(--color-button-danger, #ef4444)',
        color: 'var(--color-button-danger-text, #ffffff)',
        borderColor: 'var(--color-button-danger, #ef4444)',
        hoverBackground: 'var(--color-button-danger-hover, #dc2626)',
        activeBackground: 'var(--color-button-danger-active, #b91c1c)',
      },
      secondary: {
        backgroundColor: 'var(--color-button-secondary, #1e293b)',
        color: 'var(--color-button-secondary-text, #94a3b8)',
        borderColor: 'var(--color-button-secondary, #334155)',
        hoverBackground: 'var(--color-button-secondary-hover, #334155)',
        activeBackground: 'var(--color-button-secondary-active, #475569)',
      },
      success: {
        backgroundColor: 'var(--color-button-success, #22c55e)',
        color: 'var(--color-button-success-text, #ffffff)',
        borderColor: 'var(--color-button-success, #22c55e)',
        hoverBackground: 'var(--color-button-success-hover, #16a34a)',
        activeBackground: 'var(--color-button-success-active, #15803d)',
      },
      warning: {
        backgroundColor: 'var(--color-button-warning, #facc15)',
        color: 'var(--color-button-warning-text, #0f172a)',
        borderColor: 'var(--color-button-warning, #facc15)',
        hoverBackground: 'var(--color-button-warning-hover, #eab308)',
        activeBackground: 'var(--color-button-warning-active, #ca8a04)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-button-secondary-text, #94a3b8)',
        borderColor: 'transparent',
        hoverBackground: 'var(--color-button-secondary-hover, #334155)',
        activeBackground: 'var(--color-button-secondary-active, #475569)',
      }
    };
    return styles[variant] || styles.primary;
  }, [variant]);

  // Size styles
  const sizeStyles = useMemo(() => {
    const styles = {
      small: {
        padding: '0.375rem 0.75rem',
        fontSize: '0.75rem',
        iconSize: '14px',
        gap: '0.375rem',
      },
      medium: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        iconSize: '16px',
        gap: '0.5rem',
      },
      large: {
        padding: '0.625rem 1.5rem',
        fontSize: '0.9375rem',
        iconSize: '18px',
        gap: '0.625rem',
      }
    };
    return styles[size] || styles.medium;
  }, [size]);

  // Determine button state
  const isInteractive = !disabled && !loading;

  return (
    <button
      type={type}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || loading}
      title={title}
      className={`button ${className}`}
      style={{
        ...styles.button,
        ...variantStyles,
        ...sizeStyles,
        ...(fullWidth ? styles.fullWidth : {}),
        ...(loading ? styles.loading : {}),
        ...(!isInteractive ? styles.disabled : {}),
        ...style
      }}
      aria-busy={loading}
      aria-disabled={disabled}
    >
      {/* Loading spinner */}
      {loading && (
        <span style={styles.spinner}>
          <span style={styles.spinnerInner} />
        </span>
      )}

      {/* Icon (left) */}
      {icon && iconPosition === 'left' && !loading && (
        <span style={{
          ...styles.icon,
          fontSize: sizeStyles.iconSize,
        }}>
          {icon}
        </span>
      )}

      {/* Button content */}
      <span style={styles.content}>
        {children}
      </span>

      {/* Icon (right) */}
      {icon && iconPosition === 'right' && !loading && (
        <span style={{
          ...styles.icon,
          fontSize: sizeStyles.iconSize,
        }}>
          {icon}
        </span>
      )}
    </button>
  );
};

// Inbuilt CSS Styles
const styles = {
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    border: '1px solid',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    fontFamily: 'var(--font-family-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    lineHeight: 1.5,
    position: 'relative',
    overflow: 'hidden',
    userSelect: 'none',
    gap: '0.5rem',
    
    // Hover state
    ':hover': {
      backgroundColor: 'inherit',
    },
    
    // Active state
    ':active': {
      transform: 'translateY(1px)',
    },
    
    // Focus state
    ':focus-visible': {
      outline: '2px solid var(--color-primary-400, #60a5fa)',
      outlineOffset: '2px',
    },
  },
  fullWidth: {
    width: '100%',
  },
  loading: {
    cursor: 'wait',
    opacity: 0.8,
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    
    ':hover': {
      backgroundColor: 'inherit !important',
      borderColor: 'inherit !important',
      transform: 'none !important',
    },
    
    ':active': {
      transform: 'none !important',
    },
  },
  icon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  spinner: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    width: '16px',
    height: '16px',
  },
  spinnerInner: {
    width: '12px',
    height: '12px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'currentColor',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  // Animations
  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(360deg)',
    },
  },
  // Hover effect using data attributes
  'data-hover': {
    backgroundColor: 'inherit',
  },
};

// Add hover effects dynamically based on variant
Object.keys(styles).forEach(key => {
  if (key.startsWith('data-hover')) {
    const buttonStyle = styles.button;
    buttonStyle[':hover'] = {
      ...buttonStyle[':hover'],
      ...styles[key],
    };
  }
});

export default Button;
