# Application Layer Architecture

## Table of Content

- [Application Layer Architecture](#application-layer-architecture)
  - [Table of Content](#table-of-content)
  - [Application layer overview](#application-layer-overview)
  - [Class Diagram](#class-diagram)
  - [ReactVVM](#reactvvm)
  - [Controller / Model](#controller--model)
  - [ViewModel (VM)](#viewmodel-vm)
    - [DI](#di)
    - [Testing](#testing)
  - [View](#view)
    - [Bridge pattern](#bridge-pattern)

## Application layer overview
This layer as the final layer which communicate with final user should handle many parts and many tools. So to keep the single responsibility, scalability, maintainability and testability of the project we need to have a reliable architecture to separate all these logics into correspond parts.This architecture should also leverage React's features and optimize the performance of the application.<br/>
So based on react features, one of the best architecture which suits is MVVM(Model-ViewModel-View).<br/>
MVVM is made of these layers:
1. Model: Handles Data logics such as filtering, saving, removing or validating data. also it makes connection to business logics in domain layer as well.

> Note: As we're using Nextjs and we put the model in the server side, so we change the model name to controller and we put all data logics in the controller and connect it to the domain layer.

2. ViewModel(VM): It's responsible for all UI logics and makes connection between model and view to send updated data to the view

3. View: Renders user interface components based on data provided by the ViewModel, with minimal logic.

You can read more about MVVM from these articles:

- [Cracking the Code: How the MVVM with Bridge Pattern Saves a Messy Frontend UI (Part 1)](https://dev.to/behnamrhp/cracking-the-code-how-the-mvvm-with-bridge-pattern-saves-a-messy-frontend-ui-part-1-3h4)

- [Cracking the Code: How the MVVM with Bridge Pattern Saves a Messy Frontend UI (Part 2)](https://dev.to/behnamrhp/cracking-the-code-how-the-mvvm-with-bridge-pattern-saves-a-messy-frontend-ui-part-2-22oc)

Despite of all features in MVVM, Most important feature in MVVM architecture is that View gets all updates of ViewModel, then updates UI based on updated data.
In react we can implement this feature with custom hooks as a Viewmodel to handle UI logics and react components as UI which gets update of Viewmodel which is just a custom hook. main reason about why we chose MVVM in react was this reason.
 
Another key concept addressed by this approach is the avoidance of redundant UI re-rendering in child components through component caching based on related properties. In MVVM, views typically update based on changes in their corresponding view models (VM). Therefore, caching each component using this approach allows us to prevent unnecessary re-rendering of child components.

To handle all these features for MVVM in react we used our customized templates and tools for each layer and also for their connection.

## Class Diagram

![Class Diagram](https://www.plantuml.com/plantuml/dpng/VP9DRW8n38NNvHHUjWiuG1S8bIv0Afl-iC_C618fYT7O0uksTw-JIM7uQIKa4cA_xptZ6OjffGj-L7l336k71_Zy7W544WIXdHu1Nf5t5DbL7c53BNmizMUCJQuQwRdlNgvNW-QAH2X05fZJ7gCuYb2X712ZIe1H0Vtoj7Kr3mMXzp6PJ9Fa8rZ39qXYPCr4wnZNg_i7lLzvNgYyHpuIe3AC3L3CZIuAjXjJuqKGVHgF2zODg4_QV2DT2HU2oWOKImtdM4BaEO-gSoKW22MxIbR8PToLXlsQ5ig9EgSeBNcFxVLS0SvYFXinXPGTr1GZrfAeLSSk8dDvlavCEka1gmpyhlVm9jHYnWzA-fRyL2I6zz980HTkQx5zmJtwFrRhtJe6_HYmkHPyAbRxGJSEey31kjf2H6oE8nHh1FP9ZocB03ZvJLoMM4XjdKtvfg7qPvSL-wz23ttDJFMwu7y0)

## ReactVVM
To have a shared language for this architecture we use reactvvm library which has full documentation and it's reliable to use in production.

[ReactVVM repo](https://github.com/behnamrhp/React-VVM)

## Controller / Model 
Controller is the layer which handles all data related logics in the server side. it can have various responsibilities such as:
1. Connect to the usecases in the feature layer.
2. Connect to the stores data to be accessible in the client part.
4. Decides about caching strategy, revalidating a path or even redirecting to another path.

Example:
[create-invoice.controller.ts](/src/app/[lang]/dashboard/controller/create-invoice.controller.ts)
  
## ViewModel (VM)
From this layer as we should handle UI logics so we should deal with the react hooks and apis.

We can have two types of VMs which based on the context we'll use them:

- Personal VM: Some of the Views can have their own personal VMs to handle their own logics and it is attached to the view directly, so it cannot be different based on any context.
- Reusable VM: Reusable VMs are connected to the interface which is defined in the View layer. Which means we can use different VMs for same view in different contexts. For example one button with same UI can have different logics in different places like save button, logout button and so on.

PersonalVM example: [nav-link.personal-vm.ts](/src/app/[lang]/dashboard/components/client/nav-links/nav-link.personal-vm.ts)

As you see the vm is connected to the view directly.

ReusableVM example: [create-random-invoice-button-vm.ts](/src/app/[lang]/dashboard/vm/create-random-invoice-button-vm.ts)
For this layer we use a class which has a method which it's name is `useVM`.
this useVM method is that custom hook which handles all UI logics.<br/>
also we can use other method to handle each logics inside of VM.<br/>
This `useVM` method will return `IVM`, which is defined with `View` layer.<br/>

Button IVM example: [app-button-vm.ts](/src/app/components/button/button.i-vm.ts)

As you see IVM is always attached to the View.

### DI
In the Nextjs many times happens that we need to pass a vm from server component to client component but we cannot pass the vm directly from server component to client component because it's not serializable and we need to pass it by its key through DI. <br/>
So we need to make a file for modules like this file:
[module.ts](/src/app/[lang]/dashboard/module/dashboard.app-module.ts)

Then we pass it to the di provider in anywehre we need to use it in the app like layout:
[layout.ts](/src/app/[lang]/dashboard/layout.tsx)

And finally for the usage we can pass the key to the view from server component to client component like this example which we passed the vm key to the Button component:
[latest-invoces.tsx](/src/app/[lang]/dashboard/components/server/latest-invoices.tsx)

For non dynamic VM we can register them in DI with singleton decorator. Also we can use IBaseVM interface instead of extending BaseVM abstarct class.


### Testing
To test our VM we use `react-hook` library in `testing-library`. This library has many features, such as rerendering, waitForRerender and etc.<br/>
so we can have unit test for our UI logics with the power of DI for mocking dependencies and testing library to test react related apis.<br/>

Example:
```typescript

// Mock Model
const mockInitBearMethod = vitest.fn()

const mockedBearModel = getMock<BearModel>()

mockedBearModel.setup((instance) => instance.initBear).returns(mockInitBearMethod)

di.register(BearModel, {
  useValue: mockedBearModel.object()
})

const getVM = () => {
    const vm = di.resolve(BearListVM);
    return renderHook(() => vm.useVM());
  };
it("Should call init bear method in model just once through all rerenders", async () => {
        // ! Act
        const vm = getVM();
        vm.rerender()
        // ? Assert
        expect(mockInitBearMethod).toHaveBeenCalledOnce();
      });
```

## View
As we said this layer we just handle UIs.
We have two types of Views.<br/>
some views doesn't need any UI logics, like some static data in the app. so for this type of views we just use simple functional components in react.<br/>
But most of the views needs to be reusable by many UI logics which should be handled in many VMs. to connect these two layers and keep this view reusable we're using bridge design pattern which has provided by reactvvm library.

Example: [app-button.tsx](/src/app/components/button/button.tsx)

### Bridge pattern
Most important point about this pattern is that we have a part as abstraction which doesn't know anything about implementations and for each abstract part we can have many implementations. for connecting our one abstract part to many implementations we use an interface as bridge betwen them.
> Note: for more information and learn this pattern visit this [link](https://refactoring.guru/design-patterns/bridge).<br/>

> Note: This BaseView is our template component which gets View from `Build` method and gets vm and connect these two and also handles memoization of view to render just by changes of its vm not parent component's re-renders.

> Note: To passing other props despite of VM we can pass them through `restProps`. <br/>

Example: 
```typescript
<Button vm={saveBearsButtonVM} restProps={{
  className: 'w-full'
}} />
```



