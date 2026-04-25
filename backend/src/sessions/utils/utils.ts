interface Topic {
  id: string;
  title: string;
  status: string;
  url: string;
  topics: string[];
  covered: boolean;
  isPass?: boolean;
}

export function formatTopics(topics: Partial<Topic>[]): string {
  return topics
    .map((topic, index) => {
      return `${index + 1}. ${topic.title}`;
    })
    .join("\n");
}