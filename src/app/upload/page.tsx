"use client";

import { getAPIURL } from "@/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Upload() {
  const router = useRouter();
  const [video, setVideo] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>("");

  const handleUpload = async () => {
    if (!video) return;

    const formData = new FormData();
    formData.append("file", video);

    const res = await fetch(`${getAPIURL()}/upload-video`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      // start polling backend for progress

      // @app.get("/progress/{task_id}")
      // def get_progress(task_id: str):
      // return progress_store.get(task_id, {"progress": 0, "status": "unknown"})
      // GET THE task_id from the response
      const { task_id } = await res.json();
      const interval = setInterval(async () => {
        const progressRes = await fetch(`${getAPIURL()}/progress/${task_id}`);
        if (!progressRes.ok) return;
        const { progress, status } = await progressRes.json();
        setProgress(progress);
        setStatus(status);
        if (progress >= 100) {
          clearInterval(interval);
          //wait a bit for the results to be ready
          setTimeout(() => {
            router.push("/results");
          }, 2000);
        }
      }, 1000);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow rounded-2xl text-center">
      <h1 className="text-2xl font-bold mb-4">Upload Your Video</h1>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files?.[0] || null)}
      />
      <button
        onClick={handleUpload}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
      >
        Process Video
      </button>

      {video && (
        <div className="mt-4">
          <video
            src={URL.createObjectURL(video)}
            controls
            className="w-full rounded-lg"
          />
        </div>
      )}

      {/* Progress bar */}

      {progress > 0 && (
        <div className="mt-4 w-full bg-gray-200 rounded-full">
          <div
            className="bg-green-600 text-xs font-bold text-center text-white p-1 rounded-full"
            style={{ width: `${progress}%` }}
          >
            {progress}% - {status}
          </div>
        </div>
      )}
    </div>
  );
}
