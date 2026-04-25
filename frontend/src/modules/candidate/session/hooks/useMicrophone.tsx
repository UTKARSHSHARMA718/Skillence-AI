import { useState, useCallback } from "react";
import { Button } from "@/common/components/Button";

export type MicStatus =
  | "idle"
  | "requesting"
  | "granted"
  | "denied"
  | "no-device"
  | "error";

interface MicDevice {
  deviceId: string;
  label: string;
}

export function useMicrophone() {
  const [status, setStatus] = useState<MicStatus>("idle");
  const [device, setDevice] = useState<MicDevice | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = useCallback(async (onFailGettingMicPermission?: () => void) => {
    setStatus("requesting");
    setError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setStatus("error");
        setError("Media devices API not supported");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const microphones = devices.filter((d) => d.kind === "audioinput");

      if (!microphones.length) {
        setStatus("no-device");
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      const selected = microphones[0];

      setDevice({
        deviceId: selected.deviceId,
        label: selected.label || "Microphone",
      });

      setStatus("granted");

      stream.getTracks().forEach((t) => t.stop());
    } catch (err: any) {
      if (err?.name === "NotAllowedError") {
        setStatus("denied");
        setError("Microphone permission denied");
      } else {
        setStatus("error");
        setError(err?.message || "Unknown microphone error");
      }
      if (onFailGettingMicPermission) {
        onFailGettingMicPermission();
      }
    }
  }, []);

  // UI COMPONENTS

  const MicrophoneStatus = () => {
    if (status === "idle") return <p>No microphone permission requested yet.</p>;

    if (status === "requesting")
      return <p>Requesting microphone permission...</p>;

    if (status === "granted") return <p>🎤 Microphone: {device?.label}</p>;

    if (status === "denied")
      return <p style={{ color: "red" }}>Permission denied.</p>;

    if (status === "no-device")
      return <p style={{ color: "red" }}>No microphone device found.</p>;

    if (status === "error")
      return <p style={{ color: "red" }}>{error}</p>;

    return null;
  };

  const MicrophoneButton = () => {
    const getButtonText = () => {
      switch (status) {
        case "idle":
          return "Enable Microphone";
        case "requesting":
          return "Requesting...";
        case "granted":
          return "Microphone Enabled";
        case "denied":
          return "Permission Denied";
        case "no-device":
          return "No Microphone Found";
        case "error":
          return "Error Accessing Microphone";
        default:
          return "Enable Microphone";
      }
    };

    return (
      <Button
        onClick={() => requestPermission()}
        disabled={status === "requesting" || status === "granted"}
        style={{ padding: "10px 16px", cursor: "pointer" }}
      >
        {getButtonText()}
      </Button>
    );
  };

  return {
    status,
    device,
    error,
    requestPermission,
    MicrophoneStatus,
    MicrophoneButton,
  };
}