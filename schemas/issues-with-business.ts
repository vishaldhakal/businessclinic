import { z } from "zod";
export const formSchema = z.object({
  // Issue Details
  title: z.string().min(2, "Title is required").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  issue_image: z.any().optional(),

  // Categorization
  nature_of_issue: z.string().min(1, "Please select nature of issue"),
  

  // Industry Information
  industry_size: z.string().min(1, "Please select industry size"),
  nature_of_industry_category: z
    .string()
    .min(1, "Please select an industry category"),
  nature_of_industry_sub_category: z
    .string()
    .min(1, "Please select an industry sub-category"),

  // Company Information
  name_of_company: z.string().min(2, "Company name is required"),
  member_of_CIM: z.boolean(),

  // Address Information
  address_province: z.string().min(1, "Province is required"),
  address_district: z.string().min(1, "District is required"),
  address_municipality: z.string().min(1, "Municipality is required"),
  address_ward: z.string().min(1, "Ward is required"),
  address_street: z.string().min(1, "Street is required"),

  // Contact Information
  contact_name: z.string().min(1, "Contact name is required"),
  contact_designation: z.string().min(1, "Designation is required"),
  contact_number: z.string().min(1, "Contact number is required"),
  contact_alternate_number: z.string().optional(),
  contact_email: z.string().email("Invalid email address").optional(),

  implementation_level: z.enum([
    "Policy Level",
    "Implementation Level",
    "Capacity Scale Up",
  ]),
  share_contact_details: z.boolean(),
  forward_to_authority: z.boolean(),

  industry_specific_or_common_issue: z.boolean().optional(),
  policy_related_or_procedural_issue: z.boolean().optional(),
});

export type IssueWithBusinessSchema = z.infer<typeof formSchema>;