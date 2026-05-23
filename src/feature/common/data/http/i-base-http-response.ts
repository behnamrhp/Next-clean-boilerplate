export default interface IBaseHttpResponse<DATA> {
  status: string;
  message?: string;
  data?: DATA;
  success: boolean;
}
