interface Props {
  size?: number;
  baseColor?: string;
  accentColor?: string;
  baseOpacity?: number;
  accentOpacity?: number;
  borderWidth?: number;
  borderOpacity?: number;
  className?: string;
}

export const DuotoneHouse: React.FC<Props> = ({
  size = 24,
  baseColor = "currentColor",
  accentColor = "currentColor",
  baseOpacity = 0.2,
  accentOpacity = 0.6,
  borderWidth = 1.5,
  borderOpacity = 0.4,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Background/base shape */}
      <path
        d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        fill={baseColor}
        fillOpacity={baseOpacity}
      />

      {/* Foreground/accent elements */}
      <path
        d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
        fill={accentColor}
        fillOpacity={accentOpacity}
      />

      {/* Border outline */}
      <path
        d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DuotoneRocket: React.FC<Props> = ({
  size = 24,
  baseColor = "currentColor",
  accentColor = "currentColor",
  baseOpacity = 0.2,
  accentOpacity = 0.6,
  borderWidth = 1.5,
  borderOpacity = 0.4,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Background/base shapes */}
      <path
        d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
        fill={baseColor}
        fillOpacity={baseOpacity}
      />

      <path
        d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
        fill={baseColor}
        fillOpacity={baseOpacity}
      />

      <path
        d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
        fill={baseColor}
        fillOpacity={baseOpacity}
      />

      {/* Foreground/accent elements - rocket flame/exhaust */}
      <path
        d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
        fill={accentColor}
        fillOpacity={accentOpacity}
      />

      {/* Border outline */}
      <path
        d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DuotoneCart: React.FC<Props> = ({
  size = 24,
  baseColor = "currentColor",
  accentColor = "currentColor",
  baseOpacity = 0.2,
  accentOpacity = 0.6,
  borderWidth = 1.5,
  borderOpacity = 0.4,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Background/base shape - cart body */}
      <path
        d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
        fill={baseColor}
        fillOpacity={baseOpacity}
      />

      {/* Foreground/accent elements - wheels */}
      <circle
        cx="8"
        cy="21"
        r="1"
        fill={accentColor}
        fillOpacity={accentOpacity}
      />

      <circle
        cx="19"
        cy="21"
        r="1"
        fill={accentColor}
        fillOpacity={accentOpacity}
      />

      {/* Border outline */}
      <path
        d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="8"
        cy="21"
        r="1"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
      />

      <circle
        cx="19"
        cy="21"
        r="1"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
      />
    </svg>
  );
};

export const DuotoneBolt: React.FC<Props> = ({
  size = 24,
  baseColor = "currentColor",
  accentColor = "currentColor",
  baseOpacity = 0.2,
  accentOpacity = 0.6,
  borderWidth = 1.5,
  borderOpacity = 0.4,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Background/base shape - hexagon */}
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
        fill={baseColor}
        fillOpacity={baseOpacity}
      />

      {/* Foreground/accent element - center circle */}
      <circle
        cx="12"
        cy="12"
        r="4"
        fill={accentColor}
        fillOpacity={accentOpacity}
      />

      {/* Border outline */}
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
      />
    </svg>
  );
};

export const DuotoneActivity: React.FC<Props> = ({
  size = 24,
  baseColor = "currentColor",
  accentColor = "currentColor",
  baseOpacity = 0.2,
  accentOpacity = 0.6,
  borderWidth = 1.5,
  borderOpacity = 0.4,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Background/base shape - baseline segments */}
      <path
        d="M22 12h-2.48"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth * 2}
        strokeOpacity={baseOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M4.49 12H2"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth * 2}
        strokeOpacity={baseOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Foreground/accent element - main pulse/activity wave */}
      <path
        d="M19.52 13.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12a2 2 0 0 0 1.93-1.46"
        fill="none"
        stroke={accentColor}
        strokeWidth={borderWidth * 2}
        strokeOpacity={accentOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Border outline - full path */}
      <path
        d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DuotoneSearch: React.FC<Props> = ({
  size = 24,
  baseColor = "currentColor",
  accentColor = "currentColor",
  baseOpacity = 0.2,
  accentOpacity = 0.6,
  borderWidth = 1.5,
  borderOpacity = 0.4,
  className = "",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Background/base shape - magnifying glass lens */}
      <circle
        cx="11"
        cy="11"
        r="8"
        fill={baseColor}
        fillOpacity={baseOpacity}
      />

      {/* Foreground/accent element - handle/search action */}
      <path
        d="m21 21-4.34-4.34"
        fill="none"
        stroke={accentColor}
        strokeWidth={borderWidth * 2}
        strokeOpacity={accentOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Border outline */}
      <circle
        cx="11"
        cy="11"
        r="8"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
      />

      <path
        d="m21 21-4.34-4.34"
        fill="none"
        stroke={baseColor}
        strokeWidth={borderWidth}
        strokeOpacity={borderOpacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
