"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  formSchema,
  IssueWithBusinessSchema,
} from "@/schemas/issues-with-business";
import { Form } from "@/components/ui/form";
import { StepOne } from "@/components/forms/issue-with-business-form/steps/one";
import { StepTwo } from "@/components/forms/issue-with-business-form/steps/two";
import { StepThree } from "@/components/forms/issue-with-business-form/steps/three";
import { IndustryCategory, IndustrySubCategory } from "@/types";
import { Progress } from "@radix-ui/react-progress";
import { Loader2 } from "lucide-react";
import { ReviewStep } from "@/components/forms/issue-with-business-form/steps/four";

const steps = [
  { id: 1, title: "Issue Details" },
  { id: 2, title: "Business Information" },
  { id: 3, title: "Contact Details" },
  { id: 4, title: "Review & Submit" },
];

export default function RegisterIssue() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState<IndustryCategory[]>([]);
  const [subCategories, setSubCategories] = useState<IndustrySubCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const form = useForm<IssueWithBusinessSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      issue_image: null,
      description: "",
      nature_of_issue: "",
      industry_specific_or_common_issue: false,
      policy_related_or_procedural_issue: false,
      implementation_level: "Implementation Level",
      industry_size: "",

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

  const onSubmit = async (values: IssueWithBusinessSchema) => {
    console.log("Form submitted with values:", values);
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      toast({
        title: "Submitting...",
        description: "Please wait while we submit your issue.",
      });

      const formData = new FormData();
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
          body: formData,
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        console.error("API Error Response:", responseData);
        throw new Error(
          responseData.detail ||
            Object.entries(responseData)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")
        );
      }

      toast({
        title: "Success!",
        description: "Your issue has been successfully registered.",
        variant: "default",
      });

      form.reset();
      setSelectedCategory(null);
      setSubCategories([]);
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
  };

  const nextStep = async () => {
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
        return <StepOne form={form} />;
      case 2:
        return (
          <StepTwo
            form={form}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            subCategories={subCategories}
          />
        );
      case 3:
        return <StepThree form={form} />;
      case 4:
        return <ReviewStep formData={form.getValues()} />;
      default:
        return null;
    }
  };

  return (
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? "bg-primary text-white"
                      : "bg-muted"
                  }`}
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
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-8">
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
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
