import serverDi from "@/feature/common/server-di";
import InvoiceRepo, { invoiceRepoKey } from "@/feature/invoice/domain/i-repo/invoice-repo";
import InvoiceStatusSummary from "@/feature/invoice/domain/value-object/invoice-status";
import { invoiceModuleKey } from "@/feature/invoice/invoice-module-key";

export default function fetchInvoicesStatusSummary(): Promise<InvoiceStatusSummary> {
    const repo = serverDi(invoiceModuleKey).resolve<InvoiceRepo>(invoiceRepoKey)
    return repo.fetchInvoicesStatusSummary()
}