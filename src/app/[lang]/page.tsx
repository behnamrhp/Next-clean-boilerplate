import langKey from "@/feature/common/lang-keys/common.lang-key";
import { getServerTranslation, LANGS } from "@/bootstrap/i18n/i18n";
import Link from "next/link";

export default async function Home(props: {
  params: Promise<{ lang: LANGS }>;
}) {
  const { params } = props;
  const { lang } = await params;
  const { t } = await getServerTranslation(lang);
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <div />
          <p className="text-xl text-gray-800 md:text-3xl md:leading-normal">
            <strong>Welcome to Acme.</strong> This is the example for the ,
            brought to you by Vercel.
          </p>
          <Link
            className="flex rounded-md border-2 bg-primary-foreground p-3 ml-auto mr-auto "
            href="dashboard"
          >
            {t(langKey.global.dashboard)}
          </Link>
        </div>
      </div>
    </main>
  );
}
