import fetchCustomerInvoicesUsecase from "@/feature/core/customer-invoice/domain/usecase/fetch-customer-invoices-usecase";
import { connection } from "next/server";

export default function latestInvoicesController() {
  connection();
  return fetchCustomerInvoicesUsecase();
}
