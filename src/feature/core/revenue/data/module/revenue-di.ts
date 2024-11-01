import di from "@/bootstrap/di/init-di"
import RevenueDbRepo from "@/feature/core/revenue/data/repo/revenue-db-repo"
import { revenueRepoKey } from "@/feature/core/revenue/domain/i-repo/revenue-repo"

export default function getRevenueDi() {
    const revenueDi = di.createChildContainer()

    revenueDi.register(revenueRepoKey, RevenueDbRepo)
    return revenueDi
}