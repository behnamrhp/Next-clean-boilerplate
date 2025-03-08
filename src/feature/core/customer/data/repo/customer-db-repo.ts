import { sql } from "@/bootstrap/boundaries/db/db";
import ApiTask from "@/feature/common/data/api-task";
import { failureOr } from "@/feature/common/failures/failure-helpers";
import NetworkFailure from "@/feature/common/failures/network.failure";
import { formatCurrency } from "@/feature/common/feature-helpers";
import Customer from "@/feature/core/customer/domain/entity/customer";
import CustomerRepo from "@/feature/core/customer/domain/i-repo/customer-repo";
import { pipe } from "fp-ts/lib/function";
import { map, tryCatch } from "fp-ts/lib/TaskEither";
import postgres from "postgres";

type customerDbResponse = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: string;
  total_pending: string;
  total_paid: string;
};

export default class CustomerDbRepo implements CustomerRepo {
  fetchList(query: string): ApiTask<Customer[]> {
    return pipe(
      tryCatch(
        async () => {
          const data = (await sql`
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
                `) as postgres.RowList<customerDbResponse[]>;

          return data;
        },
        (l) => failureOr(l, new NetworkFailure(l as Error)),
      ),
      map(this.customersDto.bind(this)),
    ) as ApiTask<Customer[]>;
  }

  async fetchCustomersAmount(): Promise<number> {
    const data =
      (await sql`SELECT COUNT(*) FROM customers`) as postgres.RowList<
        unknown[]
      >;
    return Number(data.count ?? "0");
  }

  private customersDto(dbCustomers: customerDbResponse[]): Customer[] {
    return dbCustomers.map((customer) => this.customerDto(customer));
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
    });
  }
}
