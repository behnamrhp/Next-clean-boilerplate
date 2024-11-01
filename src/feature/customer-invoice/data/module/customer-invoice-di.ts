import di from "@/bootstrap/di/init-di";
import { customerInvoiceRepoKey } from "@/feature/customer-invoice/domain/i-repo/customer-invoice-repo";
import fetchCustomerInvoicesUsecase from "@/feature/customer-invoice/domain/usecase/fetch-customer-invoices-usecase";
import CustomerDbRepo from "@/feature/customer/data/repo/customer-db-repo";
import { DependencyContainer } from "tsyringe";

export default function getCustomerInvoiceInvoiceDi(): DependencyContainer {
    const customerInvoiceDi = di.createChildContainer()

    customerInvoiceDi.register(fetchCustomerInvoicesUsecase.name, {
        useValue: fetchCustomerInvoicesUsecase
    })

    customerInvoiceDi.register(customerInvoiceRepoKey, CustomerDbRepo)
    return customerInvoiceDi
}