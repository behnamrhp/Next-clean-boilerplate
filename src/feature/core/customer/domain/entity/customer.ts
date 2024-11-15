export default class Customer {
  id: string;

  name: string;

  email: string;

  imageUrl: string;

  totalInvoices: string;

  totalPending: string;

  totalPaid: string;

  constructor({
    id,
    email,
    imageUrl,
    name,
    totalInvoices,
    totalPaid,
    totalPending,
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
