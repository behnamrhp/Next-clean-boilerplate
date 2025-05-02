import { diResolve } from "@/feature/common/features.di";
import InvoiceRepo, {
  invoiceRepoKey,
} from "@/feature/core/invoice/domain/i-repo/invoice.i-repo";
import { invoiceModuleKey } from "@/feature/core/invoice/invoice.module-key";

export default function fetchAllInvoicesAmountUsecase(): Promise<number> {
  const repo = diResolve<InvoiceRepo>(invoiceModuleKey, invoiceRepoKey);

  return repo.fetchAllInvoicesAmount();
}
