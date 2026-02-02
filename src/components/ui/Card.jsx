// ...Card component...
import { useState } from 'react';

const Card = ({
  children,
  title,
  subtitle,
  icon,
  action,
  footer,
  loading = false,
  hoverable = false,
  selected = false,
  borderColor = null,
  backgroundColor = null,
  padding = '1.5rem',
  borderRadius = '12px',
  shadow = true,
  onClick,
  className = '',
  style = {}
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div
      className={`card ${className}`}
      style={{
        ...styles.card,
        ...(hoverable && isHovered ? styles.cardHover : {}),
        ...(selected ? styles.cardSelected : {}),
        ...(shadow ? styles.cardShadow : {}),
        ...(borderColor ? { borderColor } : {}),
        ...(backgroundColor ? { backgroundColor } : {}),
        ...(padding ? { padding } : {}),
        ...(borderRadius ? { borderRadius } : {}),
        ...(onClick ? { cursor: 'pointer' } : {}),
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          handleClick(e);
        }
      }}
    >
      {/* Loading Overlay */}
      {loading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner} />
        </div>
      )}

      {/* Header Section */}
      {(title || icon || action) && (
        <div style={styles.header}>
          <div style={styles.headerContent}>
            {icon && (
              <div style={styles.iconContainer}>
                {typeof icon === 'string' ? (
                  <span style={styles.icon}>{icon}</span>
                ) : (
                  icon
                )}
              </div>
            )}
            
            <div style={styles.titleSection}>
              {title && (
                <h3 style={styles.title}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <p style={styles.subtitle}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {action && (
            <div style={styles.actionContainer}>
              {action}
            </div>
          )}
        </div>
      )}

      {/* Content Section */}
      <div style={{
        ...styles.content,
        ...(title || icon || action ? { marginTop: '1rem' } : {})
      }}>
        {children}
      </div>

      {/* Footer Section */}
      {footer && (
        <div style={styles.footer}>
          {footer}
        </div>
      )}
    </div>
  );
};

// Inbuilt CSS Styles
const styles = {
  card: {
    backgroundColor: 'var(--color-surface-primary, #1c2130)',
    border: '1px solid var(--color-border-card, #2a2f3a)',
    borderRadius: '12px',
    padding: '1.5rem',
    position: 'relative',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-family-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
    overflow: 'hidden',
  },
  cardShadow: {
    boxShadow: 'var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))',
  },
  cardHover: {
    backgroundColor: 'var(--color-card-hover, #242a3d)',
    borderColor: 'var(--color-border-primary, rgba(255, 255, 255, 0.1))',
    transform: 'translateY(-2px)',
    boxShadow: 'var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1))',
  },
  cardSelected: {
    borderColor: 'var(--color-primary-500, #3b82f6)',
    boxShadow: '0 0 0 1px var(--color-primary-500, #3b82f6), var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06))',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(28, 33, 48, 0.8)',
    backdropFilter: 'blur(2px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    borderRadius: 'inherit',
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(255, 255, 255, 0.1)',
    borderTopColor: 'var(--color-primary-500, #3b82f6)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.5rem',
  },
  headerContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    flex: 1,
    minWidth: 0,
  },
  iconContainer: {
    flexShrink: 0,
  },
  icon: {
    fontSize: '1.25rem',
    color: 'var(--color-text-secondary, #94a3b8)',
  },
  titleSection: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: 'var(--color-text-primary, #f8fafc)',
    margin: 0,
    lineHeight: 1.3,
  },
  subtitle: {
    fontSize: '0.875rem',
    color: 'var(--color-text-secondary, #94a3b8)',
    margin: '0.25rem 0 0 0',
    lineHeight: 1.4,
  },
  actionContainer: {
    flexShrink: 0,
    marginLeft: '0.75rem',
  },
  content: {
    color: 'var(--color-text-primary, #f8fafc)',
    fontSize: '0.875rem',
    lineHeight: 1.5,
  },
  footer: {
    marginTop: '1.5rem',
    paddingTop: '1rem',
    borderTop: '1px solid var(--color-border-tertiary, rgba(255, 255, 255, 0.05))',
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
};

export default Card;
