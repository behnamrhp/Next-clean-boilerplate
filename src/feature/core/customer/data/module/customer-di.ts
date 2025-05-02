import CustomerDbRepo from "@/feature/core/customer/data/repo/customer-db-repo";
import { customerRepoKey } from "@/feature/core/customer/domain/i-repo/customer-repo";
import { DependencyContainer } from "tsyringe";

export default function getCustomerDi(
  di: DependencyContainer,
): DependencyContainer {
  di.register(customerRepoKey, CustomerDbRepo);
  return di;
}
