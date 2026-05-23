import { getServerTranslation, LANGS } from "@/bootstrap/i18n/i18n";
import BaseFailure from "@/feature/common/failures/base.failure";

export async function translateFailureMessage(
  failure: BaseFailure<unknown>,
  lng: LANGS,
): Promise<string> {
  const { t } = await getServerTranslation(lng, failure.namespace);
  return t(failure.message);
}
