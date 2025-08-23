

import { Line } from "react-chartjs-2";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ trends }) => {
  console.log("Trends data:", trends);

  // ✅ Use any dataset (all have same dates after backend normalization)
  const labels = trends?.applications?.map((t) => t.date) || [];

  const data = {
    labels,
    datasets: [
      {
        label: "Applications",
        data: trends?.applications?.map((t) => t.count) || [],
        borderColor: "#4f46e5", // indigo-600
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.3, // smooth lines
        fill: true,
      },
      {
        label: "Users",
        data: trends?.users?.map((t) => t.count) || [],
        borderColor: "#14b8a6", // teal-500
        backgroundColor: "rgba(20, 184, 166, 0.2)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Jobs",
        data: trends?.jobs?.map((t) => t.count) || [],
        borderColor: "#6b7280", // gray-500
        backgroundColor: "rgba(107, 114, 128, 0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Activity Trends" },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <Line data={data} options={options} />
    </div>
  );
};

export default Chart;
