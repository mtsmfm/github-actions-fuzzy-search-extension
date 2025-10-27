interface SpinnerProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
  className?: string;
}

export function Spinner({
  size = 20,
  strokeWidth = 3,
  color = "currentColor",
  className = "",
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={className}
      style={{
        display: "inline-block",
        lineHeight: 0,
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        style={{
          display: "block",
          animation: "spinner-rotate 1.2s linear infinite",
        }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray="90 150"
          strokeDashoffset="0"
          style={{
            transformOrigin: "center",
            animation: "spinner-dash 1.5s ease-in-out infinite",
          }}
        />
      </svg>

      <style>{`
        @keyframes spinner-rotate {
          100% { transform: rotate(360deg); }
        }

        @keyframes spinner-dash {
          0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -40;
          }
          100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -120;
          }
        }
      `}</style>
    </span>
  );
}
