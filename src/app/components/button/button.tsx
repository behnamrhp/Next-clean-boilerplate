"use client"
import BaseView, { BuildProps } from "@/bootstrap/helpers/view/base-view";
import ButtonVm from "@/app/components/button/button-vm";
import { ReactNode } from "react";

export default class Button extends BaseView<ButtonVm> {
    protected Build(props: BuildProps<ButtonVm>): ReactNode {
        const {vm} = props
        
        return <button onClick={vm.onClick} >{vm.props.title}</button>
    }
}
