import BaseVM from "@/bootstrap/helpers/vm/base-vm";
import injectableVm from "@/bootstrap/helpers/vm/vm-decorator";
import ButtonVm from "@/components/button/button-vm";

@injectableVm()
export default class TestButtonVM extends BaseVM<ButtonVm> {
    useVM(): ButtonVm {
        return {
            props: {
                title: "Test Button"
            },
            onClick: () => {
                console.log("clicked on the button");
            }
        }
    }
}