"use client"
import testAppModule from "@/app/test/modules/test-app-module";
import { DiContext } from "@/bootstrap/di/di-context";
import { PropsWithChildren, useRef } from "react";

export default function WithDILayout(props: PropsWithChildren) {
    const testDi = useRef(testAppModule())
    return <DiContext.Provider value={testDi.current}>{props.children}</DiContext.Provider>
}

