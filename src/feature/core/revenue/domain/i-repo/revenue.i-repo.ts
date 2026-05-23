import ApiTask from "@/feature/common/data/api-task";
import Revenue from "@/feature/core/revenue/domain/entity/revenue.entity";

export default interface RevenueRepo {
  fetchRevenues(): ApiTask<Revenue[]>;
}

export const revenueRepoKey = "revenueRepoKey";
