import CustomerRepo, {
  customerRepoKey,
} from "@/feature/core/customer/domain/i-repo/customer-repo";
import { getMock } from "@/test/common/mock/mock-factory";
import { describe } from "vitest";
import { faker } from "@faker-js/faker";
import CustomerFakeFactory from "@/test/common/fake-factory/customer/customer.fake-factory";
import fetchCustomersUsecase from "@/feature/core/customer/domain/usecase/fetch-customers-usecase";
import mockDi from "@/test/common/mock/mock-di";
import { right } from "fp-ts/lib/TaskEither";
/* -------------------------------------------------------------------------- */
/*                                   Faking                                   */
/* -------------------------------------------------------------------------- */
const fakedCustomerList = CustomerFakeFactory.getFakeCustomerList();
/* -------------------------------------------------------------------------- */
/*                                   Mocking                                  */
/* -------------------------------------------------------------------------- */
const customerDi = mockDi();

const mockedFetchList = vi.fn<CustomerRepo["fetchList"]>();
const MockedRepo = getMock<CustomerRepo>();
MockedRepo.setup((instance) => instance.fetchList).returns(mockedFetchList);
/* -------------------------------------------------------------------------- */
/*                                     DI                                     */
/* -------------------------------------------------------------------------- */
customerDi.register(fetchCustomersUsecase.name, {
  useValue: fetchCustomersUsecase,
});
customerDi.register(customerRepoKey, {
  useValue: MockedRepo.object(),
});
/* -------------------------------------------------------------------------- */
/*                                   Testing                                  */
/* -------------------------------------------------------------------------- */
const usecase = customerDi.resolve<typeof fetchCustomersUsecase>(
  fetchCustomersUsecase.name,
);
describe("Fetch customers", () => {
  describe("On given query string", () => {
    const fakedQuery = faker.person.fullName();
    describe("And returning list from repo", () => {
      beforeEach(() => {
        mockedFetchList.mockResolvedValue(right(fakedCustomerList));
      });
      it("Then should return correct list of customers", async () => {
        // ! Act
        const response = await usecase(fakedQuery);
        // ? Assert
        expect(response).toEqual(fakedCustomerList);
      });
    });
  });
});
