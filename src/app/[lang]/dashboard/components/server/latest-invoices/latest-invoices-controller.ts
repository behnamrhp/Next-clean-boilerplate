import fetchCustomerInvoicesUsecase from "@/feature/core/customer-invoice/domain/usecase/fetch-customer-invoices-usecase";

export default async function latestInvoicesController() {
    return await fetchCustomerInvoicesUsecase()
}