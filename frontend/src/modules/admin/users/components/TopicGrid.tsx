import { TopicTile } from "./TopicTile";

export interface Topic {
  title: string;
  result: string;
  feedback: string;
}

interface TopicGridProps {
  topics: Topic[];
}

export const TopicGrid: React.FC<TopicGridProps> = ({ topics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {topics.map((topic, index) => (
        <TopicTile
          key={index}
          title={topic.title}
          result={topic.result}
          feedback={topic.feedback}
        />
      ))}
    </div>
  );
};