import CreateRandomInvoiceButtonVM from "@/app/dashboard/vm/create-random-invoice-button-vm";
import di from "@/bootstrap/di/init-di"

export default function dashboardAppModule() {
    const dashboardDi = di.createChildContainer()
    
    dashboardDi.register(CreateRandomInvoiceButtonVM, CreateRandomInvoiceButtonVM)
    return dashboardDi
}
