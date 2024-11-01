import serverDi from "@/feature/common/server-di";
import { customerKey } from "@/feature/core/customer/customer-key";
import CustomerRepo, { customerRepoKey } from "@/feature/core/customer/domain/i-repo/customer-repo";

export default async function fetchCustomersAmountUsecase(): Promise<number> {
    const repo = serverDi(customerKey).resolve<CustomerRepo>(customerRepoKey)
    return repo.fetchCustomersAmount()
}