import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Statistics",
    },
  },
};

export const data = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Total Issues",
      data: [0, 10, 5, 25, 20, 35, 20, 30, 35, 45, 48, 50],
      borderColor: "rgba(54, 162, 235, 1)",
      backgroundColor: "rgba(54, 162, 235, 0.5)",
      tension: 0.3,
    },
    {
      label: "Industry Specific Issues",
      data: [0, 8, 15, 22, 5, 12, 10, 8, 20, 35, 45, 55],
      borderColor: "rgba(255, 99, 132, 1)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
      tension: 0.3,
    },
    {
      label: "Common Issues",
      data: [0, 6, 12, 18, 3, 8, 15, 10, 22, 30, 40, 50],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.5)",
      tension: 0.3,
    },
  ],
};

const LineChart = () => {
  return <Line options={options} data={data} />;
};

export default LineChart;
