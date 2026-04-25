export const EVAL_CRITERIA_CONCEPTUAL = `
EVALUATION CRITERIA FOR CONCEPTUAL PROFILE:

PASS (1) if the candidate:
- Answered the question consicely and accurately
- Explained WHAT the concept even if it is in their own words
- Communicated clearly even without technical jargon

FAIL (0) if the candidate:
- Could not answer the question consicely and accurately
- Could not explain what the concept is
- Completely confused or incorrect explanations
`;

export const EVAL_CRITERIA_STRATEGIC = `
EVALUATION CRITERIA FOR STRATEGIC PROFILE:

PASS (1) if the candidate:
- Answered the question consicely and accurately
- Explained WHAT the concept is even if it is in their own words
- Communicated clearly with some technical jargon

FAIL (0) if the candidate:
- Could not answer the question consicely and accurately
- Could not explain what the concept is
- Completely confused or incorrect explanations
`;

export const EVAL_CRITERIA_TECHNICAL = `
EVALUATION CRITERIA FOR TECHNICAL PROFILE:
 
PASS (1) if the candidate:
- Answered the question consicely and accurately
- Explained WHAT the concept is
- Provided correct explanations without misconceptions
- Communicated clearly with appropriate technical jargon

FAIL (0) if the candidate:
- Could not answer the question consicely and accurately
- Provided incorrect explanations or misconceptions
- Completely confused or incorrect explanations
`;

// -----------------------

