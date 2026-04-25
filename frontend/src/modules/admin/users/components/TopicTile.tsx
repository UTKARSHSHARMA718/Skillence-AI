interface TopicTileProps {
  title: string;
  result: string;
  feedback: string;
}

export const TopicTile: React.FC<TopicTileProps> = ({
  title,
  result,
  feedback,
}) => {
  const resultColor =
    result === "pass" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h4 className="font-semibold text-sm mb-2">{title}</h4>

      <span
        className={`text-xs px-2 py-1 rounded ${resultColor}`}
      >
        {result.toUpperCase()}
      </span>

      <p className="text-xs text-gray-600 mt-2">{feedback}</p>
    </div>
  );
};