import di from "@/bootstrap/di/init-di";
import invoiceDbRepo from "@/feature/core/invoice/data/repo/invoice-db.repo";
import { invoiceRepoKey } from "@/feature/core/invoice/domain/i-repo/invoice.i-repo";
import { DependencyContainer } from "tsyringe";

export default function getInvoiceDi(): DependencyContainer {
  const invoiceDi = di.createChildContainer();

  invoiceDi.register(invoiceRepoKey, invoiceDbRepo);
  return invoiceDi;
}
