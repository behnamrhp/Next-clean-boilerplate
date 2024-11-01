
export default interface InvoiceRepo {
    fetchAllInvoicesAmount(): Promise<number>
}

export const invoiceRepoKey = "invoiceRepoKey"