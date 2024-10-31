import TestRepo from "@/feature/domain/test/service/test-service-repo";

export default class TestRepoImpl implements TestRepo {
    async getButtonTitle(): Promise<string> {
        await new Promise((res) => {
            setTimeout(() => {
                res(true)
            }, 3000)
        })
        console.log('hereee');
        return Promise.resolve("Button title")
    }

}