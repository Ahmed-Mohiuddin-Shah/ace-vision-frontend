"use client";

import { getAPIURL } from "@/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Upload() {
  const router = useRouter();
  const [video, setVideo] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUpload = async () => {
    if (!video) return;

    const formData = new FormData();
    formData.append("file", video);

    setIsUploading(true);
    setProgress(0);
    setStatus("Uploading...");

    const res = await fetch(`${getAPIURL()}/upload-video`, {
      method: "POST",
      body: formData,
    });

    setIsUploading(false);
    setProgress(100);
    setStatus("Processing...");

    if (res.ok) {
      setTimeout(() => {
        router.push(`/results`);
      }, 2000);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 shadow rounded-2xl text-center">
      {progress === 0 && !isUploading && (
        <>
          <h1 className="text-2xl font-bold mb-4">Upload Your Video</h1>
          {video && (
            <div className="mt-4 mb-2">
              <video
                src={URL.createObjectURL(video)}
                controls
                className="w-full rounded-lg"
              />
            </div>
          )}

          <input
            title="Choose Video"
            type="file"
            accept="video/*"
            onChange={(e) => setVideo(e.target.files?.[0] || null)}
            className="mb-2 w-full bg-gray-600 text-white py-2 rounded-lg p-2 cursor-pointer"
          />
          <button
            onClick={handleUpload}
            className="cursor-pointer mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
          >
            {isUploading ? "Uploading..." : "Upload & Analyze"}
          </button>
        </>
      )}

      {isUploading && (
        <div className="w-full flex items-center justify-center p-2">
          Uploading
        </div>
      )}

      {/* Progress bar */}

      {progress > 0 && (
        <div className="mt-4 w-full bg-gray-200 rounded-full">
          <h1 className="text-2xl font-bold mb-4">Proccessing Your Video</h1>

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
