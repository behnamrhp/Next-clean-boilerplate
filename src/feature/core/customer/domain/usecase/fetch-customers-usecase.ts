import { ApiEither } from "@/feature/common/data/api-task";
import { diResolve } from "@/feature/common/features.di";
import { customerKey } from "@/feature/core/customer/customer-key";
import Customer from "@/feature/core/customer/domain/entity/customer";
import CustomerRepo, {
  customerRepoKey,
} from "@/feature/core/customer/domain/i-repo/customer-repo";

export default function fetchCustomersUsecase(
  query: string,
): Promise<ApiEither<Customer[]>> {
  const repo = diResolve<CustomerRepo>(customerKey, customerRepoKey);

  return repo.fetchList(query)();
}
