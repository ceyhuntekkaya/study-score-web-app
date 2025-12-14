import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  title,
  subtitle,
  onClick,
}) => {
  return (
    <div
      className={`
        bg-white 
        dark:bg-slate-800 
        rounded-lg 
        shadow 
        hover:shadow-md 
        transition-all 
        duration-300 
        border 
        border-slate-200 
        dark:border-slate-700 
        p-5 min-h-[180px]
        ${onClick ? "cursor-pointer" : ""} 
        ${className}
      `}
      onClick={onClick}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}
      <div className="text-slate-700 dark:text-slate-300">{children}</div>
    </div>
  );
};

export default Card;
