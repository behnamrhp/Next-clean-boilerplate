import di from "@/bootstrap/di/init-di";
import invoiceDbRepo from "@/feature/core/invoice/data/repo/invoice-db.repo";
import { invoiceRepoKey } from "@/feature/core/invoice/domain/i-repo/invoice.i-repo";
import createInvoiceUsecase from "@/feature/core/invoice/domain/usecase/create-invoice/create-invoice-impl.usecase";
import { createInvoiceUsecaseKey } from "@/feature/core/invoice/domain/usecase/create-invoice/create-invoice.usecase";
import { DependencyContainer } from "tsyringe";

export default function getInvoiceDi(): DependencyContainer {
  const invoiceDi = di.createChildContainer();

  invoiceDi.register(invoiceRepoKey, invoiceDbRepo);
  invoiceDi.register(createInvoiceUsecaseKey, {
    useValue: createInvoiceUsecase,
  });
  return invoiceDi;
}
