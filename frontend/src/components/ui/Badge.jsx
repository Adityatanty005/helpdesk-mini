import React from "react";

function clsx(...parts) {
  return parts.filter(Boolean).join(" ");
}

const tone = {
  gray: "bg-gray-100 text-gray-800 ring-gray-200",
  green: "bg-green-100 text-green-800 ring-green-200",
  yellow: "bg-yellow-100 text-yellow-800 ring-yellow-200",
  red: "bg-rose-100 text-rose-800 ring-rose-200",
  blue: "bg-blue-100 text-blue-800 ring-blue-200",
};

export function Badge({ color = "gray", className = "", children }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        tone[color],
        className
      )}
    >
      {children}
    </span>
  );
}
