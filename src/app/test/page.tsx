"use client"
import "reflect-metadata"
import TestButtonVM from "@/app/test/vm/test-button-vm";
import Button from "@/components/button/button";

export default function Page() {
    return <Button vmName={TestButtonVM.name} />
}