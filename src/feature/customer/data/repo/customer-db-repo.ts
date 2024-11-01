import { formatCurrency } from "@/app/lib/utils";
import { sql } from "@/bootstrap/db/db";
import Customer from "@/feature/customer/domain/entity/customer";
import CustomerRepo from "@/feature/customer/domain/i-repo/customer-repo";
import { connection } from "next/server";
import postgres from "postgres";

type customerDbResponse = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: string;
  total_pending: string;
  total_paid: string;
}

export default class CustomerDbRepo implements CustomerRepo {
    async fetchList(query: string): Promise<Customer[]> {
        // This is equivalent to in fetch(..., {cache: 'no-store'}).
        connection()
        try {
            const data = await sql`
                SELECT
                customers.id,
                customers.name,
                customers.email,
                customers.image_url,
                COUNT(invoices.id) AS total_invoices,
                SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
                SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
                FROM customers
                LEFT JOIN invoices ON customers.id = invoices.customer_id
                WHERE
                customers.name ILIKE ${`%${query}%`} OR
                customers.email ILIKE ${`%${query}%`}
                GROUP BY customers.id, customers.name, customers.email, customers.image_url
                ORDER BY customers.name ASC
            ` as postgres.RowList<customerDbResponse[]>;


            return this.customersDto(data);
        } catch (err) {
            console.error('Database Error:', err);
            throw new Error('Failed to fetch customer table.');
        }
    }


    private customersDto(dbCustomers: customerDbResponse[]): Customer[] {
        return  dbCustomers.map((customer) => this.customerDto(customer));
    }

    private customerDto(dbCustomer: customerDbResponse): Customer {
        return new Customer({
            id: dbCustomer.id,
            name: dbCustomer.name,
            email: dbCustomer.email,
            imageUrl: dbCustomer.image_url,
            totalInvoices: dbCustomer.total_invoices,
            totalPending: formatCurrency(Number(dbCustomer.total_pending)),
            totalPaid: formatCurrency(Number(dbCustomer.total_paid)),
        })
    }

}