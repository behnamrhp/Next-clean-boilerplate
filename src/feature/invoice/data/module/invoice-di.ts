import di from "@/bootstrap/di/init-di";
import invoiceDbRepo from "@/feature/invoice/data/repo/invoice-db-repo";
import { invoiceRepoKey } from "@/feature/invoice/domain/i-repo/invoice-repo";
import fetchAllInvoicesAmountUsecase from "@/feature/invoice/domain/usecase/fetch-all-invoices-amount-usecase";
import { DependencyContainer } from "tsyringe";

export default function getInvoiceDi(): DependencyContainer {
    const invoiceDi = di.createChildContainer()

    invoiceDi.register(fetchAllInvoicesAmountUsecase.name, {
        useValue: fetchAllInvoicesAmountUsecase 
    })

    invoiceDi.register(invoiceRepoKey, invoiceDbRepo)
    return invoiceDi
}