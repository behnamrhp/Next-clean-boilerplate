"use client"
// import gdi from "@/bootstrap/di/init-di";
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import IBaseVM from "@/bootstrap/helpers/vm/i-base-vm";
import { Component, ReactNode, FC, PropsWithChildren, memo } from "react";

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

    const vm = Vm.useVM()

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

type BaseProps<IVM extends IVMParent, PROPS extends IPropParent = undefined> = {
  vm: IBaseVM<IVM>;
  restProps?: PROPS;
  /**
   * By default it's true.
   * If you pass true this view will update just by changes of vm not rest props
   *
   */
  memoizedByVM?: boolean;
  children?: ReactNode;
};

export type BuildProps<
  IVM extends IVMParent,
  PROPS extends IPropParent = undefined,
> = {
  vm: IVM;
  restProps: PROPS;
  children?: ReactNode;
};

export default abstract class BaseView<
  IVM extends IVMParent,
  PROPS extends IPropParent = undefined,
> extends Component<BaseProps<IVM, PROPS>> {
  /* -------------------------------- Abstracts ------------------------------- */
  protected abstract Build(props: BuildProps<IVM, PROPS>): ReactNode;

  /* -------------------------------- Renderer -------------------------------- */
  render(): ReactNode {
    const { vm, restProps, memoizedByVM, children, ...rest } = this.props;
    
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
  /* -------------------------------------------------------------------------- */
}