export const buildInterviewEvaluationPrompt = ({
  transcript,
  profileEvalCriteria,
  topicsList,
  profileCategory,
}: {
  transcript: string;
  topicsList: string;
  profileCategory: string;
  profileEvalCriteria: string;
}) => {
  return `You are an expert technical reviewer tasked with evaluating a candidate's performance across ALL topics discussed in the review.
 
You will be provided with:
1. Review transcript (conversation between reviewer and candidate)
2. List of ALL topics with their IDs and names
3. Candidate's profile category

 
Your task is to:
1. For EACH topic, decide if the candidate demonstrated sufficient knowledge (binary: 0 or 1)
2. Provide overall feedback across all topics (paragraph-form)
3. Write detailed, candidate-friendly feedback that addresses the candidate directly
4. Give output in the EXACT JSON format specified at the end of this prompt.
 
Rules:
- DO NOT expect code-level or script-level explanations.
- DO NOT expect the candidate to provide thought process.

Transcript (if empty, output "No transcript provided"):
 
${transcript}
 
Topics:
 
${topicsList}
 
Profile Category: ${profileCategory}
 
${profileEvalCriteria}

PART 1: BINARY TOPIC EVALUATION
 
  passed:
    For each topic, determine:
    - **1 (PASS)**: Candidate met the expectations for their profile category
    - **0 (FAIL)**: Candidate did not meet the expectations for their profile category
 
  overall_passed:
    - **1 (PASS)**: Candidate passed the review overall by demonstrating sufficient knowledge across most topics (e.g., passing at least 50% of topics)
    - **0 (FAIL)**: Candidate did not pass the review overall by failing to demonstrate sufficient knowledge across most topics (e.g., passing less than 50% of topics)
 
PART 2: FEEDBACK
  
  topic_feedback:
  - Review the evaluation criteria for the candidate's profile category and the transcript to write specific feedback for each topic.
  - Keep Topic-Wise Feedback brief mentioning why they passed or failed and how they can improve their answers to the specific question of that topic in the transcript based on their evaluation criteria. Don't include extra concepts other than the specific topic question. Don't say "Strengthen your understanding of Angular's SPA role, component architecture, TypeScript basics, data binding, and dependency injection." Instead, say "Strengthen your understanding of Angular's basic definition first."
  - The output should be a concise paragraph (20 to 40 words) for each topic, directly addressing the candidate and referencing specific points from the transcript.
 
  overall_feedback:
  - Be SPECIFIC and ACTIONABLE. Use examples from the transcript.
  - Just include these elements in the bullet-point form in overall_feedback (1-2 line each bullet), nothing more:
    1. **Questions Asked**: What topics were covered and how deeply
    2. **Response Quality**: How well the candidate answered (specific, vague, accurate, incorrect)
    3. **Strong Areas**: Topics where candidate excelled (with examples)
    4. **Weak Areas**: Topics needing improvement (with specific gaps identified)
    5. **Communication Style**: Clarity, confidence level, hesitation patterns, vocabulary
    6. **Behavioral Patterns**: Thinking process, problem-solving approach, how they handle difficult questions 
 
OUTPUT FORMAT (JSON):
{{
  "topic_evaluations": [
    {{
      "topicId": "UUID of topic 1",
      "passed": 1,
      "topicFeedback": "You showed solid foundational knowledge of load balancing. To improve, deepen your understanding of concepts like health checks and session persistence."
    }},
    {{
      "topicId": "UUID of topic 2",
      "passed": 0,
      "topicFeedback": "Your explanations were wrong and incomplete. Strengthen core load-balancing definition."
    }}
  ],
  "overall_feedback":
    "
    Questions Asked: We covered DNS resolution, HTTP request-response flow, and load balancing concepts. You handled foundational networking topics comfortably and were able to walk through the basic process of how a web request reaches a server.
 
    Response Quality: Your answers were mostly accurate and structured. For example, when explaining DNS, you clearly described domain-to-IP translation and request routing. Some answers could benefit from slightly deeper technical detail.
 
    Strong Areas: You showed strong conceptual clarity in networking fundamentals. Your DNS explanation was particularly clear, and you articulated the HTTP request flow confidently with correct terminology.
 
    Weak Areas: Some answers remained at a high-level overview. For instance, during load balancing you mentioned round-robin but did not discuss health checks or failover handling.
 
    Communication Style: You communicated clearly and confidently, with logical step-by-step explanations. Your responses were easy to follow and used appropriate technical vocabulary.
 
    Behavioral Patterns: You demonstrated a structured thinking process, often explaining systems sequentially (client → DNS → server). When unsure about deeper details, you acknowledged limitations instead of guessing, which is a good professional habit.
    "
    
    OR
    
    "
    Questions Asked: We discussed DNS resolution, HTTP communication, and load balancing concepts. The questions focused on understanding how a web request moves through the internet and how servers manage traffic.
 
    Response Quality: Many responses were incomplete or vague. For example, when asked about HTTP, you stated that it “sends requests to servers” but did not describe request structure, headers, or server responses.
 
    Strong Areas: You had a basic awareness of key concepts such as DNS translating domain names to IP addresses and load balancing distributing traffic across servers.
 
    Weak Areas: Several core concepts were missing or unclear. You were unable to explain DNS at all, and the HTTP explanation lacked details about request-response structure and protocols.
 
    Communication Style: Your answers contained noticeable hesitation and frequent pauses, which made explanations less structured. With stronger conceptual preparation, your communication clarity would likely improve.
 
    Behavioral Patterns: When encountering difficult questions, you often stopped early instead of reasoning through the problem. Practicing step-by-step thinking and verbalizing your reasoning can help demonstrate understanding even when unsure.
    "
 
  "overall_passed": 1 OR 0 (based on the binary evaluation of topics)
}}
 
IMPORTANT - FEEDBACK TONE AND STYLE:
- Use phrases like "You demonstrated...", "You can improve by...", "Consider exploring...", "I encourage you to..."
- DO NOT say things like "the transcript doesn't include" or "the candidate didn't mention"
- Instead, focus on what the candidate DID demonstrate and how they can BUILD on it
- Mention specific topics and examples from the review naturally within the feedback
- Only evaluate based on what was actually discussed
- Return the exact JSON structure specified above
`;
};
