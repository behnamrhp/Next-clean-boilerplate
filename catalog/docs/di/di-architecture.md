# Di Architecture

## Table of Contents
- [Di Architecture](#di-architecture)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Requirements](#requirements)
  - [Usecase](#usecase)
    - [Where we Use DI](#where-we-use-di)
  - [Feature layer](#feature-layer)
    - [DI Key: Interface-Based Binding](#di-key-interface-based-binding)
    - [Module](#module)
    - [Features di](#features-di)
    - [Usage](#usage)
  - [Application layer](#application-layer)
    - [vm key](#vm-key)
    - [App module](#app-module)
    - [Provider](#provider)
    - [Usage](#usage-1)
  - [Conclusion](#conclusion)
## Overview
Dependency Injection (DI) is one of the most debated design patterns in software development. While opinions vary on whether it’s universally beneficial, one thing is certain: DI can be extremely useful if not treated as a "golden hammer." Overusing it, such as blindly injecting every dependency, can lead to unnecessary complexity rather than cleaner code.

In this article, we’ll explore how DI can be effectively applied in Next.js, striking the right balance between maintainability and simplicity.

## Requirements
This article builds on the architecture outlined in the Next.js Boilerplate repository. To fully understand the implementation, I recommend reviewing these two foundational documents first:

- [Clean Architecture in Next.js](/catalog/docs/clean-architecture/clean-architecture.md)
- [MVVM Architecture in Next.js](https://github.com/behnamrhp/Next-clean-boilerplate/blob/develop/catalog/docs/mvvm/application-layer-architecture.md)

## Usecase
In Next.js applications, we organize the project into two primary layers:

- Feature Layer – Contains all business logic.
- Application Layer – Handles communication with Next.js and React APIs.

### Where we Use DI
We apply DI only between components that:

- Require minimal knowledge of each other (loose coupling).
- Can work independently but integrate seamlessly.

We apply dependency Injection (DI) in different ways in each layer:

1. Feature Layer
   - Usage: DI connects `UseCase` and `Repository` via interfaces, following the `Adapter Pattern`.

   - Purpose: Ensures business logic remains decoupled from data sources (e.g., databases, APIs).

2. Application Layer
   - Usage: DI bridges `ViewModel (VM)` and `View`, adhering to the `Bridge Pattern`.

   - Special Case: When passing a VM from a `Server Component` to a `Client Component`, we use a unique `VM key` for serialization.

3. Also global and other dependencies.
## Feature layer
As mentioned earlier, we use Dependency Injection (DI) in the Feature Layer to connect the `UseCase` and `Repository` layers via interfaces.

### DI Key: Interface-Based Binding
To link a UseCase with its corresponding Repository, we use a unique DI key tied to the repository interface. This ensures type-safe dependency resolution.

Example: [user i repository](/src/feature/core/user/domain/i-repo/user.repository.interface.ts)

As you see in this file we have a `userRepositoryKey` Which we use to register a repository and also use it in usecase to use this repository inside of it.

### Module
In Domain-Driven Design (DDD), a Module serves as a high-level organizational unit that groups related domain concepts. For example, all user-related domain logic (entities, repositories, services) would be organized within a User Module, where we also centralize its dependency injection (DI) registrations.

Example: [User module](/src/feature/core/user/data/module/user-module.ts).

Let's examine the key aspects of this file:

1. **Architectural Layer Responsibility*:
  
    This component has visibility into both domain repository interfaces (i-repo) and concrete repository implementations. According to Clean Architecture principles, this dual knowledge properly places it in the `Data Layer`.

2. **Dependency Injection Setup**:
  
    We get a child DI container that registers all domain repositories and dependencies implementation.

### Features di
To effectively organize, manage, and register all domain modules, we require a centralized component to handle these responsibilities:

Example: [Feature di](/src/feature/common/features.di.ts).

This implementation includes a method for retrieving domain-specific dependency injection (DI) configurations using `unique module keys`. Each domain is assigned a distinct identifier to ensure proper isolation and organization.
For reference, see the user domain domain module key in the [user-module-key](/src/feature/core/user/data/user-module-key.ts) file.

Also in feature di file by adding new module for new domains we can add new domain module to the list of `moduleKeyToDi` object.

### Usage 
At the end, we can get the repository in usecase layer like this:

Example: [createUserUseCase](/src/feature/core/user/domain/usecase/create-user.usecase.ts)

## Application layer
Unlike the feature layer, the application layer follows a different architectural approach. Here we implement the MVVM (Model-View-ViewModel) pattern, where Dependency Injection plays a crucial role in passing ViewModels from server components to client-side views.

### vm key
For a vm we can have a unique key to register the vm by a single unique string

### App module
In each page or route we can define a module to register all vms and any other parts to our di like this:

Example: [Dashboard app module](/src/app/%5Blang%5D/dashboard/module/dashboard.app-module.ts)

### Provider
We can distribute our dependency injection container throughout the component tree by implementing a provider pattern. This enables any component to access registered ViewModels while maintaining proper dependency isolation.

Example: [Dashboard layout](/src/app/%5Blang%5D/dashboard/layout.tsx)

In this example as we're using [ReactVVM](https://github.com/behnamrhp/React-VVM) package, we passed the di to this library's provider so it can connect View to our vm, automatically based on passing Vmkey to the view component.

### Usage
For a concrete implementation example, let's examine how to pass a ViewModel for random invoice generation to a button component.

Example: [Latest Invoice](/src/app/%5Blang%5D/dashboard/components/server/latest-invoices.tsx)

As you see we passed the vm key to the view by vmKey prop to the Button component.

## Conclusion
In this article, we explored a `Clean Architecture` approach using `Dependency Injection (DI)` to decouple business logic, applying `DDD` principles to connect `UseCase` and `Repository` layers via interfaces for maintainability and testability.

For the `Application Layer`, we implemented an `MVVM pattern`, using unique VM keys to bridge server and client components while ensuring reusability and single responsibility via the `Bridge Pattern`. This keeps UI logic clean and scalable across `Next.js` applications.

By structuring DI registration around domain modules and centralized providers, we achieve a flexible, maintainable architecture that works seamlessly in both server and client contexts. 