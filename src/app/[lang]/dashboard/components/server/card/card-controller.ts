import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";

export default function cardController(props: {
  type: "invoices" | "customers" | "pending" | "collected";
}) {
  const { type } = props;
  const iconMap = {
    collected: BanknotesIcon,
    customers: UserGroupIcon,
    pending: ClockIcon,
    invoices: InboxIcon,
  };
  return {
    Icon: iconMap[type],
  };
}
