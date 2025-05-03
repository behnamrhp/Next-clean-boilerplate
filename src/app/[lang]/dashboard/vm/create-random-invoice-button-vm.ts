"use client";

import createInvoiceController from "@/app/[lang]/dashboard/controller/create-invoice.controller";
import ButtonVm from "@/app/components/button/button.i-vm";
import { useServerAction } from "@/bootstrap/helpers/hooks/use-server-action";
import useThrottle from "@/bootstrap/helpers/hooks/use-throttle";
import langKey from "@/feature/common/lang-keys/common.lang-key";
import { InvoiceParam } from "@/feature/core/invoice/domain/param/invoice.param";
import { faker } from "@faker-js/faker";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { BaseVM } from "reactvvm";

/**
 * Viewmodel for the button view to connect to business logics and all UI logics
 * For UI logics, all translations, states, sideeffects and events will be handled
 *  in this layer.
 */
export default class CreateRandomInvoiceButtonVM extends BaseVM<ButtonVm> {
  private createInvoice: typeof createInvoiceController;

  constructor() {
    super();
    this.createInvoice = this.di.resolve(createInvoiceController.name);
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
