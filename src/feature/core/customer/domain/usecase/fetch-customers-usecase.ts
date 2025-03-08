import "server-only";
import { ApiEither } from "@/feature/common/data/api-task";
import serverDi from "@/feature/common/server.di";
import { customerKey } from "@/feature/core/customer/customer-key";
import Customer from "@/feature/core/customer/domain/entity/customer";
import CustomerRepo, {
  customerRepoKey,
} from "@/feature/core/customer/domain/i-repo/customer-repo";

export default function fetchCustomersUsecase(
  query: string,
): Promise<ApiEither<Customer[]>> {
  const repo = serverDi(customerKey).resolve<CustomerRepo>(customerRepoKey);

  return repo.fetchList(query)();
}
