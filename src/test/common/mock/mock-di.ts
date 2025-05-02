import di from "@/bootstrap/di/init-di";
import * as serverDi from "@/feature/common/features.di";

/**
 * To mock and get server di
 */
export default function mockDi() {
  vi.spyOn(serverDi, "default").mockReturnValue(di);
  return di;
}
