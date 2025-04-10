import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Acquisition } from "../../../types";
import { StyledCard } from "./dashboard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Process data into bins
const binData = (data: { timestamp: number; ore_sites: number }[]) => {
  if (!data || data.length === 0) return { bins: [], labels: [] };

  // Find the min and max ore_sites values
  const oreSitesValues = data.map((entry) => entry.ore_sites);
  const minOreSites = Math.min(...oreSitesValues);
  const maxOreSites = Math.max(...oreSitesValues);

  // If all values are the same, we can just return one bin
  if (minOreSites === maxOreSites) {
    return {
      bins: [data.length],
      labels: [`${minOreSites}`],
    };
  }

  // Target 8–12 bins for readability
  const range = maxOreSites - minOreSites;
  const targetBinCount = Math.min(
    Math.max(Math.ceil(Math.sqrt(data.length)), 8),
    12,
  );
  const binWidth = Math.ceil(range / targetBinCount);

  // Adjust bin width to ensure even distribution
  const adjustedBinCount = Math.ceil(range / binWidth);
  const bins = Array(adjustedBinCount).fill(0);
  const labels: string[] = [];

  // Create bin labels and count items in each bin
  for (let i = 0; i < adjustedBinCount; i++) {
    const binStart = minOreSites + i * binWidth;
    const binEnd =
      i === adjustedBinCount - 1 ? maxOreSites : binStart + binWidth - 1;
    labels.push(binStart === binEnd ? `${binStart}` : `${binStart}–${binEnd}`);
  }

  // Bin the data
  data.forEach((entry) => {
    const oreSites = entry.ore_sites;
    const binIndex = Math.min(
      Math.floor((oreSites - minOreSites) / binWidth),
      adjustedBinCount - 1,
    );
    bins[binIndex]++;
  });

  return { bins, labels };
};

/**
 * Histogram component to display the distribution of ore sites in acquisitions.
 * @param {Acquisition[]} data - Array of acquisition data.
 */
const Histogram = ({ data }: { data: Acquisition[] }) => {
  const { bins, labels } = binData(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Number of Acquisitions",
        data: bins,
        backgroundColor: "#1668dc",
        borderColor: "#609cef",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: "Distribution of Ore Sites in Acquisitions",
      },
    },
    scales: {
      x: { title: { display: true, text: "Ore Sites Range" } },
      y: { title: { display: true, text: "Number of Acquisitions" } },
    },
  };

  return (
    <StyledCard title="Acquisitions Histogram">
      {bins.length > 0 ? (
        <Bar data={chartData} options={options} /> // TODO: fix chart size on mobile
      ) : (
        <p>No data available to display.</p>
      )}
    </StyledCard>
  );
};

export default Histogram;
