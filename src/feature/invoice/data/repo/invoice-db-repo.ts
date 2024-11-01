import { sql } from "@/bootstrap/db/db";
import InvoiceRepo from "@/feature/invoice/domain/i-repo/invoice-repo";
import postgres from "postgres";

export default class InvoiceDbRepo implements InvoiceRepo {
    async fetchAllInvoicesAmount(): Promise<number> {
        const data = await sql`SELECT COUNT(*) FROM invoices` as postgres.RowList<unknown[]>;

        return data.count ?? 0
    }
}