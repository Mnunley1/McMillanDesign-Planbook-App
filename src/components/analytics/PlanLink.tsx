import { Link } from "react-router-dom";

interface PlanLinkProps {
  planId: string;
  planNumber: string;
}

export default function PlanLink({ planId, planNumber }: PlanLinkProps) {
  return (
    <Link
      className="font-medium text-primary hover:underline"
      to={`/plan/${planId}/detail`}
    >
      {planNumber}
    </Link>
  );
}
