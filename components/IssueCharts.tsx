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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

      <Card>
        <CardHeader>
          <CardTitle>Updated Industry Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={industryData}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Issues" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Radar Chart of Issue Types</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <RadarChartComponent data={radarData} />
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle>Implementation Level Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={implementationLevelData}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82CA9D" name="Issues" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader>
          <CardTitle>Issue Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex justify-between">
              <span>Total Issues:</span>
              <span className="font-bold">{statistics.total_issues}</span>
            </div>
            <div className="flex justify-between">
              <span>Industry Specific Issues:</span>
              <span className="font-bold">
                {statistics.specificity_distribution.find(
                  (item) => item.industry_specific_or_common_issue
                )?.count || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Policy Related Issues:</span>
              <span className="font-bold">
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
