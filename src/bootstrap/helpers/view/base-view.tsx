/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */

"use client";

import { useDI } from "@/bootstrap/di/di-context";
import IBaseVM from "@/bootstrap/helpers/vm/i-base-vm";
import { Component, ReactNode, FC, PropsWithChildren, memo } from "react";
import { InjectionToken } from "tsyringe";

/* -------------------------------------------------------------------------- */
/*                             Connector Component                            */
/* -------------------------------------------------------------------------- */
interface IVvmConnector<IVM, PROPS> extends PropsWithChildren {
  View: FC<any & { vm: IVM }>;
  Vm: IBaseVM<IVM>;
  restProps?: PROPS;
  memoizedByVM?: boolean;
}

/**
 * This function is just will be used in
 */
const VvmConnector = memo(
  <IVM, PROPS>(props: IVvmConnector<IVM, PROPS>) => {
    const { View, Vm, restProps, children } = props;
    const vm = Vm.useVM();

    const allProps = {
      restProps,
      vm,
    };

    return <View {...allProps}>{children}</View>;
  },
  (prevProps) => {
    if (prevProps.memoizedByVM) return true;
    return false;
  },
);

/* -------------------------------------------------------------------------- */
/*                                  BaseView                                  */
/* -------------------------------------------------------------------------- */
type IVMParent = Record<string, any>;
type IPropParent = Record<string, any> | undefined;

type BaseProps<PROPS extends IPropParent = undefined> = {
  restProps?: PROPS;
  /**
   * By default it's true.
   * If you pass true this view will update just by changes of vm not rest props
   *
   */
  memoizedByVM?: boolean;
  children?: ReactNode;
};

type BasePropsWithVM<
  IVM extends IVMParent,
  PROPS extends IPropParent = undefined,
> = BaseProps<PROPS> & {
  /**
   * Directly instantiated vm
   */
  vm: IBaseVM<IVM>;
};

type BasePropsWithVMKey<PROPS extends IPropParent = undefined> =
  BaseProps<PROPS> & {
    /**
     * TSyringe key for vm to be injected
     */
    vmKey: InjectionToken;
  };

export type BuildProps<
  IVM extends IVMParent,
  PROPS extends IPropParent = undefined,
> = {
  vm: IVM;
  restProps: PROPS;
  children?: ReactNode;
};

export type ViewProps<
  IVM extends IVMParent,
  PROPS extends IPropParent = undefined,
> = BasePropsWithVM<IVM, PROPS> | BasePropsWithVMKey<PROPS>;

/**
 * Base view is base component for all views in mvvm architecture which gets
 *  vm as props and connect it to the view and memoize the component by default
 *  to just render just on changes of its vm.
 */
export default abstract class BaseView<
  IVM extends IVMParent,
  PROPS extends IPropParent = undefined,
> extends Component<ViewProps<IVM, PROPS>> {
  private vm: IBaseVM<IVM> | undefined;

  constructor(props: ViewProps<IVM, PROPS>) {
    super(props);
    this.vm = this.initVm;
  }

  private get initVm() {
    if (Object.hasOwn(this.props, "vmKey")) {
      const { vmKey } = this.props as BasePropsWithVMKey<PROPS>;
      const di = useDI();
      return di.resolve(vmKey) as IBaseVM<IVM>;
    }
    return (this.props as BasePropsWithVM<IVM, PROPS>).vm;
  }

  protected get componentName() {
    return this.constructor.name;
  }

  protected abstract Build(props: BuildProps<IVM, PROPS>): ReactNode;

  render(): ReactNode {
    const { restProps, memoizedByVM, children, ...rest } = this.props;
    VvmConnector.displayName = this.componentName;
    const vm = memoizedByVM ? this.vm : this.initVm;
    if (!vm) {
      const isVmKey = Object.hasOwn(this.props, "vmKey");
      const message = isVmKey
        ? "vm is not defined, check your di configuration"
        : "pass correct vm";
      throw new Error(`Vm is not defined${message}`);
    }

    return (
      <VvmConnector
        View={this.Build}
        Vm={vm}
        memoizedByVM={typeof memoizedByVM === "undefined" ? true : memoizedByVM}
        restProps={{ ...restProps, ...rest }}
      >
        {children}
      </VvmConnector>
    );
  }
}
