import getCustomerInvoiceDi from "@/feature/core/customer-invoice/data/module/customer-invoice-di";
import { customerInvoiceModuleKey } from "@/feature/core/customer-invoice/invoice-module-key";
import { customerKey } from "@/feature/core/customer/customer-key";
import getCustomerDi from "@/feature/core/customer/data/module/customer-di";
import getInvoiceDi from "@/feature/core/invoice/data/module/invoice-di";
import { invoiceModuleKey } from "@/feature/core/invoice/invoice-module-key";
import { DependencyContainer } from "tsyringe";
import { summaryInfoModuleKey } from "@/feature/core/summary-info/domain/summary-info-module-key";
import getSummaryInfoDi from "@/feature/core/summary-info/data/module/summary-info-di";
import { revenueModuleKey } from "@/feature/core/revenue/domain/revenue-module-key";
import getRevenueDi from "@/feature/core/revenue/data/module/revenue-di";

const memoizedDis: Record<string, DependencyContainer> = {};

export default function serverDi(module: string): DependencyContainer {
  if (memoizedDis[module]) return memoizedDis[module];
  const getDi = {
    [customerKey]: getCustomerDi,
    [customerInvoiceModuleKey]: getCustomerInvoiceDi,
    [invoiceModuleKey]: getInvoiceDi,
    [summaryInfoModuleKey]: getSummaryInfoDi,
    [revenueModuleKey]: getRevenueDi,
  }[module];

  if (!getDi) throw new Error(`Server Di didn't found for module: ${module}`);

  const di = getDi();
  memoizedDis[module] = di;
  return di;
}
