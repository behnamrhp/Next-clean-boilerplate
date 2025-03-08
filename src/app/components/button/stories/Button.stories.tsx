import Button from "@/app/components/button/button";
import Story from "@/bootstrap/helpers/view/storybook-base-template-type";
import getArgVM from "@/bootstrap/helpers/view/storybook-with-arg-vm";
import type { Meta } from "@storybook/react";

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
