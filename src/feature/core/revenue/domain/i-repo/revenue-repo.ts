import Revenue from "@/feature/core/revenue/domain/entity/revenue";

export default interface RevenueRepo {
    fetchRevenues(): Promise<Revenue[]>
}

export const revenueRepoKey = "revenueRepoKey"