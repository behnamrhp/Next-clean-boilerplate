import langKey from "@/feature/common/lang-keys/common.lang-key";
import Role from "@/feature/core/user/domain/entity/enum/role.enum";
import { z } from "zod";

const baseUserParamsSchema = z.object({
  username: z.string().min(1, langKey.global.required).trim(),
  displayName: z.string().optional(),
  role: z.nativeEnum(Role),
});

export type BaseUserParams = z.infer<typeof baseUserParamsSchema>;

export default baseUserParamsSchema;
