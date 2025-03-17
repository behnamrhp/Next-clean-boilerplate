import { Card } from "@/app/[lang]/dashboard/components/server/card";
import fetchSummaryInfoController from "@/app/[lang]/dashboard/controller/fetch-summary-info.controller";

export default async function CardWrapper() {
  const { customersNumber, invoicesNumber, invoicesSummary } =
    await fetchSummaryInfoController();

  return (
    <>
      <Card title="Collected" value={invoicesSummary.paid} type="collected" />
      <Card title="Pending" value={invoicesSummary.pending} type="pending" />
      <Card title="Total Invoices" value={invoicesNumber} type="invoices" />
      <Card title="Total Customers" value={customersNumber} type="customers" />
    </>
  );
}
