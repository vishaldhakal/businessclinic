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
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, ChevronLeft } from "lucide-react";
import type { Issue } from "@/types";

export default function IssueDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [issue, setIssue] = React.useState<Issue | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [newStatus, setNewStatus] = React.useState<string>("");
  const [comment, setComment] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch issue details
  React.useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/${params.id}/`
        );
        if (!response.ok) throw new Error("Failed to fetch issue");
        const data = await response.json();
        setIssue(data);
        setNewStatus(data.progress_status);
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

    fetchIssue();
  }, [params.id, toast]);

  const handleUpdateStatus = async () => {
    if (!issue || !newStatus) return;

    setIsSubmitting(true);
    try {
      // Update issue status
      const updateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/${issue.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            progress_status: newStatus,
          }),
        }
      );

      if (!updateResponse.ok) throw new Error("Failed to update status");

      // Add action
      const actionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/${issue.id}/actions/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action_type: "status_change",
            old_status: issue.progress_status,
            new_status: newStatus,
            comment: comment,
            issue: issue.id,
          }),
        }
      );

      if (!actionResponse.ok) throw new Error("Failed to add action");

      toast({
        title: "Success",
        description: "Issue status updated successfully",
      });

      // Refresh issue data
      const updatedIssue = await updateResponse.json();
      setIssue(updatedIssue);
      setComment("");
    } catch (error) {
      console.error("Error updating issue:", error);
      toast({
        title: "Error",
        description: "Failed to update issue status",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!issue) {
    return <div>Issue not found</div>;
  }

  return (
    <div className="container py-10">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/admin")}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to All Issues
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Issue Details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{issue?.title}</CardTitle>
                  <CardDescription>
                    Created on{" "}
                    {new Date(issue?.created_at!).toLocaleDateString()}
                  </CardDescription>
                </div>
                <StatusBadge status={issue?.progress_status || ""} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {issue?.description}
                </p>
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
                      <InfoItem
                        label="Nature of Issue"
                        value={issue?.nature_of_issue}
                      />
                      <InfoItem
                        label="Industry Size"
                        value={issue?.industry_size}
                      />
                      <InfoItem
                        label="Industry Category"
                        value={issue?.nature_of_industry_category?.name}
                      />
                      <InfoItem
                        label="Industry Sub-Category"
                        value={issue?.nature_of_industry_sub_category?.name}
                      />
                      <InfoItem
                        label="Implementation Level"
                        value={issue?.implementation_level}
                      />
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">
                      Company Details
                    </h3>
                    <div className="space-y-3">
                      <InfoItem
                        label="Company Name"
                        value={issue?.name_of_company}
                      />
                      <InfoItem
                        label="CIM Member"
                        value={issue?.member_of_CIM ? "Yes" : "No"}
                      />
                      <InfoItem
                        label="Industry Specific"
                        value={
                          issue?.industry_specific_or_common_issue
                            ? "Yes"
                            : "No"
                        }
                      />
                      <InfoItem
                        label="Policy Related"
                        value={
                          issue?.policy_related_or_procedural_issue
                            ? "Yes"
                            : "No"
                        }
                      />
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
                      <InfoItem
                        label="Contact Name"
                        value={issue?.contact_name}
                      />
                      <InfoItem
                        label="Designation"
                        value={issue?.contact_designation}
                      />
                      <InfoItem
                        label="Contact Number"
                        value={issue?.contact_number}
                      />
                      <InfoItem
                        label="Alternate Number"
                        value={
                          issue?.contact_alternate_number || "Not provided"
                        }
                      />
                      <InfoItem
                        label="Email"
                        value={issue?.contact_email || "Not provided"}
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold border-b pb-2">
                      Address Information
                    </h3>
                    <div className="space-y-3">
                      <InfoItem
                        label="Province"
                        value={issue?.address_province}
                      />
                      <InfoItem
                        label="District"
                        value={issue?.address_district}
                      />
                      <InfoItem
                        label="Municipality"
                        value={issue?.address_municipality}
                      />
                      <InfoItem label="Ward" value={issue?.address_ward} />
                      <InfoItem label="Street" value={issue?.address_street} />
                    </div>
                  </div>
                </div>

                {/* Sharing Preferences */}
                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">
                    Sharing Preferences
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <InfoItem
                      label="Share Contact Details"
                      value={issue?.share_contact_details ? "Yes" : "No"}
                    />
                    <InfoItem
                      label="Forward to Authority"
                      value={issue?.forward_to_authority ? "Yes" : "No"}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Actions */}
        <div className="md:col-span-1">
          <div
            className="space-y-6 sticky"
            style={{
              top: "calc(4rem + 24px)", // navbar height (4rem/64px) + padding
              maxHeight: "calc(100vh - 6rem)", // viewport height - (navbar + padding)
              overflowY: "auto",
            }}
          >
            {/* Status Update Card */}
            <Card>
              <CardHeader>
                <CardTitle>Update Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={newStatus || issue?.progress_status}
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRESS_STATUS_CHOICES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace("Issue ", "")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Textarea
                  placeholder="Add a comment (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                <Button
                  onClick={handleUpdateStatus}
                  disabled={
                    isSubmitting || newStatus === issue?.progress_status
                  }
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Status"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Activity History Card */}
            <Card>
              <CardHeader>
                <CardTitle>Activity History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {issue?.actions?.map((action) => (
                    <div
                      key={action.id}
                      className="text-sm border-l-2 border-muted pl-4 pb-4 last:pb-0"
                    >
                      <p className="font-medium">
                        {action.action_type === "status_change"
                          ? `Status changed from ${action.old_status?.replace(
                              "Issue ",
                              ""
                            )} to ${action.new_status?.replace("Issue ", "")}`
                          : action.action_type}
                      </p>
                      {action.comment && (
                        <p className="mt-1 text-muted-foreground">
                          {action.comment}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        by {action.created_by_name} on{" "}
                        {new Date(action.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
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
