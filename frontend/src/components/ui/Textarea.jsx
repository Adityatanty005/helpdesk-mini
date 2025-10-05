import React, { forwardRef } from "react";

export const Textarea = forwardRef(function Textarea({ className = "", rows = 5, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={
        "block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 min-h-[120px] " +
        className
      }
      {...props}
    />
  );
});
