// ...Loader component...
import { useMemo } from 'react';

const Loader = ({
  size = 'medium',
  color = 'primary',
  type = 'spinner',
  text = '',
  fullScreen = false,
  centered = true,
  inline = false,
  className = '',
  style = {}
}) => {
  // Size configurations
  const sizeConfig = useMemo(() => {
    const configs = {
      small: {
        spinner: '20px',
        dots: '8px',
        gap: '4px',
        textSize: '0.75rem',
      },
      medium: {
        spinner: '32px',
        dots: '12px',
        gap: '6px',
        textSize: '0.875rem',
      },
      large: {
        spinner: '48px',
        dots: '16px',
        gap: '8px',
        textSize: '1rem',
      },
      xlarge: {
        spinner: '64px',
        dots: '20px',
        gap: '10px',
        textSize: '1.125rem',
      }
    };
    return configs[size] || configs.medium;
  }, [size]);

  // Color configurations
  const colorConfig = useMemo(() => {
    const colors = {
      primary: 'var(--color-primary-500, #3b82f6)',
      white: 'var(--color-text-primary, #ffffff)',
      gray: 'var(--color-text-tertiary, #64748b)',
      success: 'var(--color-success-500, #22c55e)',
      warning: 'var(--color-warning-500, #facc15)',
      danger: 'var(--color-danger-500, #ef4444)',
    };
    return colors[color] || colors.primary;
  }, [color]);

  // Render different loader types
  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div style={{
            ...styles.dotsContainer,
            gap: sizeConfig.gap,
          }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  ...styles.dot,
                  backgroundColor: colorConfig,
                  width: sizeConfig.dots,
                  height: sizeConfig.dots,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div style={{
            ...styles.barsContainer,
            gap: sizeConfig.gap,
            height: sizeConfig.spinner,
          }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  ...styles.bar,
                  backgroundColor: colorConfig,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        );

      case 'ring':
        return (
          <div style={{
            ...styles.ring,
            width: sizeConfig.spinner,
            height: sizeConfig.spinner,
            borderColor: `${colorConfig} transparent transparent transparent`,
          }} />
        );

      case 'pulse':
        return (
          <div style={{
            ...styles.pulse,
            backgroundColor: colorConfig,
            width: sizeConfig.spinner,
            height: sizeConfig.spinner,
          }} />
        );

      case 'spinner':
      default:
        return (
          <div style={{
            ...styles.spinner,
            width: sizeConfig.spinner,
            height: sizeConfig.spinner,
            borderColor: `${colorConfig} transparent transparent transparent`,
          }} />
        );
    }
  };

  const loaderContent = (
    <div
      className={`loader ${className}`}
      style={{
        ...styles.loader,
        ...(centered && !inline ? styles.centered : {}),
        ...(inline ? styles.inline : {}),
        ...(fullScreen ? styles.fullScreen : {}),
        ...style
      }}
      role="status"
      aria-label={text || "Loading..."}
    >
      <div style={styles.loaderContent}>
        {renderLoader()}
        
        {text && (
          <div style={{
            ...styles.text,
            fontSize: sizeConfig.textSize,
            color: colorConfig,
            marginTop: sizeConfig.gap,
          }}>
            {text}
          </div>
        )}
      </div>
    </div>
  );

  // If fullScreen, wrap in portal-like positioning
  if (fullScreen) {
    return (
      <div style={styles.fullScreenContainer}>
        {loaderContent}
      </div>
    );
  }

  return loaderContent;
};

// Inbuilt CSS Styles
const styles = {
  fullScreenContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(15, 17, 23, 0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-family-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
  },
  centered: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 100,
  },
  inline: {
    display: 'inline-flex',
  },
  fullScreen: {
    // Already handled by container
  },
  loaderContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  ring: {
    borderWidth: '4px',
    borderStyle: 'solid',
    borderRadius: '50%',
    animation: 'spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite',
  },
  dotsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    borderRadius: '50%',
    animation: 'pulse 1.4s ease-in-out infinite both',
  },
  barsContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bar: {
    width: '4px',
    height: '100%',
    borderRadius: '2px',
    animation: 'stretch 1.2s ease-in-out infinite',
  },
  pulse: {
    borderRadius: '50%',
    animation: 'pulseScale 1.5s ease-in-out infinite both',
  },
  text: {
    fontWeight: '500',
    textAlign: 'center',
    marginTop: '0.5rem',
  },
  // Animations
  '@keyframes spin': {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
  '@keyframes pulse': {
    '0%, 100%': {
      transform: 'scale(0.8)',
      opacity: 0.5,
    },
    '50%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  '@keyframes pulseScale': {
    '0%, 100%': {
      transform: 'scale(0.8)',
      opacity: 0.5,
    },
    '50%': {
      transform: 'scale(1)',
      opacity: 1,
    },
  },
  '@keyframes stretch': {
    '0%, 40%, 100%': {
      transform: 'scaleY(0.4)',
    },
    '20%': {
      transform: 'scaleY(1)',
    },
  },
};

export default Loader;
