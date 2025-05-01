export default class WithPagination<T> {
  items: T[];

  total: number;

  constructor(items: T[], total: number) {
    this.items = items;
    this.total = total;
  }

  toPlainObject(): WithPagination<T> {
    return {
      items: this.items,
      total: this.total,
    } as WithPagination<T>;
  }
}
