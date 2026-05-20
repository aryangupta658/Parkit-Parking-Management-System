function StatusBadge({ value }) {
  const normalized = value?.toLowerCase();

  let className = "status-badge";

  if (
    normalized === "paid" ||
    normalized === "confirmed" ||
    normalized === "completed" ||
    normalized === "available"
  ) {
    className += " success";
  } else if (
    normalized === "pending" ||
    normalized === "reserved" ||
    normalized === "maintenance"
  ) {
    className += " warning";
  } else if (
    normalized === "cancelled" ||
    normalized === "failed" ||
    normalized === "refunded" ||
    normalized === "occupied"
  ) {
    className += " danger";
  }

  return <span className={className}>{value}</span>;
}

export default StatusBadge;
