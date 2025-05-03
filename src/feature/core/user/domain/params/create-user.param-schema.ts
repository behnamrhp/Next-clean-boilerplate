import langKey from "@/feature/common/lang-keys/common.lang-key";
import baseUserParamsSchema from "@/feature/core/user/domain/params/base-user-param-schema";
import { z } from "zod";

const createUserParamsSchema = z.object({
  ...baseUserParamsSchema.shape,
  password: z
    .string()
    .trim()
    .optional()
    .superRefine((val, ctx) => {
      if (val && val.length > 0) {
        if (val.length < 8) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: 8,
            type: "string",
            inclusive: true,
            message: langKey.global.passwordMinLength,
          });
        }
      }
    }),
});

export type CreateUserParams = z.infer<typeof createUserParamsSchema>;

export default createUserParamsSchema;
