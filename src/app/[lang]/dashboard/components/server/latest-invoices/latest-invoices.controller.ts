import fetchCustomerInvoicesUsecase from "@/feature/core/customer-invoice/domain/usecase/fetch-customer-invoices.usecase";
import { connection } from "next/server";

/**
 * Controllers are bridge between feature layer and application layer.
 */
export default function latestInvoicesController() {
  connection();
  return fetchCustomerInvoicesUsecase();
}
