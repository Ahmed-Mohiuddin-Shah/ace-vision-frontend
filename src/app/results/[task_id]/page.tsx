import { getAPIURL } from "@/constants";
import Image from "next/image";

export default function TaskResultsPage({
  params,
}: {
  params: { task_id: string };
}) {
  const { task_id } = params;

  const results = [
    {
      path: `${getAPIURL()}/results/FINAL_heatmap_${task_id}.png`,
      label: "Player Heatmap",
    },
    {
      path: `${getAPIURL()}/results/minimap_heatmap_${task_id}.png`,
      label: "Minimap Heatmap",
    },
    {
      path: `${getAPIURL()}/results/baseline_movement_${task_id}.png`,
      label: "Baseline Movement",
    },
    {
      path: `${getAPIURL()}/results/ball_speed_${task_id}.jpg`,
      label: "Ball Speed",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Analysis Results</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((r, idx) => (
          <div key={idx} className="border p-2 rounded shadow-sm">
            <h2 className="text-lg font-semibold mb-2">{r.label}</h2>
            <Image
              src={r.path}
              alt={r.label}
              width={400}
              height={300}
              className="rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
