"use server";

import { ApiEither } from "@/feature/common/data/api-task";
import { InvoiceParam } from "@/feature/core/invoice/domain/param/invoice.param";
import createInvoiceUsecase from "@/feature/core/invoice/domain/usecase/create-invoice.usecase";
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
  connection();
  return createInvoiceUsecase(params);
}
