import { ApiEither } from "@/feature/common/data/api-task";
import ParamsFailure from "@/feature/common/failures/params.failure";
import InvoiceRepo, {
  invoiceRepoKey,
} from "@/feature/core/invoice/domain/i-repo/invoice.i-repo";
import {
  InvoiceParam,
  invoiceSchema,
} from "@/feature/core/invoice/domain/param/invoice.param";
import { invoiceModuleKey } from "@/feature/core/invoice/invoice.module-key";
import { CreateInvoiceUsecase } from "@/feature/core/invoice/domain/usecase/create-invoice/create-invoice.usecase";
import { pipe } from "fp-ts/lib/function";
import { chain, fromNullable, left, map, right } from "fp-ts/lib/TaskEither";
import { diResolve } from "@/feature/common/features.di";

const createInvoiceUsecase: CreateInvoiceUsecase = async (
  params: InvoiceParam,
): Promise<ApiEither<string>> => {
  const repo = diResolve<InvoiceRepo>(invoiceModuleKey, invoiceRepoKey);

  return pipe(
    fromNullable(new ParamsFailure())(params),
    map((params) => invoiceSchema.safeParse(params)),
    chain((params) => {
      const isParamsValid = invoiceSchema.safeParse(params);
      if (!isParamsValid.success) left(new ParamsFailure());
      return right(params.data as InvoiceParam);
    }),
    chain((params) => repo.createInvoice(params)),
  )();
};

export default createInvoiceUsecase;
