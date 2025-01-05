"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, Search } from "lucide-react";
import type { Issue } from "@/types";

export default function TrackIssuePage() {
  const { toast } = useToast();
  const [issueId, setIssueId] = React.useState("");
  const [issue, setIssue] = React.useState<Issue | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = async () => {
    if (!issueId.trim()) {
      toast({
        title: "Error",
        description: "Please enter an issue ID",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/${issueId}/`
      );
      if (!response.ok) throw new Error("Issue not found");
      const data = await response.json();
      setIssue(data);
    } catch (error) {
      console.error("Error fetching issue:", error);
      toast({
        title: "Error",
        description: "Failed to find issue with the provided ID",
        variant: "destructive",
      });
      setIssue(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Issue</h1>
          <p className="text-muted-foreground">
            Enter your issue ID to view its current status and details
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <Input
            placeholder="Enter Issue ID"
            value={issueId}
            onChange={(e) => setIssueId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Track Issue
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : issue ? (
          <Card>
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{issue.title}</CardTitle>
                  <CardDescription>
                    Created on{" "}
                    {new Date(issue.created_at!).toLocaleDateString()}
                  </CardDescription>
                </div>
                <StatusBadge status={issue.progress_status} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Description */}
              <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {issue.description}
                </p>
              </div>

              <div className="grid gap-6">
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
                        value={issue.nature_of_issue}
                      />
                      <InfoItem
                        label="Industry Size"
                        value={issue.industry_size}
                      />
                      <InfoItem
                        label="Industry Category"
                        value={issue.nature_of_industry_category?.name}
                      />
                      <InfoItem
                        label="Industry Sub-Category"
                        value={issue.nature_of_industry_sub_category?.name}
                      />
                      <InfoItem
                        label="Implementation Level"
                        value={issue.implementation_level}
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
                        value={issue.name_of_company}
                      />
                      <InfoItem
                        label="CIM Member"
                        value={issue.member_of_CIM ? "Yes" : "No"}
                      />
                      <InfoItem
                        label="Industry Specific"
                        value={
                          issue.industry_specific_or_common_issue ? "Yes" : "No"
                        }
                      />
                      <InfoItem
                        label="Policy Related"
                        value={
                          issue.policy_related_or_procedural_issue
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
                        value={issue.contact_name}
                      />
                      <InfoItem
                        label="Designation"
                        value={issue.contact_designation}
                      />
                      <InfoItem
                        label="Contact Number"
                        value={issue.contact_number}
                      />
                      <InfoItem
                        label="Alternate Number"
                        value={issue.contact_alternate_number || "Not provided"}
                      />
                      <InfoItem
                        label="Email"
                        value={issue.contact_email || "Not provided"}
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
                        value={issue.address_province}
                      />
                      <InfoItem
                        label="District"
                        value={issue.address_district}
                      />
                      <InfoItem
                        label="Municipality"
                        value={issue.address_municipality}
                      />
                      <InfoItem label="Ward" value={issue.address_ward} />
                      <InfoItem label="Street" value={issue.address_street} />
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="space-y-4">
                  <h3 className="font-semibold border-b pb-2">
                    Activity History
                  </h3>
                  <div className="space-y-4">
                    {issue.actions?.map((action) => (
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
                          on {new Date(action.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
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
