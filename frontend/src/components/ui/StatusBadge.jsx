import React from "react";
import { Badge } from "./Badge";

const STATUS_COLOR = {
  open: "green",
  "in-progress": "yellow",
  closed: "gray",
  pending: "blue",
  escalated: "red",
};

export function StatusBadge({ status }) {
  const key = String(status || "").toLowerCase();
  const color = STATUS_COLOR[key] || "gray";
  return <Badge color={color} className="capitalize">{status}</Badge>;
}
