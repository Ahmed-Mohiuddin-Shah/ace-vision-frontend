"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Upload() {
  const router = useRouter();
  const [video, setVideo] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);

  const handleUpload = async () => {
    if (!video) return;

    const formData = new FormData();
    formData.append("file", video);

    const res = await fetch("http://localhost:8000/upload-video", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      // start polling backend for progress
      const p = 0;
      const interval = setInterval(async () => {
        const progressRes = await fetch("http://localhost:8000/progress");
        const { value } = await progressRes.json();
        setProgress(value);
        if (value >= 100) {
          clearInterval(interval);
          router.push("/results");
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
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
}
