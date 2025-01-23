"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Activity as ActivityIcon,
  History as HistoryIcon,
  RefreshCcw as RefreshCcwIcon,
  Tag as TagIcon,
  Scale as ScaleIcon,
  Layers as LayersIcon,
  Folder as FolderIcon,
  FolderTree as FolderTreeIcon,
  Circle as CircleIcon,
  ChevronLeft,
  Eye as EyeIcon,
  Image as ImageIcon,
} from "lucide-react";
import type { Issue } from "@/types";
import ConfirmationModal from "@/components/ConfirmationModal";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface UpdateFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  onUpdate: () => void;
  isSubmitting: boolean;
  isCommentField?: boolean;
  dependentField?: {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  };
}

function UpdateField({
  label,
  value,
  options,
  onChange,
  onUpdate,
  isSubmitting,
  isCommentField = false,
  dependentField,
}: UpdateFieldProps) {
  const [comment, setComment] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div className="space-y-2 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <Label className="text-sm font-extrabold text-blue-800">{label}</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {dependentField && (
            <>
              <Label>{dependentField.label}</Label>
              <Select
                value={dependentField.value}
                onValueChange={dependentField.onChange}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={`Select ${dependentField.label.toLowerCase()}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  {dependentField.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}

          <Textarea
            placeholder="Add a comment about this change..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Button
            className="w-full"
            onClick={() => {
              onUpdate();
              setIsEditing(false);
              setComment("");
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Updating..." : `Update ${label}`}
          </Button>
        </div>
      ) : (
        <p className="text-sm font-medium">
          {options.find((opt) => opt.value === value)?.label || value}
          {dependentField && dependentField.value && (
            <span className="text-muted-foreground">
              {" "}
              →{" "}
              {dependentField.options.find(
                (opt) => opt.value === dependentField.value
              )?.label || dependentField.value}
            </span>
          )}
        </p>
      )}
    </div>
  );
}

export default function IssueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [issue, setIssue] = React.useState<Issue | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [newStatus, setNewStatus] = React.useState<string>("");
  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [implementationLevel, setImplementationLevel] =
    React.useState<string>("");
  const [industrySize, setIndustrySize] = React.useState<string>("");
  const [natureOfIssue, setNatureOfIssue] = React.useState<string>("");
  const [industryCategory, setIndustryCategory] = React.useState<string>("");
  const [industrySubCategory, setIndustrySubCategory] =
    React.useState<string>("");
  const [categories, setCategories] = React.useState<any[]>([]);
  const [subCategories, setSubCategories] = React.useState<any[]>([]);
  const [isIndustrySpecific, setIsIndustrySpecific] =
    React.useState<boolean>(false);
  const [isPolicyRelated, setIsPolicyRelated] = React.useState<boolean>(false);

  // Fetch issue details
  const fetchIssue = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/${params.id}/`
      );
      if (!response.ok) throw new Error("Failed to fetch issue");
      const data = await response.json();
      setIssue(data);
      setNewStatus(data.progress_status);
      setImplementationLevel(data.implementation_level);
      setIndustrySize(data.industry_size);
      setNatureOfIssue(data.nature_of_issue);
      setIsIndustrySpecific(data.industry_specific_or_common_issue);
      setIsPolicyRelated(data.policy_related_or_procedural_issue);
      if (data.nature_of_industry_category_detail) {
        setIndustryCategory(
          data.nature_of_industry_category_detail.id.toString()
        );
      }

      if (data.nature_of_industry_sub_category_detail) {
        setIndustrySubCategory(
          data.nature_of_industry_sub_category_detail.id.toString()
        );

        // Also fetch subcategories for the current category
        const subCategoriesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/nature-of-industry-subcategories/?category=${data.nature_of_industry_category_detail.id}`
        );
        if (subCategoriesResponse.ok) {
          const subCategoriesData = await subCategoriesResponse.json();
          setSubCategories(subCategoriesData.results);
        }
      }
    } catch (error) {
      console.error("Error fetching issue:", error);
      toast({
        title: "Error",
        description: "Failed to fetch issue details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Call fetchIssue in useEffect
  React.useEffect(() => {
    fetchIssue();
  }, [params.id, toast]);

  // Add fetch for categories
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
    if (industryCategory) {
      const fetchSubCategories = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/nature-of-industry-subcategories/?category=${industryCategory}`
          );
          if (!response.ok) throw new Error("Failed to fetch subcategories");
          const data = await response.json();
          setSubCategories(data.results);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
        }
      };
      fetchSubCategories();
    }
  }, [industryCategory]);

  const handleUpdateField = async (
    field: string,
    value: string,
    comment: string,
    additionalData?: Record<string, any>
  ) => {
    if (!issue) return;

    setIsSubmitting(true);
    try {
      const updateData = {
        [field]: value,
        comment: comment,
        ...additionalData,
      };

      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/${issue.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update issue");

      // Fetch the updated issue details
      await fetchIssue(); // Call the fetchIssue function to refresh the data

      // Log the action in the activity history with the correct action type
      logActivity(field, value, comment); // Log the activity

      toast({
        title: "Success",
        description: `${field} updated successfully`,
      });

      router.refresh(); // Refresh the router to reflect changes
    } catch (error) {
      console.error("Error updating issue:", error);
      toast({
        title: "Error",
        description: `Failed to update ${field}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update the logActivity function to include new cases
  const logActivity = (field: string, value: string, comment: string) => {
    let actionType = "";

    switch (field) {
      case "progress_status":
        actionType = "status_change";
        break;
      case "nature_of_issue":
        actionType = "nature_of_issue_change";
        break;
      case "industry_size":
        actionType = "industry_size_change";
        break;
      case "implementation_level":
        actionType = "implementation_level_change";
        break;
      case "nature_of_industry_category":
        actionType = "industry_category_change";
        break;
      case "industry_specific_or_common_issue":
        actionType = "industry_specific_change"; // New case for industry specific
        break;
      case "policy_related_or_procedural_issue":
        actionType = "policy_related_change"; // New case for policy related
        break;
      // Add more cases as needed
      default:
        actionType = "unknown_change";
    }

    // Log the activity
    console.log(
      `Activity logged: ${actionType} - ${field} changed to ${value} with comment: ${comment}`
    );
  };

  const handleDeleteIssue = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!issue) return;

    try {
      const deleteResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/${issue.id}/`,
        {
          method: "DELETE",
        }
      );

      if (!deleteResponse.ok) throw new Error("Failed to delete issue");

      toast({
        title: "Success",
        description: "Issue deleted successfully",
      });

      router.push("/admin");
    } catch (error) {
      console.error("Error deleting issue:", error);
      toast({
        title: "Error",
        description: "Failed to delete issue",
        variant: "destructive",
      });
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleEditIssue = () => {
    if (!issue) return;
    router.push(`/admin/edit/${issue.id}`);
  };

  const handleImageClick = (imageUrl: string) => {
    // Logic to preview the image, e.g., open a modal or a new window
    window.open(imageUrl, "_blank"); // Opens the image in a new tab
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!issue) {
    return <div>Issue not found</div>;
  }

  return (
    <div className="container py-10">
      <Button asChild variant="ghost" className="mb-6">
        <Link href="/admin">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to All Issues
        </Link>
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Issue Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <CardTitle className="text-2xl">{issue?.title}</CardTitle>
                  <ImageIcon
                    className="ml-2 h-5 w-5 cursor-pointer"
                    onClick={() => handleImageClick(issue.issue_image)}
                    aria-label="Preview image"
                  />
                </div>
                <StatusBadge status={issue?.progress_status || ""} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <div className="space-y-4">
                <div
                  className="text-sm text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: issue?.description || "" }}
                />
              </div>

              <div className="grid gap-6 mt-6">
                {/* Issue & Company Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Issue Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">
                      Issue Information
                    </h3>
                    <div className="space-y-3">
                      {issue?.nature_of_issue && (
                        <InfoItem
                          label="Nature of Issue"
                          value={issue.nature_of_issue}
                        />
                      )}
                      {issue?.industry_size && (
                        <InfoItem
                          label="Industry Size"
                          value={issue.industry_size}
                        />
                      )}
                      {issue?.nature_of_industry_category?.name && (
                        <InfoItem
                          label="Industry Category"
                          value={issue.nature_of_industry_category.name}
                        />
                      )}
                      {issue?.nature_of_industry_sub_category?.name && (
                        <InfoItem
                          label="Industry Sub-Category"
                          value={issue.nature_of_industry_sub_category.name}
                        />
                      )}
                      {issue?.implementation_level && (
                        <InfoItem
                          label="Implementation Level"
                          value={issue.implementation_level}
                        />
                      )}
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">
                      Company Details
                    </h3>
                    <div className="space-y-3">
                      {issue?.name_of_company && (
                        <InfoItem
                          label="Company Name"
                          value={issue.name_of_company}
                        />
                      )}
                      {issue?.member_of_CIM !== undefined && (
                        <InfoItem
                          label="CIM Member"
                          value={issue.member_of_CIM ? "Yes" : "No"}
                        />
                      )}
                      {issue?.industry_specific_or_common_issue !==
                        undefined && (
                        <InfoItem
                          label="Industry Specific"
                          value={
                            issue.industry_specific_or_common_issue
                              ? "Yes"
                              : "No"
                          }
                        />
                      )}
                      {issue?.policy_related_or_procedural_issue !==
                        undefined && (
                        <InfoItem
                          label="Policy Related"
                          value={
                            issue.policy_related_or_procedural_issue
                              ? "Yes"
                              : "No"
                          }
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact & Address Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">
                      Contact Information
                    </h3>
                    <div className="space-y-3">
                      {issue?.contact_name && (
                        <InfoItem
                          label="Contact Name"
                          value={issue.contact_name}
                        />
                      )}
                      {issue?.contact_designation && (
                        <InfoItem
                          label="Designation"
                          value={issue.contact_designation}
                        />
                      )}
                      {issue?.contact_number && (
                        <InfoItem
                          label="Contact Number"
                          value={issue.contact_number}
                        />
                      )}
                      {issue?.contact_alternate_number && (
                        <InfoItem
                          label="Alternate Number"
                          value={issue.contact_alternate_number}
                        />
                      )}
                      {issue?.contact_email && (
                        <InfoItem label="Email" value={issue.contact_email} />
                      )}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">
                      Address Information
                    </h3>
                    <div className="space-y-3">
                      {issue?.address_province && (
                        <InfoItem
                          label="Province"
                          value={issue.address_province}
                        />
                      )}
                      {issue?.address_district && (
                        <InfoItem
                          label="District"
                          value={issue.address_district}
                        />
                      )}
                      {issue?.address_municipality && (
                        <InfoItem
                          label="Municipality"
                          value={issue.address_municipality}
                        />
                      )}
                      {issue?.address_ward && (
                        <InfoItem label="Ward" value={issue.address_ward} />
                      )}
                      {issue?.address_street && (
                        <InfoItem label="Street" value={issue.address_street} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Sharing Preferences */}
                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">
                    Sharing Preferences
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {issue?.share_contact_details !== undefined && (
                      <InfoItem
                        label="Share Contact Details"
                        value={issue.share_contact_details ? "Yes" : "No"}
                      />
                    )}
                    {issue?.forward_to_authority !== undefined && (
                      <InfoItem
                        label="Forward to Authority"
                        value={issue.forward_to_authority ? "Yes" : "No"}
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add new management card */}
          <Card className="mt-6 shadow-lg border border-gray-200 rounded-lg">
            <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Issue Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-6">
              <UpdateField
                label="Status"
                value={newStatus}
                options={PROGRESS_STATUS_CHOICES.map((status) => ({
                  value: status,
                  label: status.replace("Issue ", ""),
                }))}
                onChange={setNewStatus}
                onUpdate={() =>
                  handleUpdateField("progress_status", newStatus, comment)
                }
                isSubmitting={isSubmitting}
              />

              <UpdateField
                label="Nature of Issue"
                value={natureOfIssue}
                options={NATURE_OF_ISSUE_CHOICES.map((issue) => ({
                  value: issue,
                  label: issue,
                }))}
                onChange={setNatureOfIssue}
                onUpdate={() =>
                  handleUpdateField("nature_of_issue", natureOfIssue, comment)
                }
                isSubmitting={isSubmitting}
              />

              <UpdateField
                label="Industry Size"
                value={industrySize}
                options={INDUSTRY_SIZE_CHOICES.map((size) => ({
                  value: size,
                  label: size,
                }))}
                onChange={setIndustrySize}
                onUpdate={() =>
                  handleUpdateField("industry_size", industrySize, comment)
                }
                isSubmitting={isSubmitting}
              />

              <UpdateField
                label="Implementation Level"
                value={implementationLevel}
                options={IMPLEMENTATION_LEVEL_CHOICES.map((level) => ({
                  value: level,
                  label: level,
                }))}
                onChange={setImplementationLevel}
                onUpdate={() =>
                  handleUpdateField(
                    "implementation_level",
                    implementationLevel,
                    comment
                  )
                }
                isSubmitting={isSubmitting}
              />

              <UpdateField
                label="Industry Category"
                value={industryCategory}
                options={categories.map((cat) => ({
                  value: cat.id.toString(),
                  label: cat.name,
                }))}
                onChange={(value) => {
                  setIndustryCategory(value);
                  // Reset subcategory when category changes
                  setIndustrySubCategory("");
                }}
                onUpdate={() =>
                  handleUpdateField(
                    "nature_of_industry_category",
                    industryCategory,
                    comment,
                    {
                      nature_of_industry_sub_category: industrySubCategory,
                    }
                  )
                }
                isSubmitting={isSubmitting}
                dependentField={{
                  label: "Industry Sub Category",
                  value: industrySubCategory,
                  options: subCategories.map((subCat) => ({
                    value: subCat.id.toString(),
                    label: subCat.name,
                  })),
                  onChange: setIndustrySubCategory,
                }}
              />

              <UpdateField
                label="Industry Specific"
                value={isIndustrySpecific ? "true" : "false"}
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                onChange={(value) => {
                  setIsIndustrySpecific(value === "true");
                }}
                onUpdate={() =>
                  handleUpdateField(
                    "industry_specific_or_common_issue",
                    isIndustrySpecific ? "true" : "false",
                    comment
                  )
                }
                isSubmitting={isSubmitting}
              />

              <UpdateField
                label="Policy Related"
                value={isPolicyRelated ? "true" : "false"}
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
                onChange={(value) => {
                  setIsPolicyRelated(value === "true");
                }}
                onUpdate={() =>
                  handleUpdateField(
                    "policy_related_or_procedural_issue",
                    isPolicyRelated ? "true" : "false",
                    comment
                  )
                }
                isSubmitting={isSubmitting}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions */}
        <div className="md:col-span-1">
          <div
            className="space-y-6 sticky"
            style={{
              top: "calc(4rem + 24px)",
              maxHeight: "calc(100vh - 6rem)",
              overflowY: "auto",
            }}
          >
            {/* Activity History Card */}
            <Card className=" shadow-lg border border-gray-200 rounded-lg">
              <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
                <CardTitle className="text-2xl font-semibold text-gray-800">
                  Activity History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="max-h-96 overflow-y-auto space-y-4">
                  {issue?.actions?.map((action) => (
                    <div
                      key={action.id}
                      className="relative pl-8 pb-6 last:pb-0"
                    >
                      {/* Timeline connector */}
                      <div className="absolute left-3 top-0 bottom-0 w-px bg-muted" />

                      {/* Timeline dot */}
                      <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full border-2 border-muted bg-background flex items-center justify-center">
                        {getActionIcon(action.action_type)}
                      </div>

                      <div className="space-y-1">
                        <p className="font-medium text-sm">
                          {getActionDescription(action)}
                        </p>
                        {action.comment && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded-md mt-2">
                            {action.comment}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {action.created_by_name ? (
                            <span className="font-medium text-primary">
                              {action.created_by_name}
                            </span>
                          ) : (
                            "System"
                          )}{" "}
                          • {new Date(action.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!issue?.actions || issue.actions.length === 0) && (
                    <div className="text-center py-6">
                      <HistoryIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground">
                        No activity recorded yet.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Delete button */}
            <div className="mb-4">
              <Button
                onClick={handleDeleteIssue}
                variant="destructive"
                className="w-full"
              >
                Delete Issue
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}

// Helper component for displaying info items
function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

// Constants
const PROGRESS_STATUS_CHOICES = [
  "Issue Registered and Documented",
  "Issue Under Desk Study",
  "Issue Forwarded to Concerned Department",
  "Issue Solved",
  "Issue Rejected",
];

const IMPLEMENTATION_LEVEL_CHOICES = [
  "Policy Level",
  "Implementation Level",
  "Capacity Scale Up",
];

const INDUSTRY_SIZE_CHOICES = [
  "Startup",
  "Micro",
  "Cottage",
  "Small",
  "Medium",
  "Large",
];

const NATURE_OF_ISSUE_CHOICES = [
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

function getActionDescription(action: any) {
  switch (action.action_type) {
    case "progress_status_change":
      return `Status changed from "${action.old_value}" to "${action.new_value}"`;
    case "nature_of_issue_change":
      return `Nature of Issue changed from "${action.old_value}" to "${action.new_value}"`;
    case "industry_size_change":
      return `Industry Size changed from "${action.old_value}" to "${action.new_value}"`;
    case "implementation_level_change":
      return `Implementation Level changed from "${action.old_value}" to "${action.new_value}"`;
    case "industry_category_change":
      return `Industry Category changed from "${action.old_value}" to "${action.new_value}"`;
    case "industry_subcategory_change":
      return `Industry Sub-Category changed from "${action.old_value}" to "${action.new_value}"`;
    case "industry_specific_or_common_issue_change":
      return `Industry Specific status changed from "${action.old_value}" to "${action.new_value}"`;
    case "policy_related_or_procedural_issue_change":
      return `Policy Related status changed from "${action.old_value}" to "${action.new_value}"`;
    default:
      return action.action_type;
  }
}

function getActionIcon(actionType: string) {
  switch (actionType) {
    case "status_change":
      return <RefreshCcwIcon className="h-3 w-3 text-blue-500" />;
    case "nature_of_issue_change":
      return <TagIcon className="h-3 w-3 text-purple-500" />;
    case "industry_size_change":
      return <ScaleIcon className="h-3 w-3 text-orange-500" />;
    case "implementation_level_change":
      return <LayersIcon className="h-3 w-3 text-green-500" />;
    case "industry_category_change":
      return <FolderIcon className="h-3 w-3 text-yellow-500" />;
    case "industry_subcategory_change":
      return <FolderTreeIcon className="h-3 w-3 text-red-500" />;
    default:
      return <CircleIcon className="h-3 w-3 text-gray-500" />;
  }
}
