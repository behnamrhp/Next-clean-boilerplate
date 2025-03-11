# Error handling with failure

## What is failure
In each application and in each logic, there can be failure on the process and based on their complexity it can be few or many possilbe scenarios for these failures.

In software development we always trying to have more controll on this failure to:
- Avoid possible bugs  
- Help user to understand about the state of the application with proper messages
- Controll on the processes for some side effects
- Monitor the behavior of the application

So having a specific way of error handling for these failure to achieve all these requirements in our app, helps us to build more robust, trustable, and maintainable application.

Many frameworks provides their own ways to handle these failures which thet can name it as exceptions, failures or any other things, but for sure we shouldn't always depend our logics and apps to the behavior of the frameworks and besides there are many frameworks which doesn't provide error handling tools, so we should always have a specific and reliable way to handle our errors in all layers of the application.

## Failure handling with base failure
To have granular controll on the failure and have specific type for all errors we can use the inheritance and abstraction power of oop.
So we can define an abstract calsss as our base failure, which is our specific type of our failures in the application.

```ts
export default abstract class BaseFailure<META_DATA> {

  metadata: META_DATA | undefined;

  constructor(metadata?: META_DATA) {
    this.metadata = metadata ?? undefined;
  }
}

```
As you see it's just a simple abstract class which gets some metadata about details of error in any shape. But wait it's just starting of the story, we can have many ideas with this failure.

## How to write a simple failure
So for creating a simple failure we can just define our failure in any domain for any scenaio which we need like this:
```ts
export default class CreateUserFailure extends BaseFailure<{ userId: string }> {
  constructor(metadata?: { userId: string }) {
    super(metadata);
  }
}
```

So in our logics for creating user we can return specific tyep of failure for creating user.

## Combination with Functional programming
Functional programming is a deep topic which we cannot cover it here for more details and learn about it you can watch these course or many courses and related books which exists on the web. But for this article we care about one of the most useful functors in functional programming and how failure can fit perfectly with failure. And this functor is either funtor. 
Either provides a data which is two parts, it's right answer and left answer. right answer is the type of the answer which we expect from either and left answer is exactly what we need as unexpected result.
You're gussing right this base failure will be our left answers for either functor.
```ts
Either<
  BaseFailure<unknown>,
  ResponseType
>
```
So as we always have specific type for handling unexpected resulsts, so we can define a new type for either in our app.
```ts
export type ApiEither<ResponseType> = Either<
  BaseFailure<unknown>,
  ResponseType
>;
```
So any othe either which for calling api we can use this either type for them.
And also for async process we use TaskEither which is the same as either functor but for asynchronous process.
```ts
type ApiTask<ResponseType> = TaskEither<BaseFailure<unknown>, ResponseType>;
```

For example to get customers repository to handle all calling for customer api we can use this type for them.
```ts
export default interface CustomerRepo {
  fetchList(query: string): ApiTask<Customer[]>;
}
```
And in the repo we can have this pipe to get customer data:
```ts
pipe(
      tryCatch(
        async () => {
          ...// calling api and returning result
        },
        (l) => failureOr(l, new NetworkFailure(l as Error)),
      ),
      map(this.customersDto.bind(this)),
    ) as ApiTask<Customer[]>;
```
Pipe is just a pipe of process and operations which we make on the data to shape the whole process.

As you see in try catch which is constructor of a ApiEither we defined our right response from first callback and our failure as the second callback argument.
And failureOr is just a helper to get a error and turn to some specific failure __which is NetworkFailure in this example__ 
So in the process of fetching customer we know the unexpected result, always will be a speicfic type. 
```ts
export function failureOr(
  reason: unknown,
  failure: BaseFailure<any>,
): BaseFailure<any> {
  if (reason instanceof BaseFailure) {
    return reason;
  }
  return failure;
}
```
So in any layer we can get the failure do some logics on left response based on its metadata and turn the failure shape to any other failure shape and use it for different purposes.

## Usecases of this idea

### Monitoring for failures
There are many situations that when some important process had some problems we wanna have controll on it, to know when and why these things happened and store it in one of the monitoting tools. 

For example on getting CreateUserFailure in repository layer, we can send a log with specific time and use parameters data to any logging or monitoring tools.

### Monitoring on bugs with dev failures
There are many situations specifally in frontend appications which some unexpected behavior happens from the development mistakes and bugs for example by getting some bugs or data changes in apis, it's possible to face with unexpected behaviors  and we wanna show some specific message or redirect user to error page with descent message. On top of in frontend applications they cannot get the log in this situation as it's happened in the user's system, so they can send the metadata as a log to one api if they face with dev failures.

To acheive this we can simply define another abstract failure like this:

```ts
export default abstract class BaseDevFailure<
  META_DATA,
> extends BaseFailure<META_DATA> {}
```
As you see it's just another failure which is extend from base failure.
So for example in some part of application which should send some arguments into domain layer and as these arguments are dynamic and possible to send unexpected data we can define one dev failure for this situation like this:
```ts
export default class ArgumentsFailure<
  META_DATA,
> extends BaseDevFailure<META_DATA> {
  constructor(metadata?: META_DATA) {
    super(metadata);
  }
}
```
So we can consider this scenario in our logics and facing with this failure we can make a log request to our log api even from frontend applications, so on facing with this situation they can show a descent message to user to contact to support team at the same time they store the bug log to have full controll on these situations.

### Manage translations and error messages with failure
With this idea we can move one step beyound error handling and even handle translation and showing related messages in frontend applications in an automatic way.

For each process and scenario we should define specific failure and also at the same time for each one of them we should show specific message in specific language based on selected language by the user. 

So we can use this idea and automate these process together.

