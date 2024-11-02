import fetchSummaryInfoUsecase from "@/feature/core/summary-info/domain/usecase/fetch-summary-info-usecase";

export default function cardsController() {
   return fetchSummaryInfoUsecase();
}