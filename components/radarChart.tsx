import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
} from "recharts";

interface RadarChartProps {
  data: { subject: string; A: number; B: number }[];
}

const RadarChartComponent: React.FC<RadarChartProps> = ({ data }) => {
  return (
    <div className="flex justify-center items-center h-full">
      <RadarChart outerRadius={100} width={400} height={400} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 100]} />
        <Radar
          name="Total Issued"
          dataKey="A"
          stroke="rgba(54, 162, 235, 1)"
          fill="rgba(54, 162, 235, 0.5)"
        />
        <Radar
          name="Total Returned"
          dataKey="B"
          stroke="rgba(255, 99, 132, 1)"
          fill="rgba(255, 99, 132, 0.5)"
        />
        <Tooltip />
        <Legend />
      </RadarChart>
    </div>
  );
};

export default RadarChartComponent;
