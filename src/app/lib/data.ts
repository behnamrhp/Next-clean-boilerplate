import { sql } from '@/bootstrap/db/db';
import {
  Revenue,
  Invoice,
  Customer,
  LatestInvoice,
} from './definitions';
import { formatCurrency } from './utils';
import postgres from 'postgres';
import { connection } from 'next/server';

export async function fetchRevenue() {
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  connection()

  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql`SELECT * FROM revenue`;

    console.log('Data fetch completed after 3 seconds.');

    return data as postgres.RowList<Revenue[]>;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  // This is equivalent to in fetch(..., {cache: 'no-store'}).
  connection()

  try {
    const data = await sql`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5` as postgres.RowList<LatestInvoice[]>;

    const latestInvoices = data.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(+invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
    // This is equivalent to in fetch(..., {cache: 'no-store'}).
  connection()

  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const invoices = data[0] as postgres.RowList<Invoice[]>
    const customres = data[1] as postgres.RowList<Customer[]>
    const invoiceStatus = data[2] as postgres.RowList<({paid: string, pending: string})[]>
    const numberOfInvoices = Number(invoices.count ?? '0');
    const numberOfCustomers = Number(customres.count ?? '0');
    const totalPaidInvoices = formatCurrency(Number(invoiceStatus.at(0)?.paid ?? '0'));
    const totalPendingInvoices = formatCurrency(Number(invoiceStatus.at(0)?.pending ?? '0'));

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}
