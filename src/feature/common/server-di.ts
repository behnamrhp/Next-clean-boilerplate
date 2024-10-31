import { testModuleKey } from "@/feature/domain/test/test-module-key";
import getTestModule from "@/feature/infra/test/module/test-module";
import { DependencyContainer } from "tsyringe";

export default function serverDi(module: string): DependencyContainer {
    const getDi = {
        [testModuleKey]: getTestModule
    }[module]

    if (!getDi) throw new Error("Server Di didn't found for module: " + module)

    return getDi()
}