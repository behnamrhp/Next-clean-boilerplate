import latestInvoicesController from '@/app/dashboard/components/server/latest-invoices/latest-invoices-controller';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Image from 'next/image';

export default async function LatestInvoices() {
  const latestInvoices = await latestInvoicesController();

  const invoices = latestInvoices.map((invoice, i) => {
            return (
              <div
                key={invoice.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
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
                <p
                  className="truncate text-sm font-medium md:text-base"
                >
                  {invoice.invoicesAmount}
                </p>
              </div>
            );
          })
  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className="mb-4 text-xl md:text-2xl">
        Latest Invoices
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">

        <div className="bg-white px-6">
          {invoices}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
