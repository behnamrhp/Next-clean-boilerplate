export type AuthTokenParams = Omit<AuthToken, "getTokenForHeader">;

export default class AuthToken {
  readonly accessToken: string;

  readonly expiresIn: number;

  readonly tokenType = "Bearer";

  constructor(params: AuthTokenParams) {
    this.accessToken = params.accessToken;
    this.expiresIn = params.expiresIn;
    this.tokenType = params.tokenType;
  }

  getTokenForHeader() {
    return `${this.tokenType} ${this.accessToken}`;
  }
}
