import ApiTask from "@/feature/common/data/api-task";
import Customer from "@/feature/core/customer/domain/entity/customer";

export default interface CustomerRepo {
  fetchList(query: string): ApiTask<Customer[]>;
  fetchCustomersAmount(): Promise<number>;
}

export const customerRepoKey = "customerRepoKey";
