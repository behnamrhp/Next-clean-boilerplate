# Feature layer architecture

## Table of Contents
- [Feature layer architecture](#feature-layer-architecture)
  - [Table of Contents](#table-of-contents)
  - [Architecture overview of the feature layer](#architecture-overview-of-the-feature-layer)
  - [Class diagram of feature layer](#class-diagram-of-feature-layer)
  - [Layers responsibilities](#layers-responsibilities)
    - [Data layer](#data-layer)
      - [Data transfer object:](#data-transfer-object)
      - [Repository:](#repository)
    - [Domain layer](#domain-layer)
      - [Entity:](#entity)
      - [Enums:](#enums)
      - [IRepo:](#irepo)
      - [Usecase:](#usecase)
      - [Params:](#params)
      - [BaseFailure:](#basefailure)
  - [The usage of functional programming in feature layer](#the-usage-of-functional-programming-in-feature-layer)


## Architecture overview of the feature layer
This layer handles the business logic of each feature. For each feature this layer is divided into two parts, `data` and `domain`. where the data is divided into:
2. dto
3. repository

while the domain is divided into;
1. usecase
2. entity
3. failure
4. repository interface


## Class diagram of feature layer
The following class diagram shows the relation between domain and data inside feature layer:

![Feature layer class diagram](https://www.plantuml.com/plantuml/dpng/XL31QiCm33t7N-5ZEsW-88pG7NBOOPUIVO18jSqqiOsbm4ANVvzhrQtffO48-prBJ-_jYI7mF8tAmt22RzH7Du6n-gogZCo40n16ICTl6858VvPOfV4NXvbnisrq3tJg3FzWUEqi6rxQrBQgon-BiOpX2mRKxmVqZWoxiCXe_MIEJ55v1u7F5mpjFEak5afNuJq44E2sxcxNNjiYA8U4fTQ7TzAkujBtR82X22QWTsKeTpywgYQYWEhwhoqz9puBljJr8xcgAjQRD2Sf4Ve0xp7aqC2RtecPJK3opX8sX-kXNpnk6s5poEdIkpTldhvVLU51iXBnnArgZ_OuJ-C_)

## Layers responsibilities
feature layer responsibilities can be divided into data layer responsibilities and domain layer responsibilities.
### Data layer
#### Data transfer object:
Data transfer object (DTO) are commonly used within the repository layer to convert data fetched from external sources (such as databases or APIs) into domain entities, and vice versa. This conversion ensures that the domain entities remain agnostic of the underlying data storage mechanisms and allows for easier integration with different data sources without affecting the core business logic. for example let's imagine that the response type when a book will be created is as follows:

[user.mapper.ts](/src/feature/core/user/data/repository/user.mapper.ts)

#### Repository:
The repository acts as an adapter pattern between the use case and external resource. Also it converts data from the backend format to the application's entity format but also transforms entity-shaped data into a format compatible with the data source. This bidirectional transformation is achieved through the use of data transfer objects (DTOs) which we call mapper in this boilerplate, where the props type mirrors that of the backend's data. Additionally, repositories can interact with each other within the same layer, enabling seamless communication between sibling repositories. 

[user repository](/src/feature/core/user/data/repository/user.repository.ts)

### Domain layer
#### Entity:
Entity is the business object that contains business rules.for example a Book entity can be as follows:
```typescript 
export default class Book {
  id: string;

  title: string;

  autherName: boolean;

  status: BookStatus;

  constructor({ id, autherName, title, status }) {
    this.id = id;
    this.title = title;
    this.autherName = autherName;
    this.status = status;
  }
}
```
> note: BookStatus is an enum implemented in the same layer with entity.

#### Enums:
Enums are used to define a fixed set of values for specific properties within an entity. They ensure type safety and provide clarity on the possible states or options for those properties. for example if there is prop inside `Book` entity that shows the status of the book, if the book is `published`, `sent`, `draft`, an enum can be added as follows:
```ts
enum BookStatus {
	PUBLISHED = "published",
  SENT = "sent",
  DRAFT = "draft",
}
export default BookStatus;
```

#### IRepo:
The repository interface defines a contract for data access operations, abstracting the interaction between the application's domain logic and the underlying data storage mechanisms. for example an IRepo to get a book can be implmented as follows:
```typescript
interface IGetBookRepository{
	execute(): TaskEither<Failure, Book>
}
```

#### Usecase:
Usecase represents the main business logic of the application and orchestrates the overall process flow. It interacts with entities and communicates with external systems through repositories (IRepository). Usecase can connect to its siblings in the same layer, other usecases for example, the following diagram illustrates how usecase and repositories can connect to other ones in the same layer:

#### Params:
Params serve as structured schemas containing input parameters crucial for use case execution. These schemas encompass business rules and validations that necessitate careful handling during processing. Their primary function is to facilitate modularization and decoupling within the application architecture, offering a standardized interface for seamless communication between different layers. For example if it is required to validate the params of the book, the `title`, `authorName` and `status` should be validated, the team is formulating the validation terms, for example the team agreed on the following:
1. title: it should not be undefined
2. authername: it can be undefined
3. status: it should be defined
so the parms class will have two methods, the first one to validate each param separately, the second one to validate all the params at once:
```ts
 get bookCreationParamsValidator() {
    return {
      title: string().required(),
      autherName: string(),
      status: string().required(),
    };
  }

  /**
   * Schema for all parameters.
   * You can use it to validate or cast or use its type
   */
  get schema() {
    return object(this.bookCreationParamsValidator);
  }
}
```
`required` word means that the param should be defined, `bookCreationParamsValidator` can be used to validate a param while `schema` is used to validate all params.
> note: yup library is used for validation in this project.

#### BaseFailure: 
BaseFailure mechanisms in the application serve as critical pointer of errors or exceptional conditions encountered during execution. By sticking to functional programming principles, errors are consistently represented on the left side, ensuring clear and predictable error handling pathways. The base failure, represented by the Base Failure class, plays an important role in this process. By extending the Error class and providing a standardized failure message, it serves as a foundational element for creating custom failure classes made specifically to specific error scenarios. These custom failure classes allow for precise and reliable error signaling, enabling straight error handling workflows. Additionally, the use of failure keys facilitates automated error handling processes, enhancing efficiency and robustness. Overall, the integration of failure mechanisms aligns straightforward with the application's functional programming paradigm, ensuring comprehensive error management and enhancing code reliability.
>note: during the implementation, BaseFailure is the left side of the reusable type `ApiTask` which is based on `TaskEither` from `fp-ts` library. for example to make a failure for a problem in the network, it can be implemented as follows:
```ts
export default class NetworkFailure extends BaseFailure {
  constructor() {
    super("network");
  }
}
```
to get more familiar with failure, see [Failure documentation](/catalog/docs/failure-error-handling/failure-error-handling.md)

## The usage of functional programming in feature layer
Functional programming plays a crucial role in our feature layer, providing a structured and efficient approach to managing connections between different layers of our system. Beyond its traditional benefits, functional programming enables robust error handling and manipulation throughout the application. By following to functional principles, we ensure that each process within our system is handled independently and comprehensively, enhancing clarity and maintainability.
Through functional programming, we can easily propagate return types across layers, enabling clear communication and transparent data flow. This approach not only enhances code organization and readability but also promote modularization and decoupling, leading to a more maintainable and scalable architecture.
We leverage the `fp-ts` library for functional programming in TypeScript, which provides a rich set of abstractions and utilities for working with functional concepts. For more detailed information on functional programming concepts, see [Functional programming documentation](https://gcanti.github.io/fp-ts/modules/)
