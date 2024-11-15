import { DocumentIcon } from "@/app/components/icons/document";
import HomeIcon from "@/app/components/icons/home";
import { UserIcon } from "@/app/components/icons/user";
import { usePathname } from "next/navigation";

type LinkItem = {
  name: string;
  href: string;
  icon: (props: { className?: string }) => JSX.Element;
};
export default function navLinkPersonalVM() {
  const pathname = usePathname();
  // Map of links to display in the side navigation.
  // Depending on the size of the application, this would be stored in a database.
  const links: LinkItem[] = [
    { name: "Home", href: "/dashboard", icon: HomeIcon },
    {
      name: "Invoices",
      href: "/dashboard/invoices",
      icon: DocumentIcon,
    },
    { name: "Customers", href: "/dashboard/customers", icon: UserIcon },
  ];
  return {
    links,
    isLinkActive: (link: LinkItem) => pathname === link.href,
  };
}
