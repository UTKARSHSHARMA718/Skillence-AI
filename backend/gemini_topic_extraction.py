import pandas as pd
import json
import re
import time
from google import genai

def call_gemini(prompt, api_key, max_retries=5):
    client = genai.Client(api_key=api_key)

    for attempt in range(max_retries):
        try:
            
            try:
                resp = client.models.generate_content(
                    model="gemini-2.5-flash",
                    contents=prompt
                )
                return resp.text
            except:
                pass

            try:
                resp = client.generate(
                    model="gemini-2.5-flash",
                    prompt=prompt
                )
                return resp.text
            except:
                pass

            
            try:
                resp = client.responses.generate(
                    model="gemini-2.5-flash",
                    input=prompt
                )
                return resp.output_text
            except:
                pass

        except Exception as e:
            msg = str(e).lower()
            wait = 2 ** attempt

            
            if "503" in msg or "unavailable" in msg or "overloaded" in msg:
                print(f"Gemini overloaded — waiting {wait}s before retry…")
                time.sleep(wait)
                continue

            
            if "429" in msg or "rate" in msg or "exhausted" in msg:
                print(f"Gemini rate limit — waiting {wait}s before retry…")
                time.sleep(wait)
                continue

            print(f"Unexpected Gemini error: {e}")
            return None

    print("Gemini max retries reached — skipping this transcript.")
    return None


def get_subtopics_from_gemini(title, transcript, api_key):

    if not transcript or transcript.strip() == "":
        return []

    prompt = f"""
    You will receive a video transcript.
    Extract 6-10 important subtopics or question-oriented phrases that are explicitly mentioned in the transcript.

    STRICT RULES:
    1. Use ONLY information directly present in the transcript. Do NOT use outside knowledge or assumptions.
    2. Subtopics must be arranged in increasing depth:
        - Start with basic foundational ideas that appear in the transcript.
        - Then gradually move to more advanced, detailed, or process-oriented concepts mentioned in the transcript.
    3. Subtopics must be meaningful, specific, and suitable for generating further reviews questions.
    4. Avoid trivial or overly broad terms (e.g., “internet”, “protocols”, “what is X”).
    5. Each subtopic should be a short descriptive phrase such as:
        - “Basic role of DNS”
        - “DNS conversion of domain names to IP addresses”
        - “Client-server communication steps”
        - “How packets travel through the network”
        - “Routing decision process across multiple nodes”
    6. Do NOT include anything not clearly stated or explained in the transcript.
    7. Output ONLY a JSON list of 6-10 subtopics, ordered from basic → advanced.

    Title: {title}

    Transcript:
    {transcript}
    """
    output = call_gemini(prompt, api_key)

    if not output:
        return []

    try:
        return json.loads(output)
    except:
        pass

    try:
        json_part = re.search(r"\[[\s\S]*\]", output).group()
        return json.loads(json_part)
    except:
        return []

def process_csv_with_gemini(input_csv, output_csv, gemini_api_key):
    print(f"Reading CSV: {input_csv}")

    df = pd.read_csv(input_csv)
    df.columns = df.columns.str.strip()  

    print("Detected columns:", df.columns.tolist())

    required = ["Title", "Transcript_Text"]
    for col in required:
        if col not in df.columns:
            raise Exception(f"Missing required column: {col}")

    
    df["subtopic"] = None

    for idx, row in df.iterrows():

        title = str(row["Title"])
        transcript = str(row["Transcript_Text"])

        print(f"\nProcessing Gemini → {title}")

        try:
            subtopics = get_subtopics_from_gemini(
                title=title,
                transcript=transcript,
                api_key=gemini_api_key
            )
        except Exception as e:
            print(f"Failed for {title}: {e}")
            subtopics = []

        df.at[idx, "subtopic"] = subtopics

        df.to_csv(output_csv, index=False)

        time.sleep(1)

    print(f"\nDONE! Saved enriched CSV → {output_csv}")

if __name__ == "__main__":
    GEMINI_API_KEY = "AIzaSyAVrwtoYyVtkZ0rdKswBBYkSp16lYp3jeo"

    process_csv_with_gemini(
        input_csv="/home/palaksud/Downloads/Technical_Bootcamp_Sheet_deepgram_updated.csv",
        output_csv="/home/palaksud/Documents/Technical_Bootcamp_Sheet_final_with_subtopics.csv",
        gemini_api_key=GEMINI_API_KEY
    )
