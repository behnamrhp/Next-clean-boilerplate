import CreateRandomInvoiceButtonVM from "@/app/dashboard/vm/create-random-invoice-button-vm";
import di from "@/bootstrap/di/init-di"
import createInvoiceUsecase from "@/feature/core/invoice/domain/usecase/create-invoice-usecase";

export default function dashboardAppModule() {
    const dashboardDi = di.createChildContainer()
    
    dashboardDi.register(createInvoiceUsecase.name, {
        useValue: createInvoiceUsecase
    })
    dashboardDi.register(CreateRandomInvoiceButtonVM, CreateRandomInvoiceButtonVM)
    return dashboardDi
}
