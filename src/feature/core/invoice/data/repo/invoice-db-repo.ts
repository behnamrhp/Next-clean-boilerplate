import { sql } from "@/bootstrap/db/db";
import { formatCurrency } from "@/feature/common/feature-helpers";
import InvoiceRepo from "@/feature/core/invoice/domain/i-repo/invoice-repo";
import { InvoiceParam } from "@/feature/core/invoice/domain/param/invoice-param";
import InvoiceStatusSummary from "@/feature/core/invoice/domain/value-object/invoice-status";
import postgres from "postgres";

type InvoiceSummaryDbResponse = {paid: string, pending: string}
export default class InvoiceDbRepo implements InvoiceRepo {
    async fetchAllInvoicesAmount(): Promise<number> {
        const data = await sql`SELECT COUNT(*) FROM invoices` as postgres.RowList<unknown[]>;
        
        return data.count ?? 0
    }

    async createInvoice(params: InvoiceParam): Promise<string> {
        const firstCustomerIdDb = await sql`SELECT 
            id FROM customers 
            ORDER BY id ASC
            LIMIT 1
        `
        const customerId = firstCustomerIdDb.at(0)?.id
        if (!customerId) throw new Error("There is no customer")
        
        const { amount, status } = params;
        const amountInCents = amount * 100;
        const date = new Date().toISOString().split('T')[0];

        // Insert data into the database
        const result = await sql`
            INSERT INTO invoices (customer_id, amount, status, date)
            VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
            RETURNING id
        `;
        return result.at(0)?.id ?? ""
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