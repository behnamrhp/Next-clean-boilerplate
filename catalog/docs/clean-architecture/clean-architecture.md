# Clean architecture in Next.js

## Table of Contents

- [Clean architecture in Next.js](#clean-architecture-in-nextjs)
  - [Table of Contents](#table-of-contents)
  - [Clean Architecture Overview](#clean-architecture-overview)
  - [Why did We choose Clean Architecture?](#why-did-we-choose-clean-architecture)
  - [Project clean architecture diagram](#project-clean-architecture-diagram)
  - [Layers breaking down](#layers-breaking-down)
    - [Application Layer](#application-layer)
    - [Feature Layer](#feature-layer)
      - [Domain](#domain)
      - [Data](#data)
    - [Bootstrap layer](#bootstrap-layer)
  - [Layers Connection](#layers-connection)
  - [Folder structuring](#folder-structuring)
    - [DDD aproach in folder structuring](#ddd-aproach-in-folder-structuring)
  
## Clean Architecture Overview
Clean Architecture is a software design philosophy that promotes structuring of large scale systems with a strong emphasis on separation of concerns and dependency inversion. The main goal is to create systems that are highly maintainable, scalable, and testable, while ensuring business logic remains isolated and independent of external frameworks and tools.

![cleanarchitecture.jpg](https://blog.cleancoder.com/uncle-bob/images/2012-08-13-the-clean-architecture/CleanArchitecture.jpg)

> Note: for reading more information about clean architecture visit this [link](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

## Why did We choose Clean Architecture?
For large-scale projects that contains multiple domains characterized by tight coupling between them. Furthermore, these domains can be extended with new features without any predicted limitations. 

Therefore, we require an architecture that can support, scalability, single responsibility, maintainability, testability and quality assurance. Also we need a shared language for our big system which is understandable among the team members.

Implementing a clean architecture, customized to accommodate frontend-specific features, was the optimal solution for this issue.

## Project clean architecture diagram
As we discussed we used customized version of clean architecture based on nextjs-specific features.

![Project architecture](https://www.plantuml.com/plantuml/dpng/fL5TQy8m57tlhuZHXycGVJmCLqKKDpT1GJQszsjoMuDfKj8KaU5_NzfcAtKw67ifwJtdddFlkUFCWh5v8eDiArGA1X8oCKRldX7uL4jjYD8AWo1eHRbYLcX5Ef2cKZ0eVcPIxouwq0rQ1crk5A7j-_xwcj-4GrPqX-sr1BOTKNBf-jo73gzAO4I35Yh-9ThGvpe1SKewwhE8yNz9WuKJmWiHRsni4DMVnGa9tp8qW-ALWh6YD9hK4P4FXv2VgT4Ln4YxWpFeky3TB-ZoF3RLoXej9PgASsXCDaDmIwEVggu_bA7xCcaSWRe56MJeBO_HH-KazZNepzGhGtqgGvttNZ3LcR3Qx2lQuTWUBDJctsUYTPytQC9BjxtVquiUYaD4scpBIXjl-HtsmybgNb4uMc0RJo4GWr0Dua8paEJLQWCn7hMWufNosBtoH7u2)
## Layers breaking down

### Application Layer
This layer is responsible for handling framework and tools, also it'll connect directly to the user. 

This Layer is based on [MVVM (Model-ViewModel-View)](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93viewmodel) Architecture.

This architecture Helps us separate the business logics (controller), UI logics (ViewModel) and UI (View). 

> To decrease the size of the article we separated application layer document to a separated document.

For application layer concepts visit this docs:
[application layer architecture](/catalog/docs/mvvm/application-layer-architecture.md)


### Feature Layer
This layer responsibles for just business logics.

#### Domain 
This layer is a part of Feature layer which is the heart of our app and it just care about the main business logics of the app.
So This layer is independent of any specific technology or framework and represent the fundamental concepts and rules of the business domain.

This layer contains three parts:
  1. Entity: Is our business object and contains our business rules.

          Example: `User` entity represents:
            - `id`
            - `firstName`
            - `lastname`
            - Also some business object logics like `getFullName`
2. Usecase: The Use Case represents the main business logic of the application and orchestrates the overall process flow. It interacts with entities and communicates with external systems through repositories (IRepository).
In this scenario, the primary benefit is the separation of core business logic from external frameworks and third-party dependencies, ensuring encapsulation and maintainability of the application.

        Example:
        In an e-commerce application:
        `PlaceOrderUseCase`:
        Manages the process of placing an order, including validation, inventory management, and order creation.
        Utilizes IProductRepository to retrieve and update product information without directly coupling to the database or external APIs.
3. I-Repository: It's an interface to define a contract for data access operations within the application. It abstracts away the details of specific data storage implementations (such as databases or external services) from the usecase.
   
So our usecase knows how to communicate with outside of the app through I-Repository.

#### Data
This layer is responsible for interfacing with external systems and services, adapting their data formats and logic into business entities that the application can use.

1. Repository: It implements the `IRepository` interface defined in the domain layer. It serves as a bridge for managing data format adaptation between the application's business entities and external data sources. In essence, the Repository acts as an adapter between use cases and external services.
   
This repository uses `Mapper` to turn data format between application business entities and datasources. 

> Note: For more details about feature layer, class diagram, code example, testing of this layers, you can visit this document:
[feature layer architecture](/catalog/docs/feature-layer/feature-layer-architecture.md)

### Bootstrap layer
Bootstrap layer represents configs and initial configuration of application. It includes DI configuration, localization configuration, configuration for graphql, httpHandled and local storage, base classes for context, view and vm.

It has these folders:
- boundary - to implement library boundary.
- config - configuration for application.
- di - DI configuration.
- global-types - typescript types to be used in any place of project.
- helper - place for extract frequently encoutered functions, classes and types.
- i18n - localization configuration.
  
## Layers Connection
For connecting layers we uses DI(dependency-injection) by [tsyringe](https://github.com/microsoft/tsyringe).

> Note: Fore more details about DI, Structures and usage examples, please visit DI documentation from this [link](/catalog/docs/di/di-architecture.md)

## Folder structuring
```
└── src/
    ├── app/
    │   └── users/
    │       ├── controllers
    │       ├── view/
    │       │   ├── server
    │       │   └── client/
    │       │       └── some-component/
    │       │           ├── some-component.view.tsx
    │       │           ├── stories
    │       │           └── style/
    │       │               └── i-vm
    │       ├── page
    │       └── vm
    ├── feature/
    │   ├── core/
    │   │   └── users/
    │   │       ├── data/
    │   │       │   ├── repository
    │   │       │   └── mapper
    │   │       └── domain/
    │   │           ├── failure
    │   │           ├── i-repository
    │   │           ├── entity
    │   │           └── usecase
    │   ├── support
    │   └── generic
    ├── bootstrap/
    │   ├── boundary
    │   ├── config/
    │   │   ├── server
    │   │   └── client
    │   ├── di
    │   ├── endpoint
    │   ├── helper
    │   └── i18n
    └── test/
        ├── common
        ├── unit
        └── e2e
```

### DDD aproach in folder structuring
For folder structuting we can following Domain Driven Design approach. A domain is a subject area that describes a set of business problems and goals. We have 3 domains in our project
 - core - all the features that are related to the main purpose of the project.
 - generic - reusable logic to use in any place from project.
 - support - logic that helps to perform logic.

Each one of them has subdomains for separate feature.

For example for buisness layer of User feature we will go inside of ```src/features/core/user```.