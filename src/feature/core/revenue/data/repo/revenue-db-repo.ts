import { sql } from "@/bootstrap/db/db";
import Revenue from "@/feature/core/revenue/domain/entity/revenue";
import RevenueRepo from "@/feature/core/revenue/domain/i-repo/revenue-repo";
import { connection } from "next/server";
import postgres from "postgres";

export type RevenueDbResponse = {
  month: string;
  revenue: number;
};
export default class RevenueDbRepo implements RevenueRepo {
    async fetchRevenues(): Promise<Revenue[]> {
        try {
            // Artificially delay a response for demo purposes.
            // Don't do this in production :)
            await new Promise((resolve) => setTimeout(resolve, 3000));

            const data = await sql`SELECT * FROM revenue` as postgres.RowList<RevenueDbResponse[]>;

            console.log('Data fetch completed after 3 seconds.');

            return this.revenuesDto(data);
        } catch (error) {
            console.error('Database Error:', error);
            throw new Error('Failed to fetch revenue data.');
        }
    }


    private revenuesDto(dbResponse: RevenueDbResponse[]): Revenue[] {
        return dbResponse.map((dbRevenue) => this.revenueDto(dbRevenue))
    }
    
    private revenueDto(dbResponse: RevenueDbResponse): Revenue {
        return new Revenue({
            month: dbResponse.month,
            revenue: dbResponse.revenue
        })
    }
    
}