import React from "react";

type NotFoundProps = {
  title?: string;
  message?: string;
  icon?: "document" | "tag" | "search" | "custom";
  customIcon?: React.ReactNode;
  action?: React.ReactNode;
};

const NotFound: React.FC<NotFoundProps> = ({
  title = "No items found",
  message = "No items match your search criteria.",
  icon = "document",
  customIcon,
  action,
}) => {
  const renderIcon = () => {
    if (customIcon) {
      return customIcon;
    }

    switch (icon) {
      case "document":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <path d="M13 2v7h7"></path>
            <circle cx="12" cy="15" r="2"></circle>
            <path d="M10 10.5v-1a1.5 1.5 0 0 1 3 0v1"></path>
          </svg>
        );
      case "tag":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
            <line x1="7" y1="7" x2="7.01" y2="7"></line>
          </svg>
        );
      case "search":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="mb-6 text-gray-400">{renderIcon()}</div>
      <h3 className="text-xl font-medium text-gray-700 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};

export default NotFound; 