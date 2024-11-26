import { container, DependencyContainer } from "tsyringe";
import { InjectionToken } from "tsyringe/dist/typings/providers";
import constructor from "tsyringe/dist/typings/types/constructor";
import { isClass } from "../helpers/global-helpers";

/**
 * Provides mocked di for test cases and using instead of real di
 * @param providers List of providers
 * @returns Mocked di with registered providers
 */
const mockedModuleDi = (
  providers: {
    token: InjectionToken<unknown>;
    provider: unknown | constructor<unknown>;
  }[],
): DependencyContainer => {
  const di = container.createChildContainer();

  providers.forEach((provider) => {
    if (isClass(provider.provider)) {
      di.register(provider.token, provider.provider);
      return;
    }

    di.register(provider.token, {
      useValue: provider.provider,
    });
  });

  return di;
};

export default mockedModuleDi;
