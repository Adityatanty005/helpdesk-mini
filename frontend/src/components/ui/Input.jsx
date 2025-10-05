import React, { forwardRef } from "react";

export const Label = ({ className = "", children, ...props }) => (
  <label className={"block text-sm font-medium text-gray-700 " + className} {...props}>
    {children}
  </label>
);

export const Input = forwardRef(function Input({ className = "", ...props }, ref) {
  return (
    <input
      ref={ref}
      className={
        "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 " +
        className
      }
      {...props}
    />
  );
});

export const Field = ({ className = "", children }) => (
  <div className={"space-y-1 " + className}>{children}</div>
);
