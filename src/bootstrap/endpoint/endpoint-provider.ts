import BackendEndpoint from "@/bootstrap/endpoint/endpoints/backend-endpoints";
import IdpEndpoint from "@/bootstrap/endpoint/endpoints/idp-endpoints";

export default class EndpointProvider {
  static get backend() {
    return new BackendEndpoint();
  }

  static get idp() {
    return new IdpEndpoint();
  }
}
