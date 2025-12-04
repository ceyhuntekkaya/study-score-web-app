'use client';

interface DashboardStatsCardProps {
  icon: string;
  iconBg: string;
  count: number;
  label: string;
  color: string;
}

/**
 * Dashboard Stats Card Component
 * Converted from template
 */
export default function DashboardStatsCard({
  icon,
  iconBg,
  count,
  label,
  color,
}: DashboardStatsCardProps) {
  return (
    <div className={`rbt-counterup variation-01 rbt-hover-03 rbt-border-dashed ${iconBg}`}>
      <div className="inner">
        <div className={`rbt-round-icon ${iconBg}`}>
          <i className={icon}></i>
        </div>
        <div className="content">
          <h3 className={`counter without-icon ${color}`}>
            <span className="odometer" data-count={count}>
              {count}
            </span>
          </h3>
          <span className="rbt-title-style-2 d-block">{label}</span>
        </div>
      </div>
    </div>
  );
}

