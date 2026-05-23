import { HttpRequestConfig } from "@/bootstrap/boundaries/http-boundary/http-boundary.interface";
import serverConfigs from "@/bootstrap/configs/server-configs";
import EndpointProvider from "@/bootstrap/endpoint/endpoint-provider";
import { faker } from "@faker-js/faker";

const mockedFetch = vi.fn();
global.fetch = mockedFetch;

const backendEndpoint = EndpointProvider.backend;

describe("BackendEndpoint", () => {
  it("Should be defined", () => {
    expect(backendEndpoint).toBeTruthy();
  });

  describe("endpoints", () => {
    it("Should return correct users endpoint", () => {
      const expectedUsersEndpoint = `${serverConfigs.env.backendApi.url}/api/v1/users`;
      expect(backendEndpoint.users).toEqual(expectedUsersEndpoint);
    });
  });

  describe("HttpBoundary", () => {
    it("Should make request with correct configs if has body", async () => {
      const fakedConfigs: HttpRequestConfig = {
        method: "POST",
      };
      const fakedData = {
        field: faker.string.uuid(),
      };

      mockedFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(""),
      });

      await backendEndpoint.HttpBoundary.post(
        backendEndpoint.users,
        fakedData,
        fakedConfigs,
      )();

      expect(mockedFetch).toHaveBeenCalledWith(backendEndpoint.users, {
        ...fakedConfigs,
        method: "POST",
        body: JSON.stringify(fakedData),
        signal: expect.any(AbortSignal),
      });
    });

    it("Should make request with method GET if configs doesn't have body", async () => {
      mockedFetch.mockClear();
      mockedFetch.mockResolvedValue({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ data: [], total: 0 })),
      });

      const fakedConfigs: HttpRequestConfig = {
        method: "GET",
      };

      await backendEndpoint.HttpBoundary.get(
        backendEndpoint.users,
        fakedConfigs,
      )();

      expect(mockedFetch).toHaveBeenCalledWith(backendEndpoint.users, {
        ...fakedConfigs,
        method: "GET",
        signal: expect.any(AbortSignal),
      });
    });
  });
});
