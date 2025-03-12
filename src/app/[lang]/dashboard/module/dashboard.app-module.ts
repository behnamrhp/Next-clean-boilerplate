import createInvoiceController from "@/app/[lang]/dashboard/controller/create-invoice.controller";
import CreateRandomInvoiceButtonVM from "@/app/[lang]/dashboard/vm/create-random-invoice-button-vm";
import di from "@/bootstrap/di/init-di";

/**
 * Each page can have its own di to connect all vms, usecases or controllers
 */
export default function dashboardAppModule() {
  const dashboardDi = di.createChildContainer();

  dashboardDi.register(
    CreateRandomInvoiceButtonVM.name,
    CreateRandomInvoiceButtonVM,
  );

  dashboardDi.register(createInvoiceController.name, {
    useValue: createInvoiceController,
  });
  return dashboardDi;
}
