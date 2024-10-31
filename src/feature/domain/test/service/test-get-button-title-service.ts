"use server"
import serverDi from "@/feature/common/server-di";
import TestRepo, { testRepoKey } from "@/feature/domain/test/service/test-service-repo"
import { testModuleKey } from "@/feature/domain/test/test-module-key";

export default async function getButtonTitle() {
    const repo = serverDi(testModuleKey).resolve<TestRepo>(testRepoKey) 
    return repo.getButtonTitle()
}
