import getCustomerInvoiceDi from "@/feature/core/customer-invoice/data/module/customer-invoice.di";
import { customerInvoiceModuleKey } from "@/feature/core/customer-invoice/invoice.module-key";
import { customerKey } from "@/feature/core/customer/customer-key";
import getCustomerDi from "@/feature/core/customer/data/module/customer-di";
import globalModule from "@/feature/common/data/global.module";
import getInvoiceDi from "@/feature/core/invoice/data/module/invoice.di";
import { invoiceModuleKey } from "@/feature/core/invoice/invoice.module-key";
import { DependencyContainer, InjectionToken } from "tsyringe";
import { summaryInfoModuleKey } from "@/feature/core/summary-info/domain/summary-info.module-key";
import getSummaryInfoDi from "@/feature/core/summary-info/data/module/summary-info.di";
import { revenueModuleKey } from "@/feature/core/revenue/domain/revenue.module-key";
import getRevenueDi from "@/feature/core/revenue/data/module/revenue.di";
import authModule from "@/feature/generic/auth/data/module/auth.module";
import { authModuleKey } from "@/feature/generic/auth/auth-module-key";
import di from "@/bootstrap/di/init-di";
import { userModuleKey } from "@/feature/core/user/data/user-module-key";
import userModule from "@/feature/core/user/data/module/user-module";

/**
 * On adding new domain module, just add it to this list
 */
const moduleKeyToDi: Record<
  string,
  (di: DependencyContainer) => DependencyContainer
> = {
  [authModuleKey]: authModule,
  [customerKey]: getCustomerDi,
  [customerInvoiceModuleKey]: getCustomerInvoiceDi,
  [invoiceModuleKey]: getInvoiceDi,
  [summaryInfoModuleKey]: getSummaryInfoDi,
  [revenueModuleKey]: getRevenueDi,
  [userModuleKey]: userModule,
};

const memoizedDis: Record<string, DependencyContainer> = {};

export default function featuresDi(module: string): DependencyContainer {
  if (memoizedDis[module]) return memoizedDis[module];
  const moduleDiHandler = moduleKeyToDi[module];
  if (!moduleDiHandler)
    throw new Error(`Server Di didn't found for module: ${module}`);

  const moduleDi = moduleDiHandler(di.createChildContainer());
  globalModule(moduleDi);
  memoizedDis[module] = moduleDi;
  return moduleDi;
}

export function diResolve<T = unknown>(module: string, key: InjectionToken): T {
  return featuresDi(module).resolve<T>(key);
}
