"use client";

interface Props {
  audioUrl: string | null;
}

const SessionAudioPlayer: React.FC<Props> = ({ audioUrl }) => {
  if (!audioUrl) {
    return (
      <p className="text-sm text-gray-500">
        Audio recording not available.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-gray-800">Session Audio</p>

      <audio
        controls
        src={audioUrl}
        className="w-full"
      />
    </div>
  );
};

export default SessionAudioPlayer;