export default interface TestRepo {
    getButtonTitle(): Promise<string>
}

export const testRepoKey = "restRepoKey"