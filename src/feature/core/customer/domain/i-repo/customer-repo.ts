import Customer from "@/feature/core/customer/domain/entity/customer"

export default interface CustomerRepo {
    fetchList(query: string): Promise<Customer[]>
    fetchCustomersAmount(): Promise<number>
}

export const customerRepoKey = "customerRepoKey"