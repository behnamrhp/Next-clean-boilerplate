import baseUserParamsSchema from "@/feature/core/user/domain/params/base-user-param-schema";
import { z } from "zod";

const updateUserParamsSchema = z.object({
  id: z.string().trim(),
  ...baseUserParamsSchema.shape,
});

export type UpdateUserParams = z.infer<typeof updateUserParamsSchema>;

export default updateUserParamsSchema;
