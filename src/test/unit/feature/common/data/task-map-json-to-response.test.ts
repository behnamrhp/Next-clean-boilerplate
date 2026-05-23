/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpRequestInterceptor,
  HttpResponseInterceptor,
} from "@/bootstrap/boundaries/http-boundary/http-boundary.interface";
import Endpoint from "@/bootstrap/endpoint/endpoint";
import IBaseHttpResponse from "@/feature/common/data/http/i-base-http-response";
import taskMapJsonToResponse from "@/feature/common/data/task-map-json-to-response";
import ClientResponseFailure from "@/feature/common/failures/client-response.failure";
import ServerResponseFailure from "@/feature/common/failures/server-response.failure";
import { faker } from "@faker-js/faker";
import { left, right } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { of } from "fp-ts/lib/TaskEither";

type ResponseStructure<DATA = any> = {
  status: number;
  message: string;
  data: DATA;
};

const fakeBaseURL = faker.internet.url();
class MockedEndpoint extends Endpoint<ResponseStructure> {
  protected baseURL: string = fakeBaseURL;

  protected apiVersion: string = "";

  protected toHttpDataResponse<DATA>(
    response: ResponseStructure<DATA>,
  ): IBaseHttpResponse<DATA> {
    if (!response.data) {
      throw response;
    }
    return {
      data: response.data,
      success: true,
      message: response.message,
      status: response.status.toString(),
    };
  }

  protected interceptors?:
    | { request?: HttpRequestInterceptor; response?: HttpResponseInterceptor }
    | undefined = undefined;
}

describe("taskMapJsonToResponse", () => {
  it.each([
    {
      status: 400,
      ExpectedFailure: ClientResponseFailure,
    },
    {
      status: 300,
      ExpectedFailure: ServerResponseFailure,
    },
    {
      status: 500,
      ExpectedFailure: ServerResponseFailure,
    },
  ])(
    "On getting error $status status category response should return correct failure",
    async ({ status, ExpectedFailure }) => {
      const fakeResponse: ResponseStructure<string> = {
        status,
        message: "mocked-message",
        data: "mocked-data",
      };
      const result = await pipe(
        of({
          json: () => Promise.resolve(fakeResponse),
          ok: false,
          status,
        } as Response),
        taskMapJsonToResponse(new MockedEndpoint()),
      )();

      expect(result).toEqual(left(new ExpectedFailure(expect.anything())));
    },
  );

  it("On getting success response should return data mapped to the endpoint response structure", async () => {
    const fakeResponse: ResponseStructure<string> = {
      status: 200,
      message: "mocked-message",
      data: "mocked-data",
    };
    const result = await pipe(
      of({
        text: () => Promise.resolve(JSON.stringify(fakeResponse)),
        ok: true,
        status: 200,
      } as Response),
      taskMapJsonToResponse(new MockedEndpoint()),
    )();

    expect(result).toEqual(
      right({
        data: fakeResponse.data,
        success: true,
        message: fakeResponse.message,
        status: fakeResponse.status.toString(),
      }),
    );
  });
});
