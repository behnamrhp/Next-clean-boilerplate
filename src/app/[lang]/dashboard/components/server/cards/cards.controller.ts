import fetchSummaryInfoUsecase from "@/feature/core/summary-info/domain/usecase/fetch-summary-info.usecase";
import { connection } from "next/server";

/**
 * Controllers are bridge between feature layer and application layer.
 */
export default function cardsController() {
  connection();
  return fetchSummaryInfoUsecase();
}
