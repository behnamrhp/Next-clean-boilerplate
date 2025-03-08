import Revenue from "@/feature/core/revenue/domain/entity/revenue.entity";
import fetchRevenuesUsecase from "@/feature/core/revenue/domain/usecase/fetch-revenues.usecase";

/**
 * Controllers are bridge between feature layer and application layer.
 * They decide, feature layer will be cached or not, where to run in client or server
 * Or connect multiple usecases and run them, handle their failure, hydrate and store data in
 *  client state managements.
 */
export default async function revenueChartController() {
  const revenue = await fetchRevenuesUsecase();
  const chartHeight = 350;

  const { yAxisLabels, topLabel } = generateYAxis(revenue);

  return {
    revenue,
    chartHeight,
    yAxisLabels,
    topLabel,
  };
}

function generateYAxis(revenue: Revenue[]) {
  // Calculate what labels we need to display on the y-axis
  // based on highest record and in 1000s
  const yAxisLabels = [];
  const highestRecord = Math.max(...revenue.map((month) => month.revenue));
  const topLabel = Math.ceil(highestRecord / 1000) * 1000;

  for (let i = topLabel; i >= 0; i -= 1000) {
    yAxisLabels.push(`$${i / 1000}K`);
  }

  return { yAxisLabels, topLabel };
}
