import di from "@/bootstrap/di/init-di"
import { testRepoKey } from "@/feature/domain/test/service/test-service-repo"
import TestRepoImpl from "@/feature/infra/test/repo/test-repo-iml"

export default function getTestModule() {
    const testDi = di.createChildContainer()

    di.register(testRepoKey, {
        useClass: TestRepoImpl
    })
    return testDi
}