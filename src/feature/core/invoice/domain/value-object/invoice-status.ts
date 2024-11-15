export default class InvoiceStatusSummary {
  paid: string;

  pending: string;

  constructor({ paid, pending }: InvoiceStatusSummary) {
    this.paid = paid;
    this.pending = pending;
  }
}
