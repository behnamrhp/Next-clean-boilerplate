import "server-only";
import { sql } from "@/bootstrap/boundaries/db/db";
import ApiTask from "@/feature/common/data/api-task";
import { failureOr } from "@/feature/common/failures/failure-helpers";
import NetworkFailure from "@/feature/common/failures/network.failure";
import Revenue from "@/feature/core/revenue/domain/entity/revenue.entity";
import RevenueRepo from "@/feature/core/revenue/domain/i-repo/revenue.i-repo";
import { pipe } from "fp-ts/lib/function";
import { tryCatch } from "fp-ts/lib/TaskEither";
import postgres from "postgres";

export type RevenueDbResponse = {
  month: string;
  revenue: number;
};

export default class RevenueDbRepo implements RevenueRepo {
  fetchRevenues(): ApiTask<Revenue[]> {
    return pipe(
      tryCatch(
        async () => {
          // Artificially delay a response for demo purposes.
          // Don't do this in production :)
          await new Promise((resolve) => setTimeout(resolve, 3000));

          const data = (await sql`SELECT * FROM revenue`) as postgres.RowList<
            RevenueDbResponse[]
          >;

          return this.revenuesDto(data);
        },
        (l) => failureOr(l, new NetworkFailure(l)),
      ),
    );
  }

  private revenuesDto(dbResponse: RevenueDbResponse[]): Revenue[] {
    return dbResponse.map((dbRevenue) => this.revenueDto(dbRevenue));
  }

  private revenueDto(dbResponse: RevenueDbResponse): Revenue {
    return new Revenue({
      month: dbResponse.month,
      revenue: dbResponse.revenue,
    });
  }
}
