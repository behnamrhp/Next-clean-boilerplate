"use server"

import serverDi from "@/feature/common/server-di";
import { customerKey } from "@/feature/core/customer/customer-key";
import Customer from "@/feature/core/customer/domain/entity/customer";
import CustomerRepo, { customerRepoKey } from "@/feature/core/customer/domain/i-repo/customer-repo";

export default async function fetchCustomersUsecase(query: string): Promise<Customer[]> {
    const repo = serverDi(customerKey).resolve<CustomerRepo>(customerRepoKey)

    return repo.fetchList(query)
}