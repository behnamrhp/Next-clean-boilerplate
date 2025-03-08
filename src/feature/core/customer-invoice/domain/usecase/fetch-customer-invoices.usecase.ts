import "server-only";
import { ApiEither } from "@/feature/common/data/api-task";
import serverDi from "@/feature/common/server.di";
import CustomerInvoice from "@/feature/core/customer-invoice/domain/entity/customer-invoice.entity";
import CustomerInvoiceRepo, {
  customerInvoiceRepoKey,
} from "@/feature/core/customer-invoice/domain/i-repo/customer-invoice.repo";
import { customerInvoiceModuleKey } from "@/feature/core/customer-invoice/invoice.module-key";

export default function fetchCustomerInvoicesUsecase(): Promise<
  ApiEither<CustomerInvoice[]>
> {
  const repo = serverDi(customerInvoiceModuleKey).resolve<CustomerInvoiceRepo>(
    customerInvoiceRepoKey,
  );
  return repo.fetchList()();
}
