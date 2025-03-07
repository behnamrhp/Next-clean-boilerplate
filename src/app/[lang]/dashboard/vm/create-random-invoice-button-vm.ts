import ButtonVm from "@/app/components/button/button-vm";
import { useServerAction } from "@/bootstrap/helpers/hooks/use-server-action";
import useThrottle from "@/bootstrap/helpers/hooks/use-throttle";
import BaseVM from "@/bootstrap/helpers/vm/base-vm";
import langKey from "@/bootstrap/i18n/dictionaries/lang-key";
import { InvoiceParam } from "@/feature/core/invoice/domain/param/invoice-param";
import {
  CreateInvoiceUsecase,
  createInvoiceUsecaseKey,
} from "@/feature/core/invoice/domain/usecase/create-invoice/create-invoice.usecase";
import { faker } from "@faker-js/faker";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default class CreateRandomInvoiceButtonVM extends BaseVM<ButtonVm> {
  private createInvoice: CreateInvoiceUsecase;

  constructor() {
    super();
    this.createInvoice = this.di.resolve(createInvoiceUsecaseKey);
  }

  useVM(): ButtonVm {
    const router = useRouter();
    const [action, isPending] = useServerAction(() =>
      this.onClickHandler(router.refresh),
    );
    const throttledOnClick = useThrottle(action, 5000);

    const { t } = useTranslation();

    return {
      props: {
        title: t(
          isPending
            ? langKey.global.loading
            : langKey.dashboard.invoice.createButton,
        ),
        isDisable: !!isPending,
      },
      onClick: throttledOnClick.bind(this),
    };
  }

  async onClickHandler(refreshPage: () => void) {
    const fakedParams: InvoiceParam = {
      amount: faker.number.int({
        min: 1,
        max: 10,
      }),
      status: "paid",
    };
    await this.createInvoice(fakedParams);
    refreshPage();
  }
}
