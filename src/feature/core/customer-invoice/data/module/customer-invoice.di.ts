import CustomerInvoiceDbRepo from "@/feature/core/customer-invoice/data/repo/customer-invoice-db.repo";
import { customerInvoiceRepoKey } from "@/feature/core/customer-invoice/domain/i-repo/customer-invoice.repo";
import { DependencyContainer } from "tsyringe";

export default function getCustomerInvoiceDi(
  di: DependencyContainer,
): DependencyContainer {
  di.register(customerInvoiceRepoKey, CustomerInvoiceDbRepo);
  return di;
}
