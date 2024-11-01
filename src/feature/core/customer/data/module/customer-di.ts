import di from "@/bootstrap/di/init-di";
import CustomerDbRepo from "@/feature/core/customer/data/repo/customer-db-repo";
import { customerRepoKey } from "@/feature/core/customer/domain/i-repo/customer-repo";
import fetchCustomersUsecase from "@/feature/core/customer/domain/usecase/fetch-customers-usecase";
import { DependencyContainer } from "tsyringe";

export default function getCustomerDi(): DependencyContainer {
    const customerDi = di.createChildContainer()

    customerDi.register(fetchCustomersUsecase.name, {
        useValue: fetchCustomersUsecase
    })

    customerDi.register(customerRepoKey, CustomerDbRepo)
    return customerDi
}