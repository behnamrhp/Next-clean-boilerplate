import { TestButtonVM, testKey } from "@/app/test/client/vm/test-button-vm";
import di from "@/bootstrap/di/init-di"
import getButtonTitle from "@/feature/domain/test/service/test-get-button-title-service";

export default function testAppModule() {
    const testDi = di.createChildContainer()
    
    testDi.registerInstance(testKey, TestButtonVM);
    testDi.register(getButtonTitle.name, {
        useValue: getButtonTitle
    })
    return testDi
}
