"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Tags,
  Building,
  Briefcase,
  UserCircle,
  MapPin,
  Loader2,
} from "lucide-react";

type IndustryCategory = {
  id: number;
  name: string;
};

type IndustrySubCategory = {
  id: number;
  name: string;
  category: number;
};

const formSchema = z.object({
  // Issue Details
  title: z.string().min(2, "Title is required").max(255),
  description: z.string().min(10, "Description must be at least 10 characters"),
  issue_image: z.any().optional(),

  // Categorization
  nature_of_issue: z.string().min(1, "Please select nature of issue"),
  industry_specific_or_common_issue: z.boolean(),
  policy_related_or_procedural_issue: z.boolean(),
  implementation_level_policy_level_or_capacity_scale: z.boolean(),

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
});

const industryTypes = [
  "Energy",
  "Human Resources – Labour",
  "Tax & Revenue",
  "Bank & Finance",
  "Export",
  "Import Substitution & Domestic Product Promotion",
  "Transport & Transit",
  "Local Government",
  "Provincial Government",
  "Other",
];

const industrySizes = [
  "Startup",
  "Micro",
  "Cottage",
  "Small",
  "Medium",
  "Large",
];

const YesNoSelect = React.forwardRef<
  HTMLSelectElement,
  { value: boolean; onChange: (value: boolean) => void }
>(({ value, onChange }, ref) => (
  <Select
    onValueChange={(v) => onChange(v === "true")}
    value={value.toString()}
  >
    <FormControl>
      <SelectTrigger ref={ref as React.Ref<HTMLButtonElement>}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
    </FormControl>
    <SelectContent>
      <SelectItem value="true">Yes</SelectItem>
      <SelectItem value="false">No</SelectItem>
    </SelectContent>
  </Select>
));
YesNoSelect.displayName = "YesNoSelect";

export default function RegisterIssue() {
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<IndustryCategory[]>([]);
  const [subCategories, setSubCategories] = React.useState<
    IndustrySubCategory[]
  >([]);
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch categories on component mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/nature-of-industry-categories/`
        );
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.results);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  React.useEffect(() => {
    const fetchSubCategories = async () => {
      if (!selectedCategory) {
        setSubCategories([]);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/nature-of-industry-subcategories/?category=${selectedCategory}`
        );
        if (!response.ok) throw new Error("Failed to fetch subcategories");
        const data = await response.json();
        setSubCategories(data.results);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
        setSubCategories([]);
      }
    };

    fetchSubCategories();
  }, [selectedCategory]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      nature_of_issue: "",
      industry_specific_or_common_issue: false,
      policy_related_or_procedural_issue: false,
      implementation_level_policy_level_or_capacity_scale: false,
      industry_size: "",
      nature_of_industry_category: "",
      nature_of_industry_sub_category: "",
      name_of_company: "",
      member_of_CIM: false,
      address_province: "",
      address_district: "",
      address_municipality: "",
      address_ward: "",
      address_street: "",
      contact_name: "",
      contact_designation: "",
      contact_number: "",
      contact_alternate_number: "",
      contact_email: "",
    },
  });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const handleSubmitClick = async () => {
    const isValid = await form.trigger();
    console.log("Form validation result:", isValid);
    console.log("Form errors:", form.formState.errors);
  };

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      console.log("Form submitted with values:", values);
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        // Show loading toast
        toast({
          title: "Submitting...",
          description: "Please wait while we submit your issue.",
        });

        // Format the data according to the API requirements
        const formData = {
          title: values.title,
          description: values.description,
          nature_of_issue: values.nature_of_issue,
          industry_specific_or_common_issue:
            values.industry_specific_or_common_issue,
          policy_related_or_procedural_issue:
            values.policy_related_or_procedural_issue,
          implementation_level_policy_level_or_capacity_scale:
            values.implementation_level_policy_level_or_capacity_scale,
          industry_size: values.industry_size,
          nature_of_industry_category: parseInt(
            values.nature_of_industry_category
          ),
          nature_of_industry_sub_category: parseInt(
            values.nature_of_industry_sub_category
          ),
          name_of_company: values.name_of_company,
          member_of_CIM: values.member_of_CIM,
          address_province: values.address_province,
          address_district: values.address_district,
          address_municipality: values.address_municipality,
          address_ward: values.address_ward,
          address_street: values.address_street,
          contact_name: values.contact_name,
          contact_designation: values.contact_designation,
          contact_number: values.contact_number,
          contact_alternate_number: values.contact_alternate_number || null,
          contact_email: values.contact_email || null,
          issue_image: null, // Handle file upload separately if needed
        };

        console.log("Submitting data:", formData); // For debugging

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          console.error("API Error Response:", responseData); // For debugging
          throw new Error(
            responseData.detail ||
              Object.entries(responseData)
                .map(([key, value]) => `${key}: ${value}`)
                .join(", ")
          );
        }

        // Show success toast
        toast({
          title: "Success!",
          description: "Your issue has been successfully registered.",
          variant: "default",
        });

        // Reset form and state
        form.reset();
        setSelectedCategory(null);
        setSubCategories([]);
      } catch (error) {
        console.error("Submission error:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to submit issue",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [isSubmitting, toast]
  );

  return (
    <>
      <Header />
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Register Issue
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Please fill out the form below to register your business issue
            </p>
          </div>
          <div className="rounded-lg border bg-card p-8">
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  console.log("Form submit event triggered");
                  form.handleSubmit(onSubmit)(e);
                }}
                className="space-y-8"
                noValidate
              >
                {/* Issue Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xl font-semibold">
                    <FileText className="h-5 w-5 text-primary" />
                    <h2>Issue Details</h2>
                  </div>
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issue Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter issue title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your issue in detail"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Categorization */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xl font-semibold">
                    <Tags className="h-5 w-5 text-primary" />
                    <h2>Issue Categorization</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nature_of_issue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nature of Issue</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select issue type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industryTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="industry_specific_or_common_issue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Is this an industry specific issue?
                          </FormLabel>
                          <FormControl>
                            <YesNoSelect {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="policy_related_or_procedural_issue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Is this a policy related issue?</FormLabel>
                          <FormControl>
                            <YesNoSelect {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="implementation_level_policy_level_or_capacity_scale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Is this an implementation level issue?
                          </FormLabel>
                          <FormControl>
                            <YesNoSelect {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Industry Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xl font-semibold">
                    <Building className="h-5 w-5 text-primary" />
                    <h2>Industry Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="industry_size"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry Size</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industrySizes.map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Industry Category field */}
                    <FormField
                      control={form.control}
                      name="nature_of_industry_category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry Category</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedCategory(Number(value));
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Industry Sub-Category field */}
                    <FormField
                      control={form.control}
                      name="nature_of_industry_sub_category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry Sub-Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={!selectedCategory}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry sub-category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {subCategories.map((subCategory) => (
                                <SelectItem
                                  key={subCategory.id}
                                  value={subCategory.id.toString()}
                                >
                                  {subCategory.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xl font-semibold">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h2>Address Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="address_province"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Province</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address_district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="address_municipality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Municipality</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Company Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xl font-semibold">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <h2>Company Information</h2>
                  </div>
                  <FormField
                    control={form.control}
                    name="name_of_company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="member_of_CIM"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Are you a member of CIM?</FormLabel>
                        <FormControl>
                          <YesNoSelect {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-xl font-semibold">
                    <UserCircle className="h-5 w-5 text-primary" />
                    <h2>Contact Information</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contact_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter contact name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contact_designation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter designation" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Add Contact Number */}
                    <FormField
                      control={form.control}
                      name="contact_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter contact number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Add Alternate Contact Number */}
                    <FormField
                      control={form.control}
                      name="contact_alternate_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Alternate Contact Number (Optional)
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter alternate contact number"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Add Email */}
                    <FormField
                      control={form.control}
                      name="contact_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter email address"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Add Address Ward and Street */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="address_ward"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ward</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter ward number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address_street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter street address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg"
                  disabled={isSubmitting}
                  onClick={handleSubmitClick}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Submitting...</span>
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Submit Issue"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
