import CustomerInvoice from "@/feature/customer-invoice/domain/entity/customer-invoice"

export default interface CustomerInvoiceRepo {
    fetchList(): Promise<CustomerInvoice[]>
}

export const customerInvoiceRepoKey = "customerInvoiceRepoKey"