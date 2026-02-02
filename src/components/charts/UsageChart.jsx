// ...UsageChart component...
import { useEffect, useRef, useState } from 'react';

const UsageChart = ({
  // Primary usage data
  used = 0,
  total = 100,
  unit = 'GB',
  
  // Optional breakdown data (for stacked view)
  breakdown = null, // [{ label: 'Used', value: 50, color: '#22c55e' }, ...]
  
  // Configuration
  height = 160,
  width = '100%',
  showLabels = true,
  showLegend = true,
  showTooltip = true,
  showThresholds = true,
  
  // Labels
  title = '',
  showTitle = false,
  
  // Thresholds (percentage)
  warningThreshold = 75,
  dangerThreshold = 90,
  
  // Colors
  usedColor = null,
  freeColor = 'rgba(255, 255, 255, 0.1)',
  
  // Style
  type = 'bar', // 'bar' or 'circular' or 'horizontal-bar'
  animate = true,
  
  // Callback
  onHover = null
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 400, height });
  const [hoverState, setHoverState] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Calculate values
  const percentage = total > 0 ? (used / total) * 100 : 0;
  const free = total - used;
  
  // Determine color based on thresholds
  const getUsageColor = () => {
    if (usedColor) return usedColor;
    
    if (percentage >= dangerThreshold) return '#ef4444';
    if (percentage >= warningThreshold) return '#facc15';
    return '#22c55e';
  };

  const currentColor = getUsageColor();

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

  // Animation effect
  useEffect(() => {
    if (!animate) {
      setAnimationProgress(1);
      return;
    }

    const duration = 1000; // 1 second animation
    const startTime = Date.now();
    const startProgress = animationProgress;

    const animateFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentProgress = startProgress + (1 - startProgress) * easedProgress;
      
      setAnimationProgress(currentProgress);
      
      if (progress < 1) {
        requestAnimationFrame(animateFrame);
      }
    };

    requestAnimationFrame(animateFrame);
  }, [used, total, animate, animationProgress]);

  // Draw chart
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width: canvasWidth, height: canvasHeight } = dimensions;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Calculate padding
    const padding = {
      top: showTitle ? 30 : 10,
      right: 20,
      bottom: showLabels ? 40 : 10,
      left: 20
    };

    const drawVerticalBarChart = (ctx, canvasWidth, canvasHeight, padding) => {
      const chartWidth = canvasWidth - padding.left - padding.right;
      const chartHeight = canvasHeight - padding.top - padding.bottom;
      
      // Draw background
      ctx.fillStyle = freeColor;
      ctx.fillRect(
        padding.left,
        padding.top,
        chartWidth,
        chartHeight
      );
      
      // Draw used portion with animation
      const animatedPercentage = percentage * animationProgress;
      const usedHeight = chartHeight * (animatedPercentage / 100);
      
      ctx.fillStyle = currentColor;
      ctx.fillRect(
        padding.left,
        padding.top + chartHeight - usedHeight,
        chartWidth,
        usedHeight
      );
      
      // Draw threshold lines
      if (showThresholds) {
        const thresholds = [
          { value: warningThreshold, color: 'rgba(250, 204, 21, 0.3)' },
          { value: dangerThreshold, color: 'rgba(239, 68, 68, 0.3)' }
        ];
        
        thresholds.forEach(threshold => {
          const y = padding.top + chartHeight - (chartHeight * threshold.value / 100);
          
          ctx.strokeStyle = threshold.color;
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(padding.left, y);
          ctx.lineTo(padding.left + chartWidth, y);
          ctx.stroke();
          ctx.setLineDash([]);
        });
      }
      
      // Draw labels
      if (showLabels) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        // Used label at bottom
        ctx.fillText(
          `${used.toFixed(1)} ${unit} used`,
          padding.left + chartWidth / 2,
          padding.top + chartHeight + 15
        );
        
        // Percentage label at top of used section
        if (usedHeight > 20) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
          ctx.textBaseline = 'bottom';
          ctx.fillText(
            `${percentage.toFixed(1)}%`,
            padding.left + chartWidth / 2,
            padding.top + chartHeight - usedHeight - 5
          );
        }
        
        // Total label at very bottom
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '9px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textBaseline = 'top';
        ctx.fillText(
          `Total: ${total.toFixed(1)} ${unit}`,
          padding.left + chartWidth / 2,
          padding.top + chartHeight + 30
        );
      }
    };

    const drawHorizontalBarChart = (ctx, canvasWidth, canvasHeight, padding) => {
      const chartWidth = canvasWidth - padding.left - padding.right;
      const chartHeight = canvasHeight - padding.top - padding.bottom;
      const barHeight = Math.min(30, chartHeight * 0.6);
      const barTop = padding.top + (chartHeight - barHeight) / 2;
      
      // Draw background (free)
      ctx.fillStyle = freeColor;
      ctx.fillRect(
        padding.left,
        barTop,
        chartWidth,
        barHeight
      );
      
      // Draw used portion with animation
      const animatedPercentage = percentage * animationProgress;
      const usedWidth = chartWidth * (animatedPercentage / 100);
      
      ctx.fillStyle = currentColor;
      ctx.fillRect(
        padding.left,
        barTop,
        usedWidth,
        barHeight
      );
      
      // Rounded edges
      ctx.beginPath();
      ctx.roundRect(padding.left, barTop, usedWidth, barHeight, 4);
      ctx.fill();
      
      // Draw labels inside the bar
      if (showLabels) {
        const labelX = padding.left + 10;
        const labelY = barTop + barHeight / 2;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        if (usedWidth > 60) {
          ctx.fillText(`${percentage.toFixed(1)}%`, labelX, labelY);
        }
        
        // Draw total on the right
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.textAlign = 'right';
        ctx.fillText(
          `${used.toFixed(1)} / ${total.toFixed(1)} ${unit}`,
          padding.left + chartWidth - 10,
          labelY
        );
      }
    };

    const drawCircularChart = (ctx, canvasWidth, canvasHeight, padding) => {
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      const radius = Math.min(canvasWidth, canvasHeight) * 0.35;
      const lineWidth = 12;
      
      // Draw background circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = freeColor;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      
      // Draw used arc with animation
      const animatedPercentage = percentage * animationProgress;
      const endAngle = (Math.PI * 2 * animatedPercentage / 100) - (Math.PI / 2);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
      ctx.lineCap = 'butt';
      
      // Draw threshold markers
      if (showThresholds) {
        const thresholds = [
          { value: warningThreshold, color: 'rgba(250, 204, 21, 0.5)' },
          { value: dangerThreshold, color: 'rgba(239, 68, 68, 0.5)' }
        ];
        
        thresholds.forEach(threshold => {
          const angle = (Math.PI * 2 * threshold.value / 100) - (Math.PI / 2);
          const markerRadius = radius + 8;
          
          const x = centerX + Math.cos(angle) * markerRadius;
          const y = centerY + Math.sin(angle) * markerRadius;
          
          ctx.fillStyle = threshold.color;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    };

    // Draw based on chart type
    if (type === 'circular') {
      drawCircularChart(ctx, canvasWidth, canvasHeight, padding);
    } else if (type === 'horizontal-bar') {
      drawHorizontalBarChart(ctx, canvasWidth, canvasHeight, padding);
    } else {
      drawVerticalBarChart(ctx, canvasWidth, canvasHeight, padding);
    }

    // Draw title
    if (showTitle && title) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(title, padding.left, 8);
    }

    // Draw current value in center (for circular)
    if (type === 'circular') {
      const centerX = canvasWidth / 2;
      const centerY = canvasHeight / 2;
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${percentage.toFixed(1)}%`, centerX, centerY - 10);
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(`${used.toFixed(1)} / ${total.toFixed(1)} ${unit}`, centerX, centerY + 10);
    }

    // Draw hover effect
    if (hoverState && showTooltip) {
      const { type: hoverType, x, y } = hoverState;
      
      // Draw tooltip background
      ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      
      const tooltipWidth = 120;
      const tooltipHeight = 60;
      const tooltipX = Math.min(x, canvasWidth - tooltipWidth - 10);
      const tooltipY = y - tooltipHeight - 10;
      
      // Rounded rectangle
      ctx.beginPath();
      ctx.roundRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight, 6);
      ctx.fill();
      ctx.stroke();
      
      // Tooltip content
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(hoverType === 'used' ? 'Used Space' : 'Free Space', tooltipX + 10, tooltipY + 10);
      
      ctx.fillStyle = hoverType === 'used' ? currentColor : 'rgba(255, 255, 255, 0.6)';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, monospace';
      ctx.fillText(
        hoverType === 'used' 
          ? `${used.toFixed(1)} ${unit}`
          : `${free.toFixed(1)} ${unit}`,
        tooltipX + 10, 
        tooltipY + 30
      );
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(
        hoverType === 'used' 
          ? `${percentage.toFixed(1)}% of total`
          : `${(100 - percentage).toFixed(1)}% free`,
        tooltipX + 10, 
        tooltipY + 45
      );
      
      // Draw arrow
      ctx.beginPath();
      ctx.moveTo(x, y - 10);
      ctx.lineTo(x - 8, y);
      ctx.lineTo(x + 8, y);
      ctx.closePath();
      ctx.fillStyle = 'rgba(30, 41, 59, 0.95)';
      ctx.fill();
    }

  }, [dimensions, used, total, percentage, currentColor, hoverState, animationProgress, type, freeColor, showThresholds, showLabels, showTitle, showTooltip, title, unit, free, warningThreshold, dangerThreshold]);

  const handleMouseMove = (e) => {
    if (!showTooltip || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const paddingLeft = 20;
    const chartWidth = dimensions.width - paddingLeft - 20;
    
    // Determine if hovering over used or free area
    const percentageWidth = (percentage / 100) * chartWidth;
    
    if (type === 'horizontal-bar') {
      if (x >= paddingLeft && x <= paddingLeft + percentageWidth) {
        setHoverState({ type: 'used', x, y });
        if (onHover) onHover('used', used, percentage);
      } else if (x >= paddingLeft && x <= paddingLeft + chartWidth) {
        setHoverState({ type: 'free', x, y });
        if (onHover) onHover('free', free, 100 - percentage);
      } else {
        setHoverState(null);
      }
    } else {
      // For vertical and circular charts, just show used on hover
      setHoverState({ type: 'used', x, y });
      if (onHover) onHover('used', used, percentage);
    }
  };

  const handleMouseLeave = () => {
    setHoverState(null);
    if (onHover) onHover(null, 0, 0);
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
      </div>

      {/* Legend for breakdown data */}
      {showLegend && breakdown && breakdown.length > 0 && (
        <div style={styles.legend}>
          {breakdown.map((item, index) => (
            <div key={index} style={styles.legendItem}>
              <div style={{
                ...styles.legendDot,
                backgroundColor: item.color || currentColor
              }} />
              <span style={styles.legendText}>
                {item.label}: {item.value.toFixed(1)} {unit}
              </span>
            </div>
          ))}
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
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
  },
  chartContainer: {
    position: 'relative',
    width: '100%',
    cursor: 'pointer',
  },
  canvas: {
    display: 'block',
    width: '100%',
    height: '100%',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '0.75rem',
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
    color: '#9ca3af',
  },
};

export default UsageChart;
