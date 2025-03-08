import { ApiEither } from "@/feature/common/data/api-task";
import { InvoiceParam } from "@/feature/core/invoice/domain/param/invoice.param";

export type CreateInvoiceUsecase = (
  param: InvoiceParam,
) => Promise<ApiEither<string>>;

export const createInvoiceUsecaseKey = "createInvoiceUsecaseKey";
