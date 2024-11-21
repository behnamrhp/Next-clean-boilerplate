import Customer from "@/feature/core/customer/domain/entity/customer";
import { faker } from "@faker-js/faker";

export default class CustomerFakeFactory {
  static getFakeCustomer(): Customer {
    return new Customer({
      id: faker.string.uuid(),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      imageUrl: faker.image.url(),
      totalInvoices: faker.number.int().toLocaleString(),
      totalPaid: faker.finance.amount(),
      totalPending: faker.number.int().toLocaleString(),
    });
  }

  static getFakeCustomerList(length: number = 10): Customer[] {
    return Array.from({ length }).map(() =>
      CustomerFakeFactory.getFakeCustomer(),
    );
  }
}
