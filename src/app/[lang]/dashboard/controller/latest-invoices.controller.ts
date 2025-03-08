import fetchCustomerInvoicesUsecase from "@/feature/core/customer-invoice/domain/usecase/fetch-customer-invoices.usecase";
import { connection } from "next/server";

/**
 * Controllers are bridge between feature layer and application layer.
 * They decide, feature layer will be cached or not, where to run in client or server
 * Or connect multiple usecases and run them, handle their failure, hydrate and store data in
 *  client state managements.
 */
export default function latestInvoicesController() {
  connection();
  return fetchCustomerInvoicesUsecase();
}
