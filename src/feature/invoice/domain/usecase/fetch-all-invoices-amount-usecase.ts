"use server"
import serverDi from "@/feature/common/server-di";
import InvoiceRepo, { invoiceRepoKey } from "@/feature/invoice/domain/i-repo/invoice-repo";
import { invoiceModuleKey } from "@/feature/invoice/invoice-module-key";

export default function fetchAllInvoicesAmountUsecase(): Promise<number> {
    const repo = serverDi(invoiceModuleKey).resolve<InvoiceRepo>(invoiceRepoKey)

    return repo.fetchAllInvoicesAmount()
}