import { diResolve } from "@/feature/common/features.di";
import InvoiceRepo, {
  invoiceRepoKey,
} from "@/feature/core/invoice/domain/i-repo/invoice.i-repo";
import InvoiceStatusSummary from "@/feature/core/invoice/domain/value-object/invoice-status.value-object";
import { invoiceModuleKey } from "@/feature/core/invoice/invoice.module-key";

export default function fetchInvoicesStatusSummary(): Promise<InvoiceStatusSummary> {
  const repo = diResolve<InvoiceRepo>(invoiceModuleKey, invoiceRepoKey);
  return repo.fetchInvoicesStatusSummary();
}
