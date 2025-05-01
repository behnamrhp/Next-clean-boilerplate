# Endpoints architecture
## Table of Contents
- [Endpoints architecture](#endpoints-architecture)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Endpoints architecture](#endpoints-architecture-1)
  - [Endpoints explanations](#endpoints-explanations)
    - [BaseEndpoint:](#baseendpoint)
    - [SpecificEndpoint](#specificendpoint)
  - [EndpointsProvider](#endpointsprovider)
  - [Usage Example](#usage-example)
    - [Endpoint Files](#endpoint-files)
    - [Implementation](#implementation)
  - [Conclusion](#conclusion)

## Overview
API URLs, versions, and endpoints are among the most volatile parts of any application. Since they depend on external services, frequent changes can quickly lead to:

- Spaghetti code (scattered URL strings)
- Brittle integrations (tight coupling with third-party APIs)
- Maintenance nightmares (manual updates across files)

This architecture solves those problems by:

- Centralizing endpoint logic in dedicated classes.
- Abstracting URL construction behind reusable methods.
- Isolating versioning/base URLs for easy updates.

Result: Your core code stays clean, even when APIs change.

## Endpoints architecture
The following class diagram shows the architecture of endpoints:
![EndpointArchitecture](https://www.plantuml.com/plantuml/dpng/SoWkIImgAStDKU1ApaaiBbPmIYnETSrBASZFp2kfhkM2YoPdf-Qbm2GKW38G2S-K0an1nxpyaepK8iU2J6GvBdH3T7Lhx53iumAQXaSMOImUHGv06u3U0G00)

## Endpoints explanations
### BaseEndpoint:
The BaseEndpoint class is implemented for manipulating API endpoints within an application.
the BaseEndpoint class requires two parameters: `baseURL` and `apiVersion`, which represent the base URL of the API and the version of the API being used.
BaseEndpoint class has several methods:
- `compose Method (Static)` This static method, takes an array of strings representing different parts of the URL and returns a sanitized URL by joining these parts together. It ensures that the URL is properly formatted and free of any unnecessary double slashes or incorrect separators.
- `buildEndpoint Method` This instance method, buildEndpoint, is responsible for constructing a complete endpoint URL by appending a specific endpoint to the base URL and API version. It returns a sanitized URL string ready for use in API requests.
- `sanitizeURL Method (Static)` You can use this method to ensure that the constructed URLs are correctly formatted. It replaces any occurrences of consecutive slashes with a single slash, ensuring that the URL is valid and compliant with URL standards.
 
Overall, The `BaseEndpoint` class offers a convenient and reliable way to construct and manage endpoint URLs within an application. It enables team members to use a shared language when working with third-party libraries, reducing the risk of bloating the main application code due to API or UI changes in external dependencies.

### SpecificEndpoint
Every specific endpoint class extends the functionality of the `BaseEndpoint` class and introduces additional features specific to this  specific endpoint. This inheritance includes methods for composing and building endpoint URLs.
The specific endpoint encapsulates private properties, these properties are URLs for a specific endpoint.
Overall, the `SpecificEndpoint` class extends the capabilities of the BaseEndpoint class by adding specific endpoint functionalities tailored to the specific system. It provides a convenient and centralized approach for managing and accessing Specific-related endpoints within the application. The following is an example about making a specific endpoint and how it extends the base endpoint:
```ts
import BaseEndpoint from "~/bootstrap/helper/endpoint/base-endpoint";

export default class BookEndpoint extends BaseEndpoint {
  private addBookEndpoint: string;

  private booksEndpoint: string;

  get addBook() {
    return this.buildEndpoint(this.addBookEndpoint);
  }

  get books() {
    return this.buildEndpoint(this.booksEndpoint);
  }

  constructor({
    addBookEndpoint,
    booksEndpoint,
    baseURL,
    apiVersion,
  }: {
    addBookEndpoint: string;
    booksEndpoint: string;
    baseURL: string;
    apiVersion: string;
  }) {
    super({
      apiVersion,
      baseURL,
    });
    this.addBookEndpoint = addBookEndpoint;
    this.booksEndpoint = booksEndpoint;
  }
}
```
As you see the BookEndpoint class extends BaseEndpoint to provide a structured way of managing book-related API endpoints. It encapsulates endpoint construction logic, ensuring consistency and reusability across the application.

## EndpointsProvider
The EndpointsProvider class offers centralized static methods for retrieving various endpoints used in the application. Each method returns an instance of a specific endpoint class, preconfigured with the necessary URLs and settings.

By encapsulating the logic for creating and configuring endpoints, this class simplifies access and usage across the application. Below is an example of how the EndpointsProvider works:
```ts
import BookEndpoint from "~/bootstrap/helper/endpoint/endpoints/book-endpoints";
import appConfigs from "~/bootstrap/config/app-configs";

/**
 * Provides static methods to retrieve different types of endpoints.
 */
export default class EndpointsProvider {
  /**
   * Book api
   */
  static book() {
    return new BookEndpoint({
      apiVersion: "api/v1",
      addBookEndpoint: "book/add",
      booksEndpoint: "book",
      baseURL: appConfigs.baseApis.book,
    });
  }
}
```
> Note: The EndpointProvider step is optional. Instead, you can statically define all required endpoint configurations directly in the endpoint class's constructor.

## Usage Example
You can see implementation examples these addresses:

### Endpoint Files
- [Endpoint implementations](https://github.com/behnamrhp/Next-clean-boilerplate/tree/develop/src/bootstrap/endpoint/endpoints)  
  Contains two endpoint types:
  1. HTTP backend API connections
  2. Identity provider API connections

### Implementation
- [Repository usage](https://github.com/behnamrhp/Next-clean-boilerplate/blob/develop/src/feature/core/user/data/repository/user.repository.ts)  
  Demonstrates how backend endpoints are consumed throughout the application


## Conclusion
Managing API endpoints effectively is crucial for building maintainable applications in our API-driven world. The architecture we've explored:

✅ **Isolates volatile API configurations** from business logic  
✅ **Standardizes endpoint management** across your codebase  
✅ **Dramatically reduces tech debt** when APIs inevitably change  

By implementing this pattern, you'll spend less time on finding and fixing broken endpoints and more time building features. 

*Remember: Good architecture isn't about preventing change - it's about making change manageable.*