import "server-only";
import { sql } from "@/bootstrap/boundaries/db/db";
import ApiTask from "@/feature/common/data/api-task";
import { failureOr } from "@/feature/common/failures/failure-helpers";
import NetworkFailure from "@/feature/common/failures/network.failure";
import { formatCurrency } from "@/feature/common/feature-helpers";
import InvoiceRepo from "@/feature/core/invoice/domain/i-repo/invoice.i-repo";
import { InvoiceParam } from "@/feature/core/invoice/domain/param/invoice.param";
import InvoiceStatusSummary from "@/feature/core/invoice/domain/value-object/invoice-status.value-object";
import { pipe } from "fp-ts/lib/function";
import { tryCatch } from "fp-ts/lib/TaskEither";
import postgres from "postgres";

type InvoiceSummaryDbResponse = { paid: string; pending: string };
export default class InvoiceDbRepo implements InvoiceRepo {
  async fetchAllInvoicesAmount(): Promise<number> {
    const data = (await sql`SELECT COUNT(*) FROM invoices`) as postgres.RowList<
      unknown[]
    >;

    return data.count ?? 0;
  }

  createInvoice(params: InvoiceParam): ApiTask<string> {
    return pipe(
      tryCatch(
        async () => {
          const firstCustomerIdDb = await sql`SELECT 
                        id FROM customers 
                        ORDER BY id DESC 
                        LIMIT 1
                    `;
          const customerId = firstCustomerIdDb.at(0)?.id;
          if (!customerId) throw new Error("There is no customer");

          const { amount, status } = params;
          const amountInCents = amount * 100;
          const date = new Date().toISOString().split("T")[0];

          // Insert data into the database
          const result = await sql`
                        INSERT INTO invoices (customer_id, amount, status, date)
                        VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
                        RETURNING id
                    `;
          return result.at(0)?.id ?? "";
        },
        (l) => failureOr(l, new NetworkFailure(l as Error)),
      ),
    );
  }

  async fetchInvoicesStatusSummary(): Promise<InvoiceStatusSummary> {
    const invoiceStatusPromise = (await sql`SELECT
            SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
            SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
            FROM invoices`) as postgres.RowList<InvoiceSummaryDbResponse[]>;

    return this.invoiceSummaryDto(invoiceStatusPromise.at(0));
  }

  private invoiceSummaryDto(
    dbResponse?: InvoiceSummaryDbResponse,
  ): InvoiceStatusSummary {
    return new InvoiceStatusSummary({
      paid: formatCurrency(Number(dbResponse?.paid ?? "0")),
      pending: formatCurrency(Number(dbResponse?.pending ?? "0")),
    });
  }
}
