import CreateRandomInvoiceButtonVM from "@/app/[lang]/dashboard/vm/create-random-invoice-button-vm";
import di from "@/bootstrap/di/init-di";
import createInvoiceUsecase from "@/feature/core/invoice/domain/usecase/create-invoice.usecase";

/**
 * Each page can have its own di to connect all vms, usecases or controllers
 */
export default function dashboardAppModule() {
  const dashboardDi = di.createChildContainer();

  dashboardDi.register(createInvoiceUsecase.name, {
    useValue: createInvoiceUsecase,
  });
  dashboardDi.register(
    CreateRandomInvoiceButtonVM,
    CreateRandomInvoiceButtonVM,
  );
  return dashboardDi;
}
