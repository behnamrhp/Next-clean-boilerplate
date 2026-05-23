import revenueChartController from "@/app/[lang]/dashboard/controller/revenue-chart.controller";
import { LANGS } from "@/bootstrap/i18n/i18n";
import { translateFailureMessage } from "@/feature/common/failures/translate-failure-message";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { isLeft } from "fp-ts/lib/Either";

type RevenueChartProps = {
  lang: LANGS;
};

export default async function RevenueChart({ lang }: RevenueChartProps) {
  const result = await revenueChartController();

  if (isLeft(result)) {
    const message = await translateFailureMessage(result.left, lang);
    return <p className="mt-4 text-red-500">{message}</p>;
  }

  const { chartHeight, revenue, topLabel, yAxisLabels } = result.right;

  if (!revenue || revenue.length === 0) {
    return <p className="mt-4 text-gray-400">No data available.</p>;
  }

  return (
    <div className="w-full md:col-span-4">
      <h2 className={` mb-4 text-xl md:text-2xl`}>Recent Revenue</h2>
      <div className="rounded-xl bg-gray-50 p-4">
        <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
          <div
            className="mb-6 hidden flex-col justify-between text-sm text-gray-400 sm:flex"
            style={{ height: `${chartHeight}px` }}
          >
            {yAxisLabels.map((label) => (
              <p key={label}>{label}</p>
            ))}
          </div>

          {revenue.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-2">
              <div
                className="w-full rounded-md bg-blue-300"
                style={{
                  height: `${(chartHeight / topLabel) * month.revenue}px`,
                }}
              />
              <p className="-rotate-90 text-sm text-gray-400 sm:rotate-0">
                {month.month}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Last 12 months</h3>
        </div>
      </div>
    </div>
  );
}
