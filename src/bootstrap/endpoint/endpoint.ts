/**
 * This is a class called "Endpoint" which serves as a base class for
 *  defining API endpoints.
 *
 * The class has a static method called  compose  which takes an array of
 *  strings representing different parts of the URL and returns a
 *  sanitized URL by joining the parts together.
 *
 * The class also has an instance method called  buildEndpoint  which takes a
 *  string representing an endpoint and returns a sanitized URL by appending
 *  the endpoint to the base URL and API version.
 */
export default class Endpoint {
  /* ------------------------------ Dependencies ------------------------------ */
  protected baseURL: string;

  /* -------------------------------------------------------------------------- */
  protected apiVersion: string;

  /* ------------------------------- Constructor ------------------------------ */
  constructor({
    baseURL,
    apiVersion,
  }: {
    baseURL: string;
    apiVersion: string;
  }) {
    this.apiVersion = apiVersion;
    this.baseURL = baseURL;
  }

  /* --------------------------------- Static --------------------------------- */
  static compose(uris: string[]) {
    return Endpoint.sanitizeURL(uris.join("/"));
  }

  /* ----------------------------- Implementation ----------------------------- */
  protected buildEndpoint(endpoint: string) {
    return Endpoint.sanitizeURL(
      `${this.baseURL}/${this.apiVersion}/${endpoint}`,
    );
  }

  /* -------------------------------------------------------------------------- */
  static sanitizeURL(url: string) {
    return url.replaceAll(/(?<!:)\/\//g, "/");
  }
  /* -------------------------------------------------------------------------- */
}
