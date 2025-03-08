import ApiTask from "@/feature/common/data/api-task";
import CustomerInvoice from "@/feature/core/customer-invoice/domain/entity/customer-invoice.entity";

export default interface CustomerInvoiceRepo {
  fetchList(): ApiTask<CustomerInvoice[]>;
}

export const customerInvoiceRepoKey = "customerInvoiceRepoKey";
