import { cn } from '../../utils/cn';

interface HeatmapChartProps {
  data: Array<{
    x: string;
    y: string;
    value: number;
    label?: string;
  }>;
  xLabels: string[];
  yLabels: string[];
  height?: number;
  className?: string;
  colorScale?: string[];
  showValues?: boolean;
  formatValue?: (value: number) => string;
  emptyColor?: string;
}

const DEFAULT_COLOR_SCALE = [
  '#f0f9ff', // 0
  '#bae6fd', // 0.2
  '#7dd3fc', // 0.4
  '#38bdf8', // 0.6
  '#0ea5e9', // 0.8
  '#0284c7', // 1.0
];

export function HeatmapChart({
  data,
  xLabels,
  yLabels,
  height = 300,
  className = '',
  colorScale = DEFAULT_COLOR_SCALE,
  showValues = true,
  formatValue,
  emptyColor = '#f5f5f5',
}: HeatmapChartProps) {
  if (!data.length) {
    return (
      <div className={cn('flex items-center justify-center h-64 bg-neutral-50 rounded-lg border border-neutral-200', className)}>
        <p className="text-neutral-500">No data available</p>
      </div>
    );
  }

  // Find min/max for normalization
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const getColor = (value: number) => {
    const normalized = (value - min) / range;
    const index = Math.min(Math.floor(normalized * (colorScale.length - 1)), colorScale.length - 2);
    return colorScale[index];
  };

  const cellSize = Math.min(
    (height - 60) / Math.max(yLabels.length, 1),
    40
  );

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div style={{ height }} className="flex items-start">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between pr-3 min-w-[120px]" style={{ height: yLabels.length * cellSize }}>
          {yLabels.map((label) => (
            <div
              key={label}
              className="text-right text-sm text-neutral-600 font-medium"
              style={{ height: cellSize, lineHeight: `${cellSize}px` }}
            >
              {label}
            </div>
          ))}
        </div>
        
        {/* Heatmap grid */}
        <div className="flex-1 relative">
          <div className="flex flex-col" style={{ height: yLabels.length * cellSize }}>
            {yLabels.map((yLabel) => (
              <div
                key={yLabel}
                className="flex"
                style={{ height: cellSize }}
              >
                {xLabels.map((xLabel) => {
                  const cellData = data.find(d => d.x === xLabel && d.y === yLabel);
                  const value = cellData?.value ?? 0;
                  const color = value === 0 && !cellData ? emptyColor : getColor(value);
                  
                  return (
                    <div
                      key={xLabel}
                      className="relative flex items-center justify-center border border-neutral-100"
                      style={{ 
                        width: `${100 / xLabels.length}%`,
                        height: '100%',
                        backgroundColor: color,
                      }}
                      title={cellData?.label || (formatValue ? formatValue(value) : value.toLocaleString())}
                    >
                      {showValues && cellData && (
                        <span className="text-xs font-medium text-white drop-shadow-sm">
                          {formatValue ? formatValue(value) : value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex" style={{ height: 40 }}>
            {xLabels.map((label, i) => (
              <div
                key={label}
                className="text-center text-xs text-neutral-500"
                style={{ width: `${100 / xLabels.length}%`, paddingTop: 4 }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>
        
        {/* Color legend */}
        <div className="ml-4 flex flex-col items-center justify-center min-w-[80px]">
          <span className="text-xs font-medium text-neutral-600 mb-2">Scale</span>
          <div className="flex flex-col-reverse" style={{ height: Math.min(200, yLabels.length * cellSize) }}>
            {colorScale.map((color, index) => (
              <div
                key={index}
                className="w-6 h-8 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-neutral-500 mt-2 w-16">
            <span>{formatValue ? formatValue(max) : max.toLocaleString()}</span>
            <span>{formatValue ? formatValue(min) : min.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}