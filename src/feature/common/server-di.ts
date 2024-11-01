import getCustomerInvoiceDi from "@/feature/customer-invoice/data/module/customer-invoice-di";
import { customerInvoiceModuleKey } from "@/feature/customer-invoice/invoice-module-key";
import { customerKey } from "@/feature/customer/customer-key";
import getCustomerDi from "@/feature/customer/data/module/customer-di";
import { testModuleKey } from "@/feature/domain/test/test-module-key";
import getTestModule from "@/feature/infra/test/module/test-module";
import getInvoiceDi from "@/feature/invoice/data/module/invoice-di";
import { invoiceModuleKey } from "@/feature/invoice/invoice-module-key";
import { DependencyContainer } from "tsyringe";

export default function serverDi(module: string): DependencyContainer {
    const getDi = {
        [testModuleKey]: getTestModule,
        [customerKey]: getCustomerDi,
        [customerInvoiceModuleKey]: getCustomerInvoiceDi,
        [invoiceModuleKey]: getInvoiceDi,
    }[module]

    if (!getDi) throw new Error("Server Di didn't found for module: " + module)

    return getDi()
}