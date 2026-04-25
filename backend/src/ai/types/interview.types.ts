export type Topic = {
  topic_id: string;
  topic_name: string;
  target_score?: number;
};

export type RoundData = {
  round_no: number;
  topics: Topic[];
  topics_count: number;
};

export type EvaluationSummary = {
  total_score: number;
  total_target_score: number;
  performance_percentage: number;
  performance_level: string;
  overall_feedback: string;
};

export type EvaluationResult = {
  transcript: string;
  total_topics: number;
  round_no?: number;
  round_topics_count?: number;
  summary: EvaluationSummary;
  rubric_evaluations: Record<string, any>;
};