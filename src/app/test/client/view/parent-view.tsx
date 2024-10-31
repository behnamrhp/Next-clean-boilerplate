"use client"
import Button from "@/app/components/button/button"
import { TestButtonVM } from "@/app/test/client/vm/test-button-vm"
import { useDI } from "@/bootstrap/di/di-context"
import { useRef } from "react"

export default function ParentView() {
   const di = useDI()
   
    const vmRef = useRef(di.resolve(TestButtonVM))

    return <Button vm={vmRef.current} />
}