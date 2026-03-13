import { Badge } from "./index.jsx";

const STATUS_CONFIG = {
  APPLIED: { variant: "accent", label: "Applied" },
  REFERRED: { variant: "success", label: "Referred ✓" },
  NOT_SHORTLISTED: { variant: "danger", label: "Not Shortlisted" },
  NO_REFERRER_AVAILABLE: { variant: "warning", label: "No Referrer" },
  FORWARDED: { variant: "neutral", label: "Forwarded" },
};

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || { variant: "default", label: status };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
