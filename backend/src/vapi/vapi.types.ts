export interface VapiEndOfCallReport {
  message: {
    timestamp: number;
    type: "end-of-call-report" | "assistant.started" | "assistant.ended";
    analysis: {
      summary: string;
      successEvaluation: string; // "true" | "false" (kept string as per data)
    };
    artifact: VapiArtifact;
    startedAt: string;
    endedAt: string;
    endedReason: string;
    cost: number;
    costBreakdown: CostBreakdown;
    costs: CostItem[];
    durationMs: number;
    durationSeconds: number;
    durationMinutes: number;
    summary: string;
    messages: VapiMessage[];
    recordingUrl: string;
    stereoRecordingUrl: string;
    call: CallInfo;
    assistant: AssistantConfig;
  };
}

/* ------------------ Artifact ------------------ */

export interface VapiArtifact {
  messages: VapiMessage[];
  messagesOpenAIFormatted: OpenAIMessage[];
  transcript: string;
  recordingUrl: string;
  stereoRecordingUrl: string;
  logUrl: string;
  recording: Recording;
  nodes: any[];
  assistantActivations: { assistantName: string }[];
  variables: Variables;
  variableValues: Variables;
  performanceMetrics: PerformanceMetrics;
  scorecards: Record<string, any>;
  transfers: any[];
}

/* ------------------ Messages ------------------ */

export interface VapiMessage {
  role: "bot" | "user";
  message: string;
  time: number;
  endTime?: number;
  secondsFromStart?: number;
  duration?: number;
  source?: string;
  metadata?: {
    wordLevelConfidence: WordConfidence[];
  };
}

export interface WordConfidence {
  word: string;
  start: number;
  end: number;
  confidence: number;
  language: string;
  punctuated_word: string;
}

export interface OpenAIMessage {
  role: "assistant" | "user" | "system";
  content: string;
}

/* ------------------ Recording ------------------ */

export interface Recording {
  stereoUrl: string;
  mono: {
    combinedUrl: string;
    assistantUrl: string;
    customerUrl: string;
  };
}

/* ------------------ Variables ------------------ */

export interface Variables {
  now: string;
  currentDateTime: string;
  date: string;
  time: string;
  year: string;
  month: string;
  day: string;
  transport: Transport;
  call: {
    id: string;
    type: string;
    status: string;
    createdAt: string;
    transport: Transport;
  };
}

/* ------------------ Transport ------------------ */

export interface Transport {
  conversationType: string;
  provider: string;
  videoRecordingEnabled: boolean;
  assistantVideoEnabled: boolean;
  roomDeleteOnUserLeaveEnabled: boolean;
  callUrl: string;
}

/* ------------------ Performance ------------------ */

export interface PerformanceMetrics {
  turnLatencies: {
    modelLatency: number;
    voiceLatency: number;
    transcriberLatency: number;
    endpointingLatency: number;
    turnLatency: number;
  }[];
  modelLatencyAverage: number;
  voiceLatencyAverage: number;
  transcriberLatencyAverage: number;
  endpointingLatencyAverage: number;
  turnLatencyAverage: number;
  fromTransportLatencyAverage: number;
  toTransportLatencyAverage: number;
}

/* ------------------ Cost ------------------ */

export interface CostBreakdown {
  stt: number;
  llm: number;
  tts: number;
  vapi: number;
  chat: number;
  transport: number;
  total: number;
  llmPromptTokens: number;
  llmCompletionTokens: number;
  llmCachedPromptTokens: number;
  ttsCharacters: number;
  voicemailDetectionCost: number;
  knowledgeBaseCost: number;
  analysisCostBreakdown: {
    summary: number;
    summaryPromptTokens: number;
    summaryCompletionTokens: number;
    summaryCachedPromptTokens: number;
    structuredData: number;
    structuredDataPromptTokens: number;
    structuredDataCompletionTokens: number;
    structuredDataCachedPromptTokens: number;
    successEvaluation: number;
    successEvaluationPromptTokens: number;
    successEvaluationCompletionTokens: number;
    successEvaluationCachedPromptTokens: number;
    structuredOutput: number;
    structuredOutputPromptTokens: number;
    structuredOutputCompletionTokens: number;
    structuredOutputCachedPromptTokens: number;
  };
}

export type CostItem =
  | {
      type: "transcriber";
      transcriber: { provider: string };
      minutes: number;
      cost: number;
    }
  | {
      type: "model";
      model: { provider: string; model: string };
      promptTokens: number;
      completionTokens: number;
      cachedPromptTokens: number;
      cost: number;
    }
  | {
      type: "voice";
      voice: { provider: string; voiceId: string };
      characters: number;
      cost: number;
    }
  | {
      type: "vapi";
      subType: string;
      minutes: number;
      cost: number;
    }
  | {
      type: "knowledge-base";
      model: { provider: string; model: string };
      promptTokens: number;
      completionTokens: number;
      cost: number;
    }
  | {
      type: "transport";
      provider: string;
      minutes: number;
      cost: number;
    }
  | {
      type: "analysis";
      analysisType: string;
      model: { provider: string; model: string };
      promptTokens: number;
      completionTokens: number;
      cost: number;
    };

/* ------------------ Call ------------------ */

export interface CallInfo {
  id: string;
  orgId: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  cost: number;
  monitor: {
    listenUrl: string;
    controlUrl: string;
  };
  transport: Transport;
  webCallUrl: string;
  status: string;
  assistant: AssistantConfig;
}

/* ------------------ Assistant ------------------ */

export interface AssistantConfig {
  name: string;
  hooks: Hook[];
  model: {
    model: string;
    provider: string;
    maxTokens: number;
    temperature: number;
    messages: OpenAIMessage[];
    tools: { type: string }[];
  };
  voice: {
    provider: string;
    voiceId: string;
  };
  server: {
    url: string;
  };
  transcriber: {
    provider: string;
    language: string;
  };
  firstMessage: string;
  backgroundSound: string;
  maxDurationSeconds: number;
  firstMessageInterruptionsEnabled: boolean;
  startSpeakingPlan: {
    waitSeconds: number;
    smartEndpointingPlan: {
      provider: string;
    };
  };
  stopSpeakingPlan: {
    numWords: number;
    voiceSeconds: number;
    backoffSeconds: number;
  };
}

export interface Hook {
  on: string;
  name: string;
  options: {
    timeoutSeconds: number;
    triggerMaxCount: number;
  };
  do: (
    | {
        type: "say";
        prompt: string;
      }
    | {
        type: "tool";
        tool: { type: string };
      }
  )[];
}