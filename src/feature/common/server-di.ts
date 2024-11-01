import getCustomerInvoiceDi from "@/feature/core/customer-invoice/data/module/customer-invoice-di";
import { customerInvoiceModuleKey } from "@/feature/core/customer-invoice/invoice-module-key";
import { customerKey } from "@/feature/core/customer/customer-key";
import getCustomerDi from "@/feature/core/customer/data/module/customer-di";
import { testModuleKey } from "@/feature/domain/test/test-module-key";
import getTestModule from "@/feature/infra/test/module/test-module";
import getInvoiceDi from "@/feature/core/invoice/data/module/invoice-di";
import { invoiceModuleKey } from "@/feature/core/invoice/invoice-module-key";
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