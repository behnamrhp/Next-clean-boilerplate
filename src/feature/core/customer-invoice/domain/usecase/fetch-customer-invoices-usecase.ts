"use server"
import serverDi from "@/feature/common/server-di";
import CustomerInvoice from "@/feature/core/customer-invoice/domain/entity/customer-invoice";
import CustomerInvoiceRepo, { customerInvoiceRepoKey } from "@/feature/core/customer-invoice/domain/i-repo/customer-invoice-repo";
import { customerInvoiceModuleKey } from "@/feature/core/customer-invoice/invoice-module-key";
import { connection } from "next/server";

export default async function fetchCustomerInvoicesUsecase(): Promise<CustomerInvoice[]> {
    connection()
    const repo = serverDi(customerInvoiceModuleKey).resolve<CustomerInvoiceRepo>(customerInvoiceRepoKey)
    return repo.fetchList()
}