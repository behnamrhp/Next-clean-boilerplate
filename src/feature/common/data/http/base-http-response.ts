import { pipe } from "fp-ts/lib/function";
import { chain, left, of, right } from "fp-ts/lib/TaskEither";
import ResponseStructureFailure from "@/feature/common/failures/response-structure.failure";
import IBaseHttpResponse from "@/feature/common/data/http/i-base-http-response";
import ApiTask from "@/feature/common/data/api-task";

export default class BaseHttpResponse<DATA> implements IBaseHttpResponse<DATA> {
  status: string;

  message?: string;

  data: DATA;

  success: boolean;

  constructor({ success, status, message, data }: IBaseHttpResponse<DATA>) {
    this.status = status;
    this.message = message;
    this.success = success;
    this.data = data!;
  }

  static toHTTPResponse<R>(
    response: IBaseHttpResponse<R>,
  ): ApiTask<IBaseHttpResponse<R>> {
    const baseHttpResponse = of(
      new BaseHttpResponse({
        data: response.data,
        success: response.success,
        message: response.message,
        status: response.status,
      }),
    );

    return pipe(
      baseHttpResponse,
      chain((TEBaseHttpResponse) => {
        if (!TEBaseHttpResponse.success) {
          return left(
            new ResponseStructureFailure({
              message: TEBaseHttpResponse.message,
              status: TEBaseHttpResponse.status,
              metaData: JSON.stringify(TEBaseHttpResponse),
            }),
          );
        }
        return right(TEBaseHttpResponse);
      }),
    );
  }

  static getHTTPResponseData = <R>(
    response: IBaseHttpResponse<R>,
  ): ApiTask<R> => {
    if (response.data === undefined) {
      return left(
        new ResponseStructureFailure({
          message: "Response data is undefined",
          metaData: JSON.stringify(response),
        }),
      );
    }
    return right(response.data);
  };
}
