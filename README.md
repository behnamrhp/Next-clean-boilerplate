# Nextjs clean architecture boilerplate

## Table of content

- [Nextjs clean architecture boilerplate](#nextjs-clean-architecture-boilerplate)
  - [Table of content](#table-of-content)
  - [Overview](#overview)
  - [Motivation](#motivation)
  - [Technologies](#technologies)
  - [Architecture](#architecture)
    - [Folder structure](#folder-structure)
  - [Requirements](#requirements)
  - [Getting Started](#getting-started)
    - [Local](#local)
    - [Docker](#docker)
  - [naming convetions:](#naming-convetions)

## Overview
This project is a starting point for your medium to large scale projects with Nextjs, to make sure having a structured, maintainable and scalable foundation for your Next.js project based on best practices in clean architecture, DDD approach for business logics, MVVM for the frontend part, storybook and vitest for testing and, localization and also functional programming with error handling for business logics. 

## Motivation

Next.js and many other modern SSR frameworks provide powerful tools and a fresh approach to frontend development. However, since these tools are relatively new, the focus has largely been on features rather than software engineering best practices.  

As a result, many teams use Next.js for its capabilities but neglect maintainability, architecture, and scalability—especially in medium to large-scale applications. Over time, this leads to unmanageable codebases, difficulty in adding new features, and even business failures.  

After extensive trial and error in my career, I decided to create a **structured, robust, and maintainable boilerplate** for Next.js, incorporating best practices that align with its features. This template is based on real-world experience and is designed to serve as a solid foundation for SSR projects.  

I’ve personally used this boilerplate in multiple enterprise-level web applications, and it has been thoroughly tested. You can confidently use it in production.  

> **Note:** I welcome your feedback, issues, and suggestions to improve this project together. For contribution guidelines, please check [CONTRIBUTE.md](CONTRIBUTE.md).  

## Technologies

- Language: [Typescript](https://www.typescriptlang.org/)
- Framework: [Next.js](https://nextjs.org/)
- Testing tools: [Vitest](https://vitest.dev/)
- UI documenting: [Storybook](https://storybook.js.org/)
- Lintins: [ESlint](https://eslint.org/)
- Component library: [Shadcn](https://ui.shadcn.com/)
- Css utility: [Tailwindcss](https://tailwindcss.com/)
- i18n: [I18Next](https://www.i18next.com/)
- dependency injection: [tsyringe](https://github.com/microsoft/tsyringe)
- functional programming: [fp-ts](https://gcanti.github.io/fp-ts/)
- MVVM architecture: [ReactVVM](https://github.com/behnamrhp/React-VVM)
- Schema validator: [Zod](https://zod.dev/) 
- Mocking tool: [Moq.ts](https://github.com/dvabuzyarov/moq.ts)
- Faking tool: [Fakerjs](https://fakerjs.dev/)
- Containerization: [Docker](https://www.docker.com/)
- CI: [Gihub actions](https://github.com/features/actions)
  
## Architecture
To make sure about maintainability and scalibility of the application we're following clean architecture, MVVM architectural patter in frontend part with using [ReactVVM](https://github.com/behnamrhp/React-VVM) and DDD approach in business logic related layers.

- To know more about details, diagrams and tutorials check documents in catalog folder.

### Folder structure
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

## Requirements
To work with this boilerplate, there are some base requirements based on some best practices in software development which we used in this boilerplate. We've provided all necessary documentation for each one to learn about them step by step:

- [Clean architecture](/catalog/docs/clean-architecture/clean-architecture.md)
- [Business Logic handling with DDD](/catalog/docs/feature-layer/feature-layer-architecture.md)
- [MVVM](/catalog/docs/mvvm/application-layer-architecture.md)
- [Failure handling](/catalog/docs/failure-error-handling/failure-error-handling.md)
- [i18n](/catalog/docs/i18n/i18n-guideline.md)
- [Endpoints managements](/catalog/docs/endpoints/endpoint-architecture.md)
- [Dependency injection](/catalog/docs/di/di-architecture.md)
## Getting Started

### Local
1. DB: First, run your postgres db:
2. ENVs: Update `.env.example` file and specify all db related environments and remove `.example` part from the file name
3. Install deps
``` bash
yarn install
```
4. Seed db:
```bash
yarn seed
```
5. run development
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


### Docker
1. ENVs: Update `.env.example` file and specify all db related environments and remove `.example` part from the file name

3. Just run the [docker-compose.yml](/docker-compose.yml) file by this command:
```bash
docker-compose up
```

2. Seed db:
```bash
yarn seed
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## naming convetions:

1. all **_folders_** follow the kebab-case convention for naming.
2. all **_files_** follow the kebab-case.[layer name] convention for naming.
3. all **_variables_** and **_functions_** follow the camelCase convention for naming.