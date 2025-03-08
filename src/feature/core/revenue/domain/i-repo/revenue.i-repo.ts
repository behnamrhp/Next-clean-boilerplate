import Revenue from "@/feature/core/revenue/domain/entity/revenue.entity";

export default interface RevenueRepo {
  fetchRevenues(): Promise<Revenue[]>;
}

export const revenueRepoKey = "revenueRepoKey";
