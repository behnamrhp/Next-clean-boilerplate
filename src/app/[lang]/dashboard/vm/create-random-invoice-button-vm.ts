import ButtonVm from "@/app/components/button/button-vm";
import { useServerAction } from "@/bootstrap/helpers/hooks/use-server-action";
import useThrottle from "@/bootstrap/helpers/hooks/use-throttle";
import BaseVM from "@/bootstrap/helpers/vm/base-vm";
import { InvoiceParam } from "@/feature/core/invoice/domain/param/invoice-param";
import createInvoiceUsecase from "@/feature/core/invoice/domain/usecase/create-invoice-usecase";
import { faker } from "@faker-js/faker";
import { useRouter } from "next/navigation";
export default class CreateRandomInvoiceButtonVM extends BaseVM<ButtonVm> {
    private createInvoice: typeof createInvoiceUsecase

    constructor() {
        super()
        this.createInvoice = this.di.resolve(createInvoiceUsecase.name)
    }

    useVM(): ButtonVm {
        const router = useRouter()
        const [action, isPending] = useServerAction(() => this.onClickHandler(router.refresh))
        const throttledOnClick = useThrottle(action, 5000)

        return {
            props: {
                title: isPending ? "Loading" : "Create Random Invoice",
                isDisable: isPending ? true : false
            },
            onClick: throttledOnClick.bind(this)
        }
    }

    async onClickHandler(refreshPage: () => void) {
        const fakedParams: InvoiceParam = {
            amount: faker.number.int({
                min: 1,
                max: 10
            }),
            status: "paid"
        }
        await this.createInvoice(fakedParams)
        refreshPage()
    }
} 