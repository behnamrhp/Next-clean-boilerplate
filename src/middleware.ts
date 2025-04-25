import { stackMiddlewares } from "@/middlewares/stackHandler";
import { withLocale } from "@/middlewares/with-locale";

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next).*)"],
};

const middlewares = [withLocale];
export default stackMiddlewares(middlewares);
