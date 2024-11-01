import di from "@/bootstrap/di/init-di"
import fetchCustomersAmountUsecase from "@/feature/core/customer/domain/usecase/fetch-customers-amount-usecase"
import fetchAllInvoicesAmountUsecase from "@/feature/core/invoice/domain/usecase/fetch-all-invoices-amount-usecase"
import fetchInvoicesStatusSummary from "@/feature/core/invoice/domain/usecase/fetch-invoices-status-summary"
import fetchSummaryInfoUsecase from "@/feature/core/summary-info/domain/usecase/fetch-summary-info-usecase"

export default function getSummaryInfoDi() {
    const summaryInfoDi = di.createChildContainer()

    summaryInfoDi.register(fetchAllInvoicesAmountUsecase.name, {
        useValue: fetchAllInvoicesAmountUsecase
    })
    summaryInfoDi.register(fetchCustomersAmountUsecase.name, {
        useValue: fetchCustomersAmountUsecase
    })
    summaryInfoDi.register(fetchInvoicesStatusSummary.name, {
        useValue: fetchSummaryInfoUsecase
    })
    return summaryInfoDi
}