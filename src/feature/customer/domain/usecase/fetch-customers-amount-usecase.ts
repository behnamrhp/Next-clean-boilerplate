import serverDi from "@/feature/common/server-di";
import { customerKey } from "@/feature/customer/customer-key";
import CustomerRepo, { customerRepoKey } from "@/feature/customer/domain/i-repo/customer-repo";

export default function fetchCustomersAmountUsecase(): Promise<number> {
    const repo = serverDi(customerKey).resolve<CustomerRepo>(customerRepoKey)
    return repo.fetchCustomersAmount()
}