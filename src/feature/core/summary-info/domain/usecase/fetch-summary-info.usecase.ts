import serverDi from "@/feature/common/features.di";
import fetchCustomersAmountUsecase from "@/feature/core/customer/domain/usecase/fetch-customers-amount-usecase";
import fetchAllInvoicesAmountUsecase from "@/feature/core/invoice/domain/usecase/fetch-all-invoices-amount.usecase";
import fetchInvoicesStatusSummary from "@/feature/core/invoice/domain/usecase/fetch-invoices-status-summary.usecase";
import { summaryInfoModuleKey } from "@/feature/core/summary-info/domain/summary-info.module-key";
import SummaryInfo from "@/feature/core/summary-info/domain/value-object/summary-info.value-object";

export default async function fetchSummaryInfoUsecase(): Promise<SummaryInfo> {
  try {
    const summaryInfoDi = serverDi(summaryInfoModuleKey);
    const invoicesAmountPromise = summaryInfoDi.resolve<
      typeof fetchAllInvoicesAmountUsecase
    >(fetchAllInvoicesAmountUsecase.name)();
    const customersAmountPromise = summaryInfoDi.resolve<
      typeof fetchCustomersAmountUsecase
    >(fetchCustomersAmountUsecase.name)();
    const invoiceSummaryPomise = summaryInfoDi.resolve<
      typeof fetchInvoicesStatusSummary
    >(fetchInvoicesStatusSummary.name)();

    const [invoicesAmount, customersAmount, invoicesSummary] =
      await Promise.all([
        invoicesAmountPromise,
        customersAmountPromise,
        invoiceSummaryPomise,
      ]);

    return new SummaryInfo({
      invoicesNumber: invoicesAmount,
      customersNumber: customersAmount,
      invoicesSummary,
    });
  } catch {
    throw new Error("Failed to fetch card data.");
  }
}
