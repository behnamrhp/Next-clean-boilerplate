"use client"

import Button from "@/app/components/button/button"
import CreateRandomInvoiceButtonVM from "@/app/[lang]/dashboard/vm/create-random-invoice-button-vm"
import { useDI } from "@/bootstrap/di/di-context"
import { useRef } from "react"

export default function CreateRandomInvoiceContainer() {
    const di = useDI()
    const vm = useRef(di.resolve(CreateRandomInvoiceButtonVM))

    return <Button vm={vm.current}/>
}