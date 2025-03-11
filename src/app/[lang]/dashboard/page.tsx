import {
  LatestInvoicesSkeleton,
  RevenueChartSkeleton,
} from "@/app/[lang]/dashboard/components/server/skeletons";
import RevenueChart from "@/app/[lang]/dashboard/components/server/revenue-chart";
import { Suspense } from "react";
import LatestInvoices from "@/app/[lang]/dashboard/components/server/latest-invoices";

export default async function Dashboard() {
  return (
    <main>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
