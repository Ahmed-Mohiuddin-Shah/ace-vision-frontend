"use client";
import { getAPIURL } from "@/constants";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";

type ResultItem = {
  progress: number;
  status: string;
  eta?: string | null;
  result_file?: string | null;
};
type Results = Record<string, ResultItem>;

const ResultsPage: React.FC = () => {
  const [results, setResults] = useState<Results>({});
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all results
  const fetchResults = async () => {
    try {
      const res = await fetch(`${getAPIURL()}/results`);
      if (!res.ok) throw new Error("Failed to fetch results");
      const data: Results = await res.json();
      setResults(data);
    } catch (error) {
      console.error(error);
      setResults({});
    } finally {
      setLoading(false);
    }
  };

  // Poll unfinished tasks
  useEffect(() => {
    fetchResults();
  }, []);

  useEffect(() => {
    // Find unfinished tasks
    const unfinished = Object.entries(results).filter(
      ([, v]) => v.status !== "completed" && v.progress !== -1
    );
    if (unfinished.length === 0) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    // Poll every 2s
    intervalRef.current = setInterval(async () => {
      for (const [taskId] of unfinished) {
        try {
          const res = await fetch(`${getAPIURL()}/progress/${taskId}`);
          if (!res.ok) continue;
          const progressData = await res.json();
          setResults((prev) => ({
            ...prev,
            [taskId]: {
              ...prev[taskId],
              ...progressData,
            },
          }));
        } catch {}
      }
      // Also refresh the main results to catch completed tasks
      fetchResults();
    }, 2000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-xl">
        Loading...
      </div>
    );

  return (
    <div className="p-8">
      <h1 className="font-bold text-3xl mb-8">Results</h1>
      {Object.keys(results).length === 0 ? (
        <p>No results found.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {Object.entries(results).map(([taskId, result]) => (
            <div
              key={taskId}
              className="w-64 bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200 flex flex-col items-center p-4"
            >
              <div className="font-semibold mb-2">Task ID: {taskId}</div>
              {result.status === "completed" ? (
                <Link
                  href={`/results/${taskId}`}
                  className="w-full flex flex-col items-center"
                >
                  {result.result_file ? (
                    <img
                      src={`${getAPIURL()}/${result.result_file}`}
                      alt={`Heatmap for ${taskId}`}
                      className="max-w-full max-h-32 mt-2 rounded"
                    />
                  ) : (
                    <span className="text-gray-500 text-sm mt-2">
                      No heatmap available.
                    </span>
                  )}
                  <span className="mt-3 px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                    Completed
                  </span>
                </Link>
              ) : (
                <div className="w-full flex flex-col items-center">
                  <div className="w-full h-3 bg-gray-200 rounded-full mt-2">
                    <div
                      className={`h-3 ${
                        result.progress === -1 ? "bg-red-500" : "bg-blue-500"
                      } rounded-full transition-all`}
                      style={{ width: `${result.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between w-full mt-2 text-sm">
                    <span className="text-blue-700 font-medium">
                      {result.status}
                    </span>
                    <span className="text-gray-600">{result.progress}%</span>
                  </div>
                  {result.eta !== null &&
                    result.eta !== undefined &&
                    result.progress !== -1 && (
                      <div className="text-gray-500 text-xs mt-1">
                        ETA: {
                          // ETA is in ISO format
                          new Date(result.eta).toLocaleString()
                        }
                      </div>
                    )}
                  {result.progress === -1 && (
                    <div className="text-red-500 text-xs mt-1">
                      Task failed.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
