import { diResolve } from "@/feature/common/features.di";
import { customerKey } from "@/feature/core/customer/customer-key";
import CustomerRepo, {
  customerRepoKey,
} from "@/feature/core/customer/domain/i-repo/customer-repo";

export default async function fetchCustomersAmountUsecase(): Promise<number> {
  const repo = diResolve<CustomerRepo>(customerKey, customerRepoKey);
  return repo.fetchCustomersAmount();
}
