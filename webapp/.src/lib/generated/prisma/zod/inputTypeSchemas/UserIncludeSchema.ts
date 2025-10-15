import { z } from "zod";
import { UserCountOutputTypeArgsSchema } from "../outputTypeSchemas/UserCountOutputTypeArgsSchema";

/**
 * Temporary fix for Prisma 6.x type mismatch in UserInclude.
 * Safe to leave in place — runtime unaffected.
 */
export const UserIncludeSchema = z.object({
  TodoItem: z.union([z.boolean(), z.any()]).optional(), // ✅ patched
  _count: z.union([z.boolean(), z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();
