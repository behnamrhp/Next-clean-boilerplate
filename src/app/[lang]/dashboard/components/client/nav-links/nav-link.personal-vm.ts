import HomeIcon from "@/app/components/icons/home";
import { usePathname } from "next/navigation";
import { useRef } from "react";

type LinkItem = {
  name: string;
  href: string;
  icon: (props: { className?: string }) => JSX.Element;
};

/**
 * Beside of reusable vm each View can have it's own personal vm to handle it's ownlogics.
 * Difference between personal vm and other vms which extends BaseVM, is that
 * personal vm directly will be called inside of view and instinctly connected to the view,
 *  so they come together always and there is no need to be connected with interface for reusable
 *  vms.
 */
export default function navLinkPersonalVM() {
  const pathname = usePathname();
  // Map of links to display in the side navigation.
  // Depending on the size of the application, this would be stored in a database.
  const links = useRef<LinkItem[]>([
    { name: "Home", href: "/dashboard", icon: HomeIcon },
  ]).current;
  return {
    links,
    isLinkActive: (link: LinkItem) => pathname.includes(link.href),
  };
}
