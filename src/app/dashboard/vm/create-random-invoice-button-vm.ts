import ButtonVm from "@/app/components/button/button-vm";
import BaseVM from "@/bootstrap/helpers/vm/base-vm";

export default class CreateRandomInvoiceButtonVM extends BaseVM<ButtonVm> {
    useVM(): ButtonVm {
        return {
            props: {
                title: "Button Title"
            },
            onClick: () => {
                console.log('clicked');
            }
        }
    }
} 