export default class Revenue {
  month: string;

  revenue: number;

  constructor({ month, revenue }: Revenue) {
    this.month = month;
    this.revenue = revenue;
  }
}
