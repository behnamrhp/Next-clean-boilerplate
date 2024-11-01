import Customer from "@/feature/customer/domain/entity/customer"

export default interface CustomerRepo {
    fetchList(query: string): Promise<Customer[]>
}

export const customerRepoKey = "customerRepoKey"