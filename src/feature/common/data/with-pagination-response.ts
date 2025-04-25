import ResponseFailure from "@/feature/common/failures/dev/response.failure";

export default class WithPaginationResponse<DATA> {
  readonly data: DATA[];

  readonly total: number;

  constructor({ data, total }: { data: DATA[]; total: number }) {
    if (Number.isNaN(total)) {
      throw new ResponseFailure();
    }
    this.data = data || [];
    this.total = total;
  }
}
