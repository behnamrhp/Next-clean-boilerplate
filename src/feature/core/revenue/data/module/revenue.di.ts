import RevenueDbRepo from "@/feature/core/revenue/data/repo/revenue-db.repo";
import { revenueRepoKey } from "@/feature/core/revenue/domain/i-repo/revenue.i-repo";
import { DependencyContainer } from "tsyringe";

export default function getRevenueDi(di: DependencyContainer) {
  di.register(revenueRepoKey, RevenueDbRepo);
  return di;
}
