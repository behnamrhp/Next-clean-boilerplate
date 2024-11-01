export type CustomersTableType = {
  id: string;
  name: string;
  email: string;
  image_url: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export default class Customer {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
    totalInvoices: number;
    totalPending: number;
    totalPaid: number;

    constructor({
        id,
        email,
        imageUrl,
        name,
        totalInvoices,
        totalPaid,
        totalPending
    }: Customer) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.imageUrl = imageUrl;
        this.totalInvoices = totalInvoices;
        this.totalPaid = totalPaid;
        this.totalPending = totalPending;
    }
}