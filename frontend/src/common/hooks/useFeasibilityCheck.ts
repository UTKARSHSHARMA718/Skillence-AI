import { useState } from "react";
import { axiosInstance } from "../api/client";

type UseInternetSpeedOptions = {
  downloadUrl?: string;
  uploadUrl?: string;
  fileSizeBytes?: number;
};

type UseInternetSpeedReturn = {
  downloadSpeed: number | null; // Mbps
  uploadSpeed: number | null; // Mbps
  loading: boolean;
  error: string | null;
  testSpeed: () => Promise<void>;
};

export default function useFeasibilityCheck({
  downloadUrl,
  uploadUrl,
  fileSizeBytes,
}: UseInternetSpeedOptions = {}): UseInternetSpeedReturn {
  const [downloadSpeed, setDownloadSpeed] = useState<number | null>(null);
  const [uploadSpeed, setUploadSpeed] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to calculate speed in Mbps
  const calculateSpeed = (bytes: number, durationSeconds: number): number => {
    const bits = bytes * 8;
    const mbps = bits / (durationSeconds * 1024 * 1024);
    return parseFloat(mbps.toFixed(2));
  };

  // 10 Mbps download and 5 Mbps upload
  const testDownloadSpeed = async (): Promise<void> => {
    if (!downloadUrl) return;

    try {
      const startTime = performance.now();

      const response = await axiosInstance.get(downloadUrl, {
        responseType: "blob",
      });

      if (response.status !== 200) {
        throw new Error("Download request failed");
      }

      const endTime = performance.now();

      const blob = response.data as any; // already a blob
      const size = fileSizeBytes ?? blob?.size;

      const duration = (endTime - startTime) / 1000;

      setDownloadSpeed(calculateSpeed(size, duration));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const testUploadSpeed = async (): Promise<void> => {
    if (!uploadUrl) return;

    try {
      const size = fileSizeBytes ?? 4 * 1024 * 1024; // 4MB default
      const data = new Blob([new Uint8Array(size)], {
        type: "application/octet-stream",
      });

      const startTime = performance.now();

      const response = await axiosInstance.post(uploadUrl, data, {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      });

      if (response.status !== 200) {
        throw new Error("Upload request failed");
      }

      const endTime = performance.now();
      const duration = (endTime - startTime) / 1000;

      setUploadSpeed(calculateSpeed(size, duration));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const testSpeed = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    await testDownloadSpeed();
    await testUploadSpeed();

    // use promise all to run in parallel

    setLoading(false);
  };

  return {
    downloadSpeed,
    uploadSpeed,
    loading,
    error,
    testSpeed,
  };
}
