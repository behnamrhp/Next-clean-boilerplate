import InvoiceStatusSummary from "@/feature/invoice/domain/value-object/invoice-status"

export default interface InvoiceRepo {
    fetchAllInvoicesAmount(): Promise<number>
    fetchInvoicesStatusSummary(): Promise<InvoiceStatusSummary>
}

export const invoiceRepoKey = "invoiceRepoKey"