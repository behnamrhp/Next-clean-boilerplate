import di from "@/bootstrap/di/init-di";
import fetchCustomersUsecase from "@/feature/customer/domain/usecase/fetch-customers-usecase";
import { DependencyContainer } from "tsyringe";

export default function getCustomerDi(): DependencyContainer {
    const customerDi = di.createChildContainer()

    customerDi.register(fetchCustomersUsecase.name, {
        useValue: fetchCustomersUsecase
    })

    return customerDi
}