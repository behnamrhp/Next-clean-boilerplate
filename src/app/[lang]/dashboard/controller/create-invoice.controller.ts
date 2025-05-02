"use server";

import { ApiEither } from "@/feature/common/data/api-task";
import { diResolve } from "@/feature/common/features.di";
import { InvoiceParam } from "@/feature/core/invoice/domain/param/invoice.param";
import {
  CreateInvoiceUsecase,
  createInvoiceUsecaseKey,
} from "@/feature/core/invoice/domain/usecase/create-invoice/create-invoice.usecase";
import { invoiceModuleKey } from "@/feature/core/invoice/invoice.module-key";
import { connection } from "next/server";

/**
 * Controllers are bridge between feature layer and application layer.
 * They decide, feature layer will be cached or not, where to run in client or server
 * Or connect multiple usecases and run them, handle their failure, hydrate and store data in
 *  client state managements.
 */
export default async function createInvoiceController(
  params: InvoiceParam,
): Promise<ApiEither<string>> {
  await connection();
  const usecase = diResolve<CreateInvoiceUsecase>(
    invoiceModuleKey,
    createInvoiceUsecaseKey,
  );
  return usecase(params);
}
