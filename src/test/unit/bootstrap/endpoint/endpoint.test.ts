/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpRequestInterceptor,
  HttpResponseInterceptor,
} from "@/bootstrap/boundaries/http-boundary/http-boundary.interface";
import Endpoint from "@/bootstrap/endpoint/endpoint";
import IBaseHttpResponse from "@/feature/common/data/http/i-base-http-response";
import ResponseStructureFailure from "@/feature/common/failures/response-structure.failure";
import { left, right } from "fp-ts/lib/Either";
import { faker } from "@faker-js/faker";

type ResponseStructure<DATA = any> = {
  status: number;
  message: string;
  main: DATA;
};

const fakeBaseURL = faker.internet.url();
class MockedEndpoint extends Endpoint<ResponseStructure> {
  protected baseURL: string = fakeBaseURL;

  protected apiVersion: string = "";

  protected toHttpDataResponse<DATA>(
    response: ResponseStructure<DATA>,
  ): IBaseHttpResponse<DATA> {
    if (!response.main) {
      throw response;
    }
    return {
      data: response.main,
      success: true,
      message: response.message,
      status: response.status.toString(),
    };
  }

  protected interceptors?:
    | { request?: HttpRequestInterceptor; response?: HttpResponseInterceptor }
    | undefined = undefined;
}

describe("Endpoint", () => {
  describe("ToHttpResponse", () => {
    describe("On correct response structure", () => {
      it("Should return correct response", async () => {
        const fakeResponse: ResponseStructure<string> = {
          main: "mocked-data",
          message: "mocked-message",
          status: 200,
        };
        const result = await new MockedEndpoint().toHttpResponse(
          fakeResponse,
        )();
        expect(result).toEqual(
          right({
            data: fakeResponse.main,
            success: true,
            message: fakeResponse.message,
            status: fakeResponse.status.toString(),
          } as IBaseHttpResponse<string>),
        );
      });

      describe("On incorrect response structure", () => {
        it("Should return correct failure", async () => {
          const incorrectResponseStructure = "response";
          const result = await new MockedEndpoint().toHttpResponse(
            incorrectResponseStructure as any,
          )();
          expect(result).toEqual(
            left(
              new ResponseStructureFailure({
                message:
                  "API response structure does not match the expected shape",
              }),
            ),
          );
        });
      });
    });
  });
});
