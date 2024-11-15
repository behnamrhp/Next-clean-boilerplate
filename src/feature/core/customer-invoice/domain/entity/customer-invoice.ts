export default class CustomerInvoice {
  id: string;

  customerName: string;

  customerImageUrl: string;

  customerEmail: string;

  invoicesAmount: string;

  constructor({
    id,
    customerEmail,
    customerImageUrl,
    customerName,
    invoicesAmount,
  }: CustomerInvoice) {
    this.id = id;
    this.customerEmail = customerEmail;
    this.customerImageUrl = customerImageUrl;
    this.customerName = customerName;
    this.invoicesAmount = invoicesAmount;
  }
}
