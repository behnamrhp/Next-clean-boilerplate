"use server"
import serverDi from "@/feature/common/server-di";
import InvoiceRepo, { invoiceRepoKey } from "@/feature/core/invoice/domain/i-repo/invoice-repo";
import { InvoiceParam, invoiceSchema } from "@/feature/core/invoice/domain/param/invoice-param";
import { invoiceModuleKey } from "@/feature/core/invoice/invoice-module-key";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export default async function createInvoiceUsecase(params: InvoiceParam): Promise<string | {errorMessage: string}> {
    const isParamsValid = invoiceSchema.safeParse(params)

    if (!isParamsValid) {
        return {
            errorMessage: "Please pass correct params"
        }
    }
    const repo = serverDi(invoiceModuleKey).resolve<InvoiceRepo>(invoiceRepoKey)

    revalidatePath("/dashboard")
    return repo.createInvoice(params)

}