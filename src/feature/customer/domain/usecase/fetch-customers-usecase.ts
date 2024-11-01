"use server"

import serverDi from "@/feature/common/server-di";
import { customerKey } from "@/feature/customer/customer-key";
import Customer from "@/feature/customer/domain/entity/customer";
import CustomerRepo, { customerRepoKey } from "@/feature/customer/domain/i-repo/customer-repo";

export default function fetchCustomersUsecase(query: string): Promise<Customer[]> {
    const repo = serverDi(customerKey).resolve<CustomerRepo>(customerRepoKey)

    return repo.fetchList(query)
}