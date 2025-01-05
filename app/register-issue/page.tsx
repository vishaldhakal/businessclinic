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
  FormDescription,
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
  Upload,
  Building2,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

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

const steps = [
  { id: 1, title: "Issue Details" },
  { id: 2, title: "Business Information" },
  { id: 3, title: "Contact Details" },
  { id: 4, title: "Review & Submit" },
];

export default function RegisterIssue() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = React.useState<IndustryCategory[]>([]);
  const [subCategories, setSubCategories] = React.useState<
    IndustrySubCategory[]
  >([]);
  const [selectedCategory, setSelectedCategory] = React.useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

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
      implementation_level: "Implementation Level",
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
      share_contact_details: false,
      forward_to_authority: false,
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

        // Create FormData instance to handle file upload
        const formData = new FormData();

        // Add all the form fields to FormData
        Object.entries(values).forEach(([key, value]) => {
          if (key === "issue_image" && value instanceof File) {
            formData.append("issue_image", value);
          } else if (typeof value !== "undefined" && value !== null) {
            formData.append(key, value.toString());
          }
        });

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/`,
          {
            method: "POST",
            body: formData, // Send FormData instead of JSON
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

        // Redirect to thank you page with the tracking ID
        router.push(`/thank-you?id=${responseData.id}`);
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
    [isSubmitting, toast, router]
  );

  const nextStep = async () => {
    // Get the fields to validate based on current step
    const fieldsToValidate =
      {
        1: [
          "title",
          "description",
          "nature_of_issue",
          "industry_specific_or_common_issue",
          "policy_related_or_procedural_issue",
        ],
        2: [
          "industry_size",
          "nature_of_industry_category",
          "nature_of_industry_sub_category",
          "name_of_company",
          "member_of_CIM",
        ],
        3: [
          "contact_name",
          "contact_designation",
          "contact_number",
          "address_province",
          "address_district",
          "address_municipality",
          "address_ward",
          "address_street",
          "implementation_level",
          "share_contact_details",
          "forward_to_authority",
        ],
      }[currentStep] || [];

    const isStepValid = await form.trigger(fieldsToValidate as any);

    if (isStepValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    } else {
      // Show error toast if validation fails
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
    }
  };

  const previousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Issue Details Section */}
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

              {/* Add the file upload field here */}
              <FormField
                control={form.control}
                name="issue_image"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>
                      <div className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Attach Files
                      </div>
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input
                          type="file"
                          {...field}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            onChange(file);
                          }}
                          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                          accept="*/*"
                        />
                        {value && (
                          <span className="text-sm text-muted-foreground">
                            {typeof value === "object" && "name" in value
                              ? value.name
                              : ""}
                          </span>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Categorization Section */}
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
                      <FormLabel>Is this an industry specific issue?</FormLabel>
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
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            {/* Industry Information Section */}
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

            {/* Company Information Section */}
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
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            {/* Contact Information Section */}
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
                        <Input placeholder="Enter contact name" {...field} />
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
                        <Input placeholder="Enter contact number" {...field} />
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
                      <FormLabel>Alternate Contact Number (Optional)</FormLabel>
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

            {/* Address Information Section */}
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
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  Implementation Details
                </h2>
              </div>

              <FormField
                control={form.control}
                name="implementation_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Implementation Level</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select implementation level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Policy Level">
                          Policy Level
                        </SelectItem>
                        <SelectItem value="Implementation Level">
                          Implementation Level
                        </SelectItem>
                        <SelectItem value="Capacity Scale Up">
                          Capacity Scale Up
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Add new checkboxes at the bottom */}
              <div className="space-y-6 pt-4">
                <FormField
                  control={form.control}
                  name="share_contact_details"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Share Contact Details</FormLabel>
                        <FormDescription>
                          Allow sharing your contact details with concerned
                          authorities
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="forward_to_authority"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Forward to Authority</FormLabel>
                        <FormDescription>
                          Allow forwarding this issue to concerned authority for
                          resolution
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        );
      case 4:
        return <ReviewStep formData={form.getValues()} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center ${
                    currentStep >= step.id
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${
                      currentStep >= step.id
                        ? "bg-primary text-white"
                        : "bg-muted"
                    }
                  `}
                  >
                    {step.id}
                  </div>
                  <span className="ml-2 hidden sm:inline">{step.title}</span>
                  {step.id < steps.length && (
                    <div className="w-12 h-[2px] mx-2 bg-muted" />
                  )}
                </div>
              ))}
            </div>
            <Progress
              value={(currentStep / steps.length) * 100}
              className="h-2"
            />
          </div>

          <Card className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {renderStepContent()}

                <div className="flex justify-between mt-8">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={previousStep}
                    >
                      Previous
                    </Button>
                  )}

                  {currentStep < steps.length ? (
                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        nextStep();
                      }}
                      className="ml-auto"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="ml-auto"
                      disabled={isSubmitting}
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
                  )}
                </div>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
}

// Create a new ReviewStep component
function ReviewStep({ formData }: { formData: z.infer<typeof formSchema> }) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Review Your Information</h3>

      <div className="grid gap-6">
        <ReviewSection title="Issue Details">
          <ReviewItem label="Title" value={formData.title} />
          <ReviewItem label="Description" value={formData.description} />
          <ReviewItem
            label="Attached File"
            value={
              formData.issue_image instanceof File
                ? formData.issue_image.name
                : "No file attached"
            }
          />
          <ReviewItem
            label="Nature of Issue"
            value={formData.nature_of_issue}
          />
        </ReviewSection>

        <ReviewSection title="Industry Information">
          <ReviewItem label="Industry Size" value={formData.industry_size} />
          <ReviewItem label="Company Name" value={formData.name_of_company} />
          <ReviewItem
            label="Member of CIM"
            value={formData.member_of_CIM ? "Yes" : "No"}
          />
        </ReviewSection>

        <ReviewSection title="Contact Information">
          <ReviewItem label="Contact Name" value={formData.contact_name} />
          <ReviewItem
            label="Designation"
            value={formData.contact_designation}
          />
          <ReviewItem label="Contact Number" value={formData.contact_number} />
          <ReviewItem
            label="Email"
            value={formData.contact_email || "Not provided"}
          />
        </ReviewSection>

        <ReviewSection title="Address">
          <ReviewItem label="Province" value={formData.address_province} />
          <ReviewItem label="District" value={formData.address_district} />
          <ReviewItem
            label="Municipality"
            value={formData.address_municipality}
          />
          <ReviewItem label="Ward" value={formData.address_ward} />
          <ReviewItem label="Street" value={formData.address_street} />
        </ReviewSection>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h4 className="font-medium text-primary">{title}</h4>
      <div className="bg-muted/50 rounded-lg p-4 space-y-2">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
