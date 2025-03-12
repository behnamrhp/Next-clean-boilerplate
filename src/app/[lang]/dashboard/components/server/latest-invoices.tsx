import latestInvoicesController from "@/app/[lang]/dashboard/controller/latest-invoices.controller";
import CreateRandomInvoiceButtonVM from "@/app/[lang]/dashboard/vm/create-random-invoice-button-vm";
import Button from "@/app/components/button/button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { isLeft } from "fp-ts/lib/Either";
import Image from "next/image";

export default async function LatestInvoices() {
  const latestInvoices = await latestInvoicesController();

  if (isLeft(latestInvoices)) return <div>Error</div>;

  const invoices = latestInvoices.right.map((invoice, i) => (
    <div
      key={invoice.id}
      className={clsx("flex flex-row items-center justify-between py-4", {
        "border-t": i !== 0,
      })}
    >
      <div className="flex items-center">
        <Image
          src={invoice.customerImageUrl}
          alt={`${invoice.customerName}'s profile picture`}
          className="mr-4 rounded-full"
          width={32}
          height={32}
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold md:text-base">
            {invoice.customerName}
          </p>
          <p className="hidden text-sm text-gray-500 sm:block">
            {invoice.customerEmail}
          </p>
        </div>
      </div>
      <p className="truncate text-sm font-medium md:text-base">
        {invoice.invoicesAmount}
      </p>
    </div>
  ));

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className="mb-4 text-xl md:text-2xl">Latest Invoices</h2>
      <div className="flex grow flex-col max-h-[66.5vh] justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6 h-full overflow-y-auto">{invoices}</div>
        <div className="flex items-end mt-auto pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
        <Button vmKey={CreateRandomInvoiceButtonVM} />
      </div>
    </div>
  );
}
