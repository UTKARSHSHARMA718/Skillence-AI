export const getVapiConfig = ({
  sessionId,
  prompt,
  userName,
}: {
  sessionId: string;
  prompt: string;
  userName: string;
}) => {
  const voiceProps = {
    neha: {
      provider: '11labs',
      voiceId: '5eTCXMQnNm7Zqq5TNx7h',
      name: 'Neha',
    },
    kabir: {
      provider: '11labs',
      voiceId: '8sWH93U9U0KfEJZdaI8Z',
      name: 'Kabir',
    },
  };

  return {
    server: {
      url: `${process.env.VAPI_WEB_HOOK_URL}/${sessionId}`,
    },
    transcriber: {
      provider: 'assembly-ai',
      language: 'en',
    },
    startSpeakingPlan: {
      smartEndpointingPlan: {
        provider: 'vapi',
      },
      waitSeconds: 4.0,
    },
    stopSpeakingPlan: {
      numWords: 1,
      voiceSeconds: 0.5,
      backoffSeconds: 3.0,
    },

    maxDurationSeconds: 5400,
    hooks: [
      {
        on: 'customer.speech.timeout',
        name: 'timeout_1_repeat_previous_question',
        options: { timeoutSeconds: 18, triggerMaxCount: 3 },
        do: [
          {
            type: 'say',
            prompt:
              "From the conversation so far, identify the most recent assistant question and repeat it verbatim. Do not paraphrase. If none exists, say: 'Just checking in — whenever you're ready, please share your answer.'",
          },
        ],
      },
      {
        on: 'customer.speech.timeout',
        name: 'timeout_2_end_call',
        options: { timeoutSeconds: 50, triggerMaxCount: 1 },
        do: [
          {
            type: 'say',
            prompt:
              "I'll end the call now. You can reach the Training Department for any further assistance.",
          },
        ],
      },
    ],
    model: {
      provider: 'openai',
      model: 'gpt-4.1',
      temperature: 0,
      maxTokens: 250,
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
    },
    voice: {
      provider: voiceProps.neha.provider,
      voiceId: voiceProps.neha.voiceId,
    },
    firstMessageInterruptionsEnabled: false,
    name: voiceProps.neha.name,
    backgroundSound: 'off',
    firstMessage: `Hi ${
      userName
    }, I'm ${voiceProps.neha.name} from the Training Department at HestaBit. I'll be conducting your bootcamp review today. Please ensure you speak clearly and avoid any unfair practices during the session, as that may lead to disqualification. Shall we begin?`,
  };
};
