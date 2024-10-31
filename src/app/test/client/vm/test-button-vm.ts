"use client"
import BaseVM from "@/bootstrap/helpers/vm/base-vm";
import ButtonVm from "@/app/components/button/button-vm";
import { useEffect, useState } from "react";
import getButtonTitle from "@/feature/domain/test/service/test-get-button-title-service";

export class TestButtonVM extends BaseVM<ButtonVm> {
    private getButtonTitle: () => Promise<string>

    constructor() {
        super()
        this.getButtonTitle = this.di.resolve(getButtonTitle.name)
    }

    useVM(): ButtonVm {
        const [ buttonTitle, setTitle ] = useState("Default title")
        useEffect(() => {
            (async () => {
                const title = await this.getButtonTitle()
                setTitle(title)
            })()
        }, [])
        return {
            props: {
                title: buttonTitle
            },
            onClick: () => {
                console.log("clicked on the button");
            }
        }
    }
}

export const testKey = "testKey"