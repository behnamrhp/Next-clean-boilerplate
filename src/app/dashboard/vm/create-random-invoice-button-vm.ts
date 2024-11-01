import ButtonVm from "@/app/components/button/button-vm";
import useThrottle from "@/bootstrap/helpers/hooks/use-throttle";
import BaseVM from "@/bootstrap/helpers/vm/base-vm";
import { InvoiceParam } from "@/feature/core/invoice/domain/param/invoice-param";
import createInvoiceUsecase from "@/feature/core/invoice/domain/usecase/create-invoice-usecase";
import { faker } from "@faker-js/faker";

export default class CreateRandomInvoiceButtonVM extends BaseVM<ButtonVm> {
    private createInvoice: typeof createInvoiceUsecase

    constructor() {
        super()
        this.createInvoice = this.di.resolve(createInvoiceUsecase.name)
    }

    useVM(): ButtonVm {
        const throttledOnClick = useThrottle(this.onClickHandler.bind(this), 5000)
        return {
            props: {
                title: "Create Random Invoice"
            },
            onClick: throttledOnClick 
        }
    }

    onClickHandler() {
        const fakedParams: InvoiceParam = {
            amount: faker.number.int({
                min: 1,
                max: 10
            }),
            status: "paid"
        }
        this.createInvoice(fakedParams)
    }
} 