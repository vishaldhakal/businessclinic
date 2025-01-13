"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";

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
import type { Issue } from "@/types";
import { IssueCharts } from "@/components/IssueCharts";
import IssueDetail from "@/components/ui/issueDetail";
import { useState } from "react";
import Image from "next/image";
import useSWR from "swr";

export default function AdminPage() {
  const router = useRouter();
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("");
  const [issueTypeFilter, setIssueTypeFilter] = React.useState<string>("");
  const [shareContactFilter, setShareContactFilter] =
    React.useState<string>("");
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

  const indexOfLastIssue = currentPage * rowsPerPage;
  const indexOfFirstIssue = indexOfLastIssue - rowsPerPage;
  const VissuesData = filteredIssues.slice(indexOfFirstIssue, indexOfLastIssue);
  const totalPages = Math.ceil(filteredIssues.length / rowsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Fetch categories using SWR
  const { data: categories, error: categoriesError } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/nature-of-industry-categories/`,
    fetcher
  );

  // Fetch issues using SWR
  const { data: issuesData, error: issuesError } = useSWR(
    () => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/`;
      const params = new URLSearchParams();

      if (statusFilter && statusFilter !== "all") {
        params.append("progress_status", statusFilter);
      }

      if (issueTypeFilter && issueTypeFilter !== "all") {
        params.append("nature_of_issue", issueTypeFilter);
      }

      if (shareContactFilter && shareContactFilter !== "all") {
        params.append("share_contact_details", shareContactFilter);
      }

      return params.toString() ? `${url}?${params.toString()}` : url;
    },
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  React.useEffect(() => {
    if (issuesData) {
      setIssues(issuesData.results);
      setIsLoading(false);
    }
  }, [issuesData]);

  // Fetch statistics using SWR
  const { data: statisticsData, error: statisticsError } = useSWR(
    () => {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/business_clinic/issues/statistics/`;
      const params = new URLSearchParams();

      if (statusFilter && statusFilter !== "all") {
        params.append("progress_status", statusFilter);
      }

      if (issueTypeFilter && issueTypeFilter !== "all") {
        params.append("nature_of_issue", issueTypeFilter);
      }

      return params.toString() ? `${url}?${params.toString()}` : url;
    },
    fetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
    }
  );

  // Handle loading and error states
  if (!categories || !issuesData || !statisticsData) {
    return <Loader2 className="h-8 w-8 animate-spin" />;
  }

  if (issuesError) {
    return <div>Error loading issues data: {issuesError.message}</div>;
  }

  if (statisticsError) {
    return <div>Error loading statistics data: {statisticsError.message}</div>;
  }

  return (
    <Container>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-4">Issue Management</h1>
          {statisticsData && <IssueCharts statistics={statisticsData} />}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Issue List</h2>

          {/* Issues Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="border rounded-lg px-0">
              <div className="flex flex-col md:flex-row md:space-x-5 px-5 py-5">
                <div className="flex w-full md:w-1/4 py-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                <div className="flex w-full md:w-1/5 py-2 px-5">
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
                <div className="flex w-full md:w-1/5 py-2 px-5">
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
                <div className="relative w-full md:w-1/2 mt-2">
                  <Search className="absolute left-3 top-3 h-4 w-4 mt-2 text-muted-foreground" />
                  <Input
                    placeholder="Search issues..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 h-16"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-100">
                    <TableRow>
                      <TableHead className="text-left">Title</TableHead>
                      <TableHead className="text-left">Issue Details</TableHead>
                      <TableHead className="text-left">Status</TableHead>
                      <TableHead className="text-left">Created At</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {VissuesData.length > 0 ? (
                      VissuesData.map((issue) => (
                        <TableRow key={issue.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 mr-5 mt-2"
                              />
                              <Image
                                src={
                                  issue.issue_image ||
                                  "/path/to/default/image.jpg"
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
                              <div className="text-sm">
                                {issue.nature_of_issue}
                              </div>
                              <div className="text-sm">
                                {issue.industry_size}
                              </div>
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No issues found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center mt-4 px-5 py-5">
                <div className="flex-grow" />
                <div className="flex items-center">
                  <span className="mr-2">Rows per page:</span>
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(Number(e.target.value))}
                    className="rounded p-1"
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
                      className="rounded px-2 py-1"
                    >
                      &lt; {/* Left arrow */}
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="rounded px-2 py-1"
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
    </Container>
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

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });
