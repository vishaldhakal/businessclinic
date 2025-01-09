"use client";

import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl } from "@/components/ui/form";

import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ReviewStep } from "@/components/forms/issue-without-business-form/steps/two";
import { StepOne } from "@/components/forms/issue-without-business-form/steps/one";
import { YesNoSelect } from "@/components/forms/common/yes-no-select";
import { formSchema } from "@/schemas/issues-without-business";

YesNoSelect.displayName = "YesNoSelect";

const steps = [
  { id: 1, title: "Issue Details" },
  { id: 2, title: "Review & Submit" },
];

export default function RegisterIssue() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      nature_of_issue: "",
      industry_specific_or_common_issue: false,
      policy_related_or_procedural_issue: false,
    },
  });

  React.useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = React.useCallback(
    async (values: z.infer<typeof formSchema>) => {
      console.log("Form submitted with values:", values);
      if (isSubmitting) return;

      setIsSubmitting(true);
      try {
        toast({
          title: "Submitting...",
          description: "Please wait while we submit your issue.",
        });

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
            body: formData,
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
    const fieldsToValidate =
      {
        1: [
          "title",
          "description",
          "nature_of_issue",
          "industry_specific_or_common_issue",
          "policy_related_or_procedural_issue",
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
        return <StepOne form={form} />;
      case 2:
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
