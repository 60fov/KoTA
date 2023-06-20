import { useSession } from "next-auth/react";
import DashboardLayout from "~/components/layouts/DashboardLayout";
import { type NextPageWithLayout } from "../_app";

const Stats: NextPageWithLayout = () => {
  const session = useSession({
    required: true,
  })

  return (
      <div className="text-front">stats</div>
  )
}

Stats.getLayout = DashboardLayout;

export default Stats;