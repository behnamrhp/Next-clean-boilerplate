import fetchCustomersAmountUsecase from "@/feature/core/customer/domain/usecase/fetch-customers-amount-usecase";
import fetchAllInvoicesAmountUsecase from "@/feature/core/invoice/domain/usecase/fetch-all-invoices-amount.usecase";
import fetchInvoicesStatusSummary from "@/feature/core/invoice/domain/usecase/fetch-invoices-status-summary.usecase";
import { DependencyContainer } from "tsyringe";

export default function getSummaryInfoDi(di: DependencyContainer) {
  di.register(fetchAllInvoicesAmountUsecase.name, {
    useValue: fetchAllInvoicesAmountUsecase,
  });
  di.register(fetchCustomersAmountUsecase.name, {
    useValue: fetchCustomersAmountUsecase,
  });
  di.register(fetchInvoicesStatusSummary.name, {
    useValue: fetchInvoicesStatusSummary,
  });
  return di;
}
