import { LatestInvoicesSkeleton, RevenueChartSkeleton } from "@/app/[lang]/dashboard/components/server/skeletons/skeletons";
import CardWrapper from "@/app/[lang]/dashboard/components/server/cards/cards";
import LatestInvoices from "@/app/[lang]/dashboard/components/server/latest-invoices/latest-invoices";
import RevenueChart from "@/app/[lang]/dashboard/components/server/revenue-chart/revenue-chart";
import { Suspense } from "react";
import { getTranslation } from "@/bootstrap/i18n/i18n";

export default async function Dashboard(props: {params: Promise<{lang: string}>}) {
  const {lang} = await props.params 
  const { t } = await getTranslation(lang)
  return (
    <main>
      <h1 className={`mb-4 text-xl md:text-2xl`}>
        {t("global.dashboard")} 
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <CardWrapper />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart  />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  )
}
