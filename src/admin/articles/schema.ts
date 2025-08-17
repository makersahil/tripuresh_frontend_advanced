import { z } from "zod";

export const ArticleSchema = z.object({
  id: z.string().optional(),              // comes from backend on edit
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required"),
  summary: z.string().optional().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  publishedAt: z.string().optional(),     // ISO date string or empty
  externalUrl: z.string().url().optional().or(z.literal("")),
});

export type ArticleInput = z.infer<typeof ArticleSchema>;
export type Article = ArticleInput & { id: string };
