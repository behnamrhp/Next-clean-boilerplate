import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";

/**
 * Controllers are bridge between feature layer and application layer.
 * They decide, feature layer will be cached or not, where to run in client or server
 * Or connect multiple usecases and run them, handle their failure, hydrate and store data in
 *  client state managements.
 */
export default function getCardIcon(props: {
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
