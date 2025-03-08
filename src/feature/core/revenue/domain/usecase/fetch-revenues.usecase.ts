import serverDi from "@/feature/common/server.di";
import Revenue from "@/feature/core/revenue/domain/entity/revenue.entity";
import RevenueRepo, {
  revenueRepoKey,
} from "@/feature/core/revenue/domain/i-repo/revenue.i-repo";
import { revenueModuleKey } from "@/feature/core/revenue/domain/revenue.module-key";

export default function fetchRevenuesUsecase(): Promise<Revenue[]> {
  const repo = serverDi(revenueModuleKey).resolve<RevenueRepo>(revenueRepoKey);
  return repo.fetchRevenues();
}
