import di from "@/bootstrap/di/init-di"
import fetchCustomerInvoicesUsecase from "@/feature/core/customer-invoice/domain/usecase/fetch-customer-invoices-usecase";
import fetchCustomersUsecase from "@/feature/core/customer/domain/usecase/fetch-customers-usecase";
import fetchAllInvoicesAmountUsecase from "@/feature/core/invoice/domain/usecase/fetch-all-invoices-amount-usecase";
import fetchRevenuesUsecase from "@/feature/core/revenue/domain/usecase/fetch-revenues-usecase";

export default function dashboardAppModule() {
    const dashboardDi = di.createChildContainer()
    
    dashboardDi.register(fetchCustomersUsecase.name, {
        useValue: fetchCustomersUsecase
    })

    dashboardDi.register(fetchAllInvoicesAmountUsecase.name, {
        useValue: fetchAllInvoicesAmountUsecase
    })
    dashboardDi.register(fetchAllInvoicesAmountUsecase.name, {
        useValue: fetchAllInvoicesAmountUsecase
    })
    dashboardDi.register(fetchCustomerInvoicesUsecase.name, {
        useValue: fetchCustomerInvoicesUsecase
    })
    dashboardDi.register(fetchRevenuesUsecase.name, {
        useValue: fetchRevenuesUsecase
    })
    return dashboardDi
}
