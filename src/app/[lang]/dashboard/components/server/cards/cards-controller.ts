import fetchSummaryInfoUsecase from "@/feature/core/summary-info/domain/usecase/fetch-summary-info-usecase";
import { connection } from "next/server";

export default function cardsController() {
  connection();
  return fetchSummaryInfoUsecase();
}
