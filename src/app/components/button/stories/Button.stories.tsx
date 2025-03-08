import CreateRandomInvoiceButtonVM from "@/app/[lang]/dashboard/vm/create-random-invoice-button-vm";
import Button from "@/app/components/button/button";
import { DiContext, useDI } from "@/bootstrap/di/di-context";
import mockedModuleDi from "@/bootstrap/di/mocked-module-di";
import Story from "@/bootstrap/helpers/view/storybook-base-template-type";
import getArgVM from "@/bootstrap/helpers/view/storybook-with-arg-vm";
import { createInvoiceUsecaseKey } from "@/feature/core/invoice/domain/usecase/create-invoice/create-invoice.usecase";
import type { Meta } from "@storybook/react";
import { useRef } from "react";

const meta: Meta = {
  title: "general/Button",
};

export default meta;

export const Primary: Story = {
  argTypes: {
    "vm.props.isDisable": {
      control: "boolean",
    },
    "vm.props.title": {
      control: "text",
    },
  },
  args: {
    "vm.props.title": "Button",
    "vm.props.isDisable": false,
  },
  render: (_props, globalData) => {
    const vm = getArgVM(globalData.parsedProps.vm); // You can use parsed props to access your vm properties.
    return <Button vm={vm} memoizedByVM={false} />;
  },
};

export const WithVM: Story = {
  decorators: [
    (Story) => {
      const di = useRef(
        mockedModuleDi([
          {
            token: CreateRandomInvoiceButtonVM,
            provider: CreateRandomInvoiceButtonVM,
          },
          {
            token: createInvoiceUsecaseKey,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
            provider: (args: any) => console.log("clicked", args),
          },
        ]),
      );
      return (
        <DiContext.Provider value={di.current}>
          <Story di={di.current} />
        </DiContext.Provider>
      );
    },
  ],
  render: () => {
    function Child() {
      const di = useDI();
      const vm = useRef(di.resolve(CreateRandomInvoiceButtonVM));
      return <Button vm={vm.current} memoizedByVM={false} />;
    }
    return <Child />;
  },
};
