import { z } from "zod";
export const formSchema = z.object({
  // Issue Details
  title: z.string().min(2, "Title is required").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  issue_image: z.any().optional(),

  nature_of_issue: z.string().min(1, "Please select nature of issue"),
  industry_specific_or_common_issue: z.boolean(),
  policy_related_or_procedural_issue: z.boolean(),

});

export type IssueWithoutBusinessSchema = z.infer<typeof formSchema>;