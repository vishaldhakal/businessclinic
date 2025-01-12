"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import type { Issue, NatureOfIndustryCategory } from "@/types";
import { IssueCharts } from "@/components/IssueCharts";
import IssueDetail from "@/components/ui/issueDetail";
import { useState } from "react";
import Image from "next/image";

export default function AdminPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [industryFilter, setIndustryFilter] = React.useState<string>("all");
  const [issueTypeFilter, setIssueTypeFilter] = React.useState<string>("");
  const [categories, setCategories] = React.useState<
    NatureOfIndustryCategory[]
  >([]);
  const [specificOrCommonFilter, setSpecificOrCommonFilter] =
    React.useState<string>("all");
  const [policyOrProceduralFilter, setPolicyOrProceduralFilter] =
    React.useState<string>("all");
  const [implementationLevelFilter, setImplementationLevelFilter] =
    React.useState<string>("all");
  const [statistics, setStatistics] = React.useState<any>(null);
  const [shareContactFilter, setShareContactFilter] =
    React.useState<string>("");
  const [forwardAuthorityFilter, setForwardAuthorityFilter] =
    React.useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const filteredIssues = React.useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        searchTerm === "" ||
        (issue.title &&
          issue.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (issue.name_of_company &&
          issue.name_of_company
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      return matchesSearch;
    });
  }, [issues, searchTerm]);

  // Calculate the index of the last issue on the current page
  const indexOfLastIssue = currentPage * rowsPerPage;
  const indexOfFirstIssue = indexOfLastIssue - rowsPerPage;
  const currentIssues = filteredIssues.slice(
    indexOfFirstIssue,
    indexOfLastIssue
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Fetch categories
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

  // Fetch issues
  const fetchIssues = React.useCallback(async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/`;
      const params = new URLSearchParams();

      if (statusFilter && statusFilter !== "all") {
        params.append("progress_status", statusFilter);
      }
      if (industryFilter && industryFilter !== "all") {
        params.append("nature_of_industry_category", industryFilter);
      }
      if (issueTypeFilter && issueTypeFilter !== "all") {
        params.append("nature_of_issue", issueTypeFilter);
      }
      if (specificOrCommonFilter && specificOrCommonFilter !== "all") {
        params.append(
          "industry_specific_or_common_issue",
          specificOrCommonFilter
        );
      }
      if (policyOrProceduralFilter && policyOrProceduralFilter !== "all") {
        params.append(
          "policy_related_or_procedural_issue",
          policyOrProceduralFilter
        );
      }
      if (implementationLevelFilter && implementationLevelFilter !== "all") {
        params.append("implementation_level", implementationLevelFilter);
      }
      if (shareContactFilter && shareContactFilter !== "all") {
        params.append("share_contact_details", shareContactFilter);
      }
      if (forwardAuthorityFilter && forwardAuthorityFilter !== "all") {
        params.append("forward_to_authority", forwardAuthorityFilter);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch issues");
      const data = await response.json();
      setIssues(data.results);
    } catch (error) {
      console.error("Error fetching issues:", error);
      toast({
        title: "Error",
        description: "Failed to fetch issues. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [
    toast,
    statusFilter,
    industryFilter,
    issueTypeFilter,
    specificOrCommonFilter,
    policyOrProceduralFilter,
    implementationLevelFilter,
    shareContactFilter,
    forwardAuthorityFilter,
  ]);

  // Fetch statistics
  const fetchStatistics = React.useCallback(async () => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/statistics/`;
      const params = new URLSearchParams();

      if (statusFilter && statusFilter !== "all") {
        params.append("progress_status", statusFilter);
      }
      if (industryFilter && industryFilter !== "all") {
        params.append("nature_of_industry_category", industryFilter);
      }
      if (issueTypeFilter && issueTypeFilter !== "all") {
        params.append("nature_of_issue", issueTypeFilter);
      }
      if (specificOrCommonFilter && specificOrCommonFilter !== "all") {
        params.append(
          "industry_specific_or_common_issue",
          specificOrCommonFilter
        );
      }
      if (policyOrProceduralFilter && policyOrProceduralFilter !== "all") {
        params.append(
          "policy_related_or_procedural_issue",
          policyOrProceduralFilter
        );
      }
      if (implementationLevelFilter && implementationLevelFilter !== "all") {
        params.append(
          "implementation_level_policy_level_or_capacity_scale",
          implementationLevelFilter
        );
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch statistics");
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  }, [
    statusFilter,
    industryFilter,
    issueTypeFilter,
    specificOrCommonFilter,
    policyOrProceduralFilter,
    implementationLevelFilter,
  ]);

  React.useEffect(() => {
    fetchIssues();
    fetchStatistics();
  }, [fetchIssues, fetchStatistics]);

  return (
    <div className="container py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Issue Management</h1>

          {statistics && <IssueCharts statistics={statistics} />}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Issue List</h2>
          <IssueDetail />

          {/* Issues Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-lg px-0">
              {
                <div className="flex px-5 py-5">
                  <div className="flex w-1/5 py-2 ">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="h-16">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Issue Registered and Documented">
                          Registered
                        </SelectItem>
                        <SelectItem value="Issue Under Desk Study">
                          Under Study
                        </SelectItem>
                        <SelectItem value="Issue Forwarded to Concerned Department">
                          Forwarded
                        </SelectItem>
                        <SelectItem value="Issue Solved">Solved</SelectItem>
                        <SelectItem value="Issue Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-1/5 py-2 px-5">
                    <Select
                      value={shareContactFilter}
                      onValueChange={setShareContactFilter}
                    >
                      <SelectTrigger className="h-16">
                        <SelectValue placeholder="Select Contact Sharing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="true">Sharing Allowed</SelectItem>
                        <SelectItem value="false">Not Sharing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex w-1/5 py-2 px-5">
                    <Select
                      value={issueTypeFilter}
                      onValueChange={setIssueTypeFilter}
                    >
                      <SelectTrigger className="h-16">
                        <SelectValue placeholder="Select Issue Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Energy">Energy</SelectItem>
                        <SelectItem value="Human Resources – Labour">
                          HR & Labour
                        </SelectItem>
                        <SelectItem value="Tax & Revenue">
                          Tax & Revenue
                        </SelectItem>
                        <SelectItem value="Bank & Finance">
                          Bank & Finance
                        </SelectItem>
                        <SelectItem value="Export">Export</SelectItem>
                        <SelectItem value="Import Substitution & Domestic Product Promotion">
                          Import Substitution
                        </SelectItem>
                        <SelectItem value="Transport & Transit">
                          Transport & Transit
                        </SelectItem>
                        <SelectItem value="Local Government">
                          Local Government
                        </SelectItem>
                        <SelectItem value="Provincial Government">
                          Provincial Government
                        </SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="relative w-1/2 mt-2">
                    <Search className="absolute left-3 top-3 h-4 w-4 mt-2 text-muted-foreground" />
                    <Input
                      placeholder="Search issues..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 h-16"
                    />
                  </div>
                </div>
              }
              <Table>
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Issue Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentIssues.map((issue) => (
                    <TableRow key={issue.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 mr-5 mt-2"
                          />
                          <Image
                            src={
                              issue.issue_image || "/path/to/default/image.jpg"
                            }
                            alt={`${issue.title} avatar`}
                            className="w-10 h-10 rounded-full mr-2"
                            width={40}
                            height={40}
                          />
                          {issue.title}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">{issue.nature_of_issue}</div>
                          <div className="text-sm">{issue.industry_size}</div>
                          <div className="text-sm text-muted-foreground">
                            {issue.address_municipality},{" "}
                            {issue.address_district}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <StatusBadge status={issue.progress_status} />
                      </TableCell>
                      <TableCell>
                        {new Date(issue.created_at!).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            router.push(`/admin/${issue.id}`);
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <hr className="my-4 border-t border-gray-300" />
              <div className="flex justify-between items-center mt-4 px-5 py-5">
                <div className="flex-grow" />
                <div className="flex items-center">
                  <span className="mr-2">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className=" rounded p-1"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                  </select>
                </div>
                <div className="flex items-center ml-4">
                  <span>
                    {indexOfFirstIssue + 1}–
                    {Math.min(indexOfLastIssue, filteredIssues.length)} of{" "}
                    {filteredIssues.length}
                  </span>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className=" rounded px-2 py-1"
                    >
                      &lt; {/* Left arrow */}
                    </button>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className=" rounded px-2 py-1"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Issue Registered and Documented":
        return "bg-blue-100 text-blue-800";
      case "Issue Under Desk Study":
        return "bg-yellow-100 text-yellow-800";
      case "Issue Forwarded to Concerned Department":
        return "bg-purple-100 text-purple-800";
      case "Issue Solved":
        return "bg-green-100 text-green-800";
      case "Issue Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status.replace("Issue ", "")}
    </span>
  );
}
