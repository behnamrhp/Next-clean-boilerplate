import ApiTask from "@/feature/common/data/api-task";
import { InvoiceParam } from "@/feature/core/invoice/domain/param/invoice.param";
import InvoiceStatusSummary from "@/feature/core/invoice/domain/value-object/invoice-status.value-object";

export default interface InvoiceRepo {
  fetchAllInvoicesAmount(): Promise<number>;
  fetchInvoicesStatusSummary(): Promise<InvoiceStatusSummary>;
  createInvoice(params: InvoiceParam): ApiTask<string>;
}

export const invoiceRepoKey = "invoiceRepoKey";
