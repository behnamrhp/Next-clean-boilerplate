import fetchSummaryInfoUsecase from "@/feature/core/summary-info/domain/usecase/fetch-summary-info.usecase";
import { connection } from "next/server";

/**
 * Controllers are bridge between feature layer and application layer.
 * They decide, feature layer will be cached or not, where to run in client or server
 * Or connect multiple usecases and run them, handle their failure, hydrate and store data in
 *  client state managements.
 */
export default function fetchSummaryInfoController() {
  connection();
  return fetchSummaryInfoUsecase();
}
