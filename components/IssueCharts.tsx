import React from "react";
import {
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RadarChartComponent from "@/components/radarChart";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
];

interface ChartData {
  name: string;
  value: number;
}

interface IssueStatistics {
  status_distribution: { progress_status: string; count: number }[];
  industry_distribution: {
    nature_of_industry_category__name: string;
    count: number;
  }[];
  issue_type_distribution: { nature_of_issue: string; count: number }[];
  specificity_distribution: {
    industry_specific_or_common_issue: boolean;
    count: number;
  }[];
  policy_distribution: {
    policy_related_or_procedural_issue: boolean;
    count: number;
  }[];
  implementation_level_distribution: {
    implementation_level: string;
    count: number;
  }[];
  total_issues: number;
}

interface IssueChartsProps {
  statistics: IssueStatistics;
}

export function IssueCharts({ statistics }: IssueChartsProps) {
  // Transform data for charts
  const statusData = statistics.status_distribution.map((item) => ({
    name: item.progress_status.replace("Issue ", ""),
    value: item.count,
  }));

  const industryData = statistics.industry_distribution.map((item) => ({
    name: item.nature_of_industry_category__name,
    value: item.count,
  }));

  const issueTypeData = statistics.issue_type_distribution.map((item) => ({
    name: item.nature_of_issue,
    value: item.count,
  }));

  const implementationLevelData =
    statistics.implementation_level_distribution.map((item) => ({
      name: item.implementation_level,
      value: item.count,
    }));

  // Prepare data for the radar chart
  const radarData = statistics.issue_type_distribution.map((item) => ({
    subject: item.nature_of_issue,
    A: item.count,
    B: statistics.total_issues - item.count,
  }));

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} Issues`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* {industryData.length > 0 && ( */}

        <Card>
          <CardHeader>
            <CardTitle>Updated Industry Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData}>
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Issues" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-8 rounded-lg border border-gray-200 bg-white transition-transform transform ">
        <CardHeader className="py-6 px-8 bg-gray-100 rounded-t-lg">
          <CardTitle className="text-xl font-semibold text-gray-800">
            Issue Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid gap-4">
            {/* Total Issues */}
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <span className="text-gray-600 font-medium text-base">
                Total Issues:
              </span>
              <span className="text-gray-900 font-bold text-lg">
                {statistics.total_issues}
              </span>
            </div>

            {/* Industry Specific Issues */}
            <div className="flex justify-between items-center border-b border-gray-300 pb-4">
              <span className="text-gray-600 font-medium text-base">
                Industry Specific Issues:
              </span>
              <span className="text-gray-900 font-bold text-lg">
                {statistics.specificity_distribution.find(
                  (item) => item.industry_specific_or_common_issue
                )?.count || 0}
              </span>
            </div>

            {/* Policy Related Issues */}
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium text-base">
                Policy Related Issues:
              </span>
              <span className="text-gray-900 font-bold text-lg">
                {statistics.policy_distribution.find(
                  (item) => item.policy_related_or_procedural_issue
                )?.count || 0}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
