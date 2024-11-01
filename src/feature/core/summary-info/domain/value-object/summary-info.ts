import InvoiceStatusSummary from "@/feature/core/invoice/domain/value-object/invoice-status";

export default class SummaryInfo {
    customersNumber: number;
    invoicesNumber: number;
    invoicesSummary: InvoiceStatusSummary 

    constructor({
        customersNumber,
        invoicesNumber,
        invoicesSummary
    }: SummaryInfo) {
        this.customersNumber = customersNumber
        this.invoicesNumber = invoicesNumber
        this.invoicesSummary = invoicesSummary
    }
}