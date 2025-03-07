import CreateRandomInvoiceButtonVM from "@/app/[lang]/dashboard/vm/create-random-invoice-button-vm";
import di from "@/bootstrap/di/init-di";
import createInvoiceUsecase from "@/feature/core/invoice/domain/usecase/create-invoice/create-invoice-impl.usecase";
import { createInvoiceUsecaseKey } from "@/feature/core/invoice/domain/usecase/create-invoice/create-invoice.usecase";

export default function dashboardAppModule() {
  const dashboardDi = di.createChildContainer();

  dashboardDi.register(createInvoiceUsecaseKey, {
    useValue: createInvoiceUsecase,
  });
  dashboardDi.register(
    CreateRandomInvoiceButtonVM,
    CreateRandomInvoiceButtonVM,
  );
  return dashboardDi;
}
