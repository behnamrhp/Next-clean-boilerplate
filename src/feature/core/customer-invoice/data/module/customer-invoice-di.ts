import di from "@/bootstrap/di/init-di";
import { customerInvoiceRepoKey } from "@/feature/core/customer-invoice/domain/i-repo/customer-invoice-repo";
import fetchCustomerInvoicesUsecase from "@/feature/core/customer-invoice/domain/usecase/fetch-customer-invoices-usecase";
import CustomerDbRepo from "@/feature/core/customer/data/repo/customer-db-repo";
import { DependencyContainer } from "tsyringe";

export default function getCustomerInvoiceDi(): DependencyContainer {
    const customerInvoiceDi = di.createChildContainer()

    customerInvoiceDi.register(fetchCustomerInvoicesUsecase.name, {
        useValue: fetchCustomerInvoicesUsecase
    })

    customerInvoiceDi.register(customerInvoiceRepoKey, CustomerDbRepo)
    return customerInvoiceDi
}