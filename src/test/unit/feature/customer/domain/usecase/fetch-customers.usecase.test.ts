import CustomerRepo, {
  customerRepoKey,
} from "@/feature/core/customer/domain/i-repo/customer-repo";
import { getMockedDiResolve } from "@/test/common/mock/mock-di";
import { getMock } from "@/test/common/mock/mock-factory";
import { describe } from "vitest";
import { faker } from "@faker-js/faker";
import CustomerFakeFactory from "@/test/common/fake-factory/customer/customer.fake-factory";
import fetchCustomersUsecase from "@/feature/core/customer/domain/usecase/fetch-customers-usecase";
import { right } from "fp-ts/lib/Either";
import { right as taskRight } from "fp-ts/lib/TaskEither";
import { InjectionToken } from "tsyringe";
/* -------------------------------------------------------------------------- */
/*                                   Faking                                   */
/* -------------------------------------------------------------------------- */
const fakedCustomerList = CustomerFakeFactory.getFakeCustomerList();
/* -------------------------------------------------------------------------- */
/*                                   Mocking                                  */
/* -------------------------------------------------------------------------- */
const mockedFetchList = vi.fn<CustomerRepo["fetchList"]>();
const MockedRepo = getMock<CustomerRepo>();
MockedRepo.setup((instance) => instance.fetchList).returns(mockedFetchList);

const { mocked, originDiResolve } = getMockedDiResolve();

mocked.mockImplementation((namespace: string, key: InjectionToken) => {
  if (key === customerRepoKey) {
    return MockedRepo.object();
  }
  return originDiResolve(namespace, key);
});
/* -------------------------------------------------------------------------- */
/*                                   Testing                                  */
/* -------------------------------------------------------------------------- */
describe("Fetch customers", () => {
  describe("On given query string", () => {
    const fakedQuery = faker.person.fullName();
    describe("And returning list from repo", () => {
      beforeEach(() => {
        mockedFetchList.mockReturnValue(taskRight(fakedCustomerList));
      });
      it("Then should return correct list of customers", async () => {
        // ! Act
        const response = await fetchCustomersUsecase(fakedQuery);
        // ? Assert
        expect(response).toEqual(right(fakedCustomerList));
      });
    });
  });
});
