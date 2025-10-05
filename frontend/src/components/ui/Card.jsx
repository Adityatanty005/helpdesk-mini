import React from "react";

export function Card({ className = "", children }) {
  return (
    <div className={"bg-white rounded-xl shadow-sm border border-gray-100 " + className}>
      {children}
    </div>
  );
}

export function CardBody({ className = "", children }) {
  return <div className={"p-4 sm:p-6 " + className}>{children}</div>;
}

export function CardHeader({ className = "", children }) {
  return (
    <div className={"px-4 sm:px-6 pt-4 sm:pt-6 pb-2 border-b border-gray-100 " + className}>
      {children}
    </div>
  );
}

export function CardTitle({ className = "", children }) {
  return (
    <h3 className={"text-lg sm:text-xl font-semibold text-gray-900 " + className}>{children}</h3>
  );
}
