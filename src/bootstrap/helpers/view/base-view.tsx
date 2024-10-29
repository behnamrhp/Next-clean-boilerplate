"use client"
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import di from "@/bootstrap/di/init-di";
import BaseVM from "@/bootstrap/helpers/vm/base-vm";
import { Component, ReactNode, FC, PropsWithChildren, memo, MemoExoticComponent } from "react";

/* -------------------------------------------------------------------------- */
/*                             Connector Component                            */
/* -------------------------------------------------------------------------- */
interface IVvmConnector<IVM, PROPS> extends PropsWithChildren {
  View: FC<any & { vm: IVM }>;
  vmName: string;
  restProps?: PROPS;
  memoizedByVM?: boolean;
}

/**
 * This function is just will be used in
 */
const VvmConnector = memo(
  <IVM, PROPS>(props: IVvmConnector<IVM, PROPS>) => {
    const { View, vmName, restProps, children } = props;
    const VmInstance = di.resolve(vmName) as new () => BaseVM<IVM>;
    if (!VmInstance) throw new Error(`Provided vm as ${vmName} is not exists`)

    const vm = new VmInstance().useVM()

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
  vmName: string;
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
> extends Component<BaseProps<PROPS>> {
  /* -------------------------------- Abstracts ------------------------------- */
  protected abstract Build(props: BuildProps<IVM, PROPS>): ReactNode;

  /* -------------------------------- Renderer -------------------------------- */
  render(): ReactNode {
    const { vmName, restProps, memoizedByVM, children, ...rest } = this.props;
    
    const Connector = VvmConnector as MemoExoticComponent<((props: IVvmConnector<IVM, PROPS>) => JSX.Element)>;

    return (
      <Connector
        View={this.Build}
        vmName={vmName}
        memoizedByVM={typeof memoizedByVM === "undefined" ? true : memoizedByVM}
        restProps={{ ...restProps, ...rest } as PROPS}
      >
        {children}
      </Connector>
    );
  }
  /* -------------------------------------------------------------------------- */
}
