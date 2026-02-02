// ...LineChart component...
import { useEffect, useRef, useState } from 'react';

const LineChart = ({ 
  data = [],
  color = '#3b82f6',
  height = 200,
  width = '100%',
  showGrid = true,
  showPoints = false,
  showTooltip = true,
  title = '',
  yAxisLabel = '',
  xAxisLabel = '',
  secondaryData = null,
  secondaryColor = '#9ca3af'
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [dimensions, setDimensions] = useState({ width: 400, height });
  const [hoverIndex, setHoverIndex] = useState(null);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width: containerWidth } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: containerWidth,
          height
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [height]);

  // Draw chart
  useEffect(() => {
    if (!canvasRef.current || data.length < 2) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width: canvasWidth, height: canvasHeight } = dimensions;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate padding
    const padding = {
      top: 30,
      right: 20,
      bottom: 40,
      left: 40
    };

    const chartWidth = canvasWidth - padding.left - padding.right;
    const chartHeight = canvasHeight - padding.top - padding.bottom;

    // Find min and max values
    const allValues = [...data];
    if (secondaryData) {
      allValues.push(...secondaryData);
    }
    
    let min = Math.min(...allValues);
    let max = Math.max(...allValues);
    
    // Add some padding to the Y axis
    const range = max - min;
    min = min - (range * 0.1);
    max = max + (range * 0.1);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      // Horizontal grid lines
      const horizontalLines = 5;
      for (let i = 0; i <= horizontalLines; i++) {
        const y = padding.top + (chartHeight * (1 - i / horizontalLines));
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartWidth, y);
        ctx.stroke();

        // Y-axis labels
        if (i < horizontalLines) {
          const value = min + (max - min) * (i / horizontalLines);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
          ctx.textAlign = 'right';
          ctx.textBaseline = 'middle';
          ctx.fillText(value.toFixed(1), padding.left - 8, y);
        }
      }

      // X-axis
      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top + chartHeight);
      ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
      ctx.stroke();
    }

    // Draw the line(s)
    const drawLine = (lineData, lineColor, lineWidth = 2) => {
      if (lineData.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      lineData.forEach((value, index) => {
        const x = padding.left + (index / (lineData.length - 1)) * chartWidth;
        const y = padding.top + chartHeight * (1 - (value - min) / (max - min));

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        // Draw points if enabled
        if (showPoints) {
          ctx.fillStyle = lineColor;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.stroke();

      // Add gradient under the line
      if (lineData === data) { // Only for primary line
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
        gradient.addColorStop(0, lineColor + '40');
        gradient.addColorStop(1, lineColor + '00');

        ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
        ctx.lineTo(padding.left, padding.top + chartHeight);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    };

    // Draw secondary line first (behind primary)
    if (secondaryData && secondaryData.length > 0) {
      drawLine(secondaryData, secondaryColor, 1.5);
    }

    // Draw primary line
    drawLine(data, color);

    // Draw title
    if (title) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(title, padding.left, 8);
    }

    // Draw axis labels
    if (yAxisLabel) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.translate(12, padding.top + chartHeight / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(yAxisLabel, 0, 0);
      ctx.restore();
    }

    if (xAxisLabel) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(xAxisLabel, padding.left + chartWidth / 2, padding.top + chartHeight + 20);
    }

    // Draw hover marker
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < data.length) {
      const x = padding.left + (hoverIndex / (data.length - 1)) * chartWidth;
      const y = padding.top + chartHeight * (1 - (data[hoverIndex] - min) / (max - min));

      // Draw vertical line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, padding.top + chartHeight);
      ctx.stroke();

      // Draw point
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      // Draw point outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.stroke();
    }

  }, [data, secondaryData, color, secondaryColor, dimensions, showGrid, showPoints, hoverIndex, title, xAxisLabel, yAxisLabel]);

  // Handle mouse move for tooltip
  const handleMouseMove = (e) => {
    if (!showTooltip || !containerRef.current || data.length < 2) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    const paddingLeft = 40;
    const chartWidth = dimensions.width - paddingLeft - 20;
    
    // Calculate which data point we're closest to
    const index = Math.round(((x - paddingLeft) / chartWidth) * (data.length - 1));
    
    if (index >= 0 && index < data.length) {
      setHoverIndex(index);
      
      // Position tooltip near the mouse
      setTooltip({
        x: e.clientX - rect.left,
        y: 20, // Fixed position near top
        value: data[index],
        index
      });
    } else {
      setHoverIndex(null);
      setTooltip(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setTooltip(null);
  };

  return (
    <div style={styles.container}>
      <div 
        ref={containerRef}
        style={styles.chartContainer}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          style={styles.canvas}
        />
        
        {/* Tooltip */}
        {showTooltip && tooltip && (
          <div style={{
            ...styles.tooltip,
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`
          }}>
            <div style={styles.tooltipContent}>
              <div style={styles.tooltipValue}>
                {tooltip.value.toFixed(1)}
              </div>
              <div style={styles.tooltipIndex}>
                Point {tooltip.index + 1} of {data.length}
              </div>
            </div>
            <div style={styles.tooltipArrow} />
          </div>
        )}
      </div>

      {/* Legend for multiple lines */}
      {(secondaryData && secondaryData.length > 0) && (
        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <div style={{
              ...styles.legendDot,
              backgroundColor: color
            }} />
            <span style={styles.legendText}>Primary</span>
          </div>
          <div style={styles.legendItem}>
            <div style={{
              ...styles.legendDot,
              backgroundColor: secondaryColor
            }} />
            <span style={styles.legendText}>Secondary</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Inbuilt CSS Styles
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  chartContainer: {
    position: 'relative',
    width: '100%',
    cursor: 'crosshair',
  },
  canvas: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    fontSize: '0.75rem',
    color: '#f8fafc',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    pointerEvents: 'none',
    zIndex: 10,
    transform: 'translateX(-50%)',
    minWidth: '100px',
  },
  tooltipContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.125rem',
  },
  tooltipValue: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#3b82f6',
  },
  tooltipIndex: {
    fontSize: '0.7rem',
    color: '#94a3b8',
  },
  tooltipArrow: {
    position: 'absolute',
    top: '100%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 0,
    height: 0,
    borderLeft: '6px solid transparent',
    borderRight: '6px solid transparent',
    borderTop: '6px solid rgba(30, 41, 59, 0.95)',
  },
  legend: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '0.75rem',
    padding: '0.5rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  legendDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  legendText: {
    fontSize: '0.75rem',
    color: '#94a3b8',
  },
};

export default LineChart;
