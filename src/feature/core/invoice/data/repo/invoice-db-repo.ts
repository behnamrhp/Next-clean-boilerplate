import { formatCurrency } from "@/app/lib/utils";
import { sql } from "@/bootstrap/db/db";
import InvoiceRepo from "@/feature/core/invoice/domain/i-repo/invoice-repo";
import InvoiceStatusSummary from "@/feature/core/invoice/domain/value-object/invoice-status";
import postgres from "postgres";

type InvoiceSummaryDbResponse = {paid: string, pending: string}
export default class InvoiceDbRepo implements InvoiceRepo {
    async fetchAllInvoicesAmount(): Promise<number> {
        const data = await sql`SELECT COUNT(*) FROM invoices` as postgres.RowList<unknown[]>;
        
        return data.count ?? 0
    }

    async fetchInvoicesStatusSummary(): Promise<InvoiceStatusSummary> {
        const invoiceStatusPromise = await sql`SELECT
            SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
            SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
            FROM invoices` as postgres.RowList<InvoiceSummaryDbResponse[]>;
        
        return this.invoiceSummaryDto(invoiceStatusPromise.at(0))
        
    }

    private invoiceSummaryDto(dbResponse?: InvoiceSummaryDbResponse): InvoiceStatusSummary {
        return new InvoiceStatusSummary({
            paid: formatCurrency(Number(dbResponse?.paid ?? '0')),
            pending: formatCurrency(Number(dbResponse?.pending ?? '0'))
        })
    }
}