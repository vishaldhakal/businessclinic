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
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hero } from "@/components/Hero";

const COLORS = [
  "#4f46e5", // indigo-600
  "#0891b2", // cyan-600
  "#ca8a04", // yellow-600
  "#16a34a", // green-600
  "#9333ea", // purple-600
  "#e11d48", // rose-600
];

interface IssueStatistics {
  status_distribution: { progress_status: string; count: number }[];
  industry_distribution: {
    nature_of_industry_category__name: string;
    count: number;
  }[];
  issue_type_distribution: { nature_of_issue: string; count: number }[];
  implementation_level_distribution: {
    implementation_level: string;
    count: number;
  }[];
  total_issues: number;
}

interface DashboardChartsProps {
  statistics: IssueStatistics;
  className?: string;
}

export function DashboardCharts({
  statistics,
  className,
}: DashboardChartsProps) {
  // Transform data for charts
  const statusData = statistics.status_distribution.map((item) => ({
    name: item.progress_status.replace("Issue ", ""),
    value: item.count,
  }));

  const industryData = statistics.industry_distribution
    .map((item) => ({
      name: item.nature_of_industry_category__name,
      value: item.count,
    }))
    .sort((a, b) => b.value - a.value) // Sort by count descending
    .slice(0, 5); // Take top 5

  const issueTypeData = statistics.issue_type_distribution
    .map((item) => ({
      name: item.nature_of_issue,
      value: item.count,
    }))
    .sort((a, b) => b.value - a.value);

  const implementationLevelData =
    statistics.implementation_level_distribution.map((item) => ({
      name: item.implementation_level,
      value: item.count,
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Count: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate open issues
  const openIssues = statusData
    .filter((item) => !item.name.includes("Solved"))
    .reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className={`grid gap-4 md:grid-cols-2 ${className}`}>
      {/* Status Distribution */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  label={(entry) => entry.name}
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="stroke-background hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Industry Distribution */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Top Industries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryData} layout="vertical">
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="value"
                  fill={COLORS[0]}
                  radius={[0, 4, 4, 0]}
                  className="hover:opacity-80"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Level Distribution */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Implementation Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={implementationLevelData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  label={(entry) => entry.name}
                >
                  {implementationLevelData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      className="stroke-background hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Issues</p>
              <p className="text-2xl font-bold">{statistics.total_issues}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Open Issues</p>
              <p className="text-2xl font-bold">
                {statusData
                  .filter((item) => !item.name.includes("Solved"))
                  .reduce((acc, curr) => acc + curr.value, 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Hero totalIssues={statistics.total_issues} openIssues={openIssues} />
    </div>
  );
}
