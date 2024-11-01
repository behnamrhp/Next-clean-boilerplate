import { formatCurrency } from "@/app/lib/utils";
import { sql } from "@/bootstrap/db/db";
import CustomerInvoice from "@/feature/customer-invoice/domain/entity/customer-invoice";
import CustomerInvoiceRepo from "@/feature/customer-invoice/domain/i-repo/customer-invoice-repo";
import { connection } from "next/server";
import postgres from "postgres";

type customerInvoiceDbResponse = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
}

export default class CustomerDbRepo implements CustomerInvoiceRepo {
    async fetchList(): Promise<CustomerInvoice[]> {
        // This is equivalent to in fetch(..., {cache: 'no-store'}).
        connection()

        try {
            const data = await sql`
            SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
            FROM invoices
            JOIN customers ON invoices.customer_id = customers.id
            ORDER BY invoices.date DESC
            LIMIT 5` as postgres.RowList<customerInvoiceDbResponse[]>;

            return this.customerInvoicesDto(data)
        } catch (error) {
            console.error('Database Error:', error);
            throw new Error('Failed to fetch the latest invoices.');
        }
    }


    private customerInvoicesDto(dbCustomers: customerInvoiceDbResponse[]): CustomerInvoice[] {
        return  dbCustomers.map((customer) => this.customerInvoiceDto(customer));
    }

    private customerInvoiceDto(dbCustomer: customerInvoiceDbResponse): CustomerInvoice {
        return new CustomerInvoice({
            id: dbCustomer.id,
            customerName: dbCustomer.name,
            customerEmail: dbCustomer.email,
            customerImageUrl: dbCustomer.image_url,
            invoicesAmount: formatCurrency(+dbCustomer.amount),
        })
    }

}