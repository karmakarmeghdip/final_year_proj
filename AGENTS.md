# Project Overview
[cite_start]You are building the core AI orchestration layer for the "Real-Time Hybrid Multimodal Misinformation Detection System"[cite: 119]. [cite_start]This is a standalone, cross-platform desktop application built with Tauri, React, and TypeScript[cite: 29, 213]. 

[cite_start]The application, named "Truth Lens", verifies the authenticity of news via text, links, or image screenshots[cite: 59, 60, 61, 70]. 

## Core Constraints & Architecture
* **Environment:** The entire AI workflow runs entirely client-side within the Tauri webview using TypeScript and the Vercel AI SDK (`ai-sdk/react`, `ai-sdk/core`).
* **Zero Backend:** There is no custom backend server for API routing. 
* **Authentication:** The app is standalone. API keys (for the LLM and the Search API) will be inputted by the user via a settings UI and stored persistently in `localStorage`. The AI SDK must retrieve these keys dynamically at runtime.
* [cite_start]**Primary Model:** The intelligence layer relies on Qwen2.5-VL to process multimodal inputs (handling both text and images in a single token stream)[cite: 100, 101, 235].

## The AI Pipeline (The Detection Workflow)
[cite_start]When generating code for the detection flow, implement the following pipeline sequentially as defined in the system architecture[cite: 36, 241]. 

### 1. Ingestion & Multimodal OCR
* Accept user input (Text, URL, or Image).
* [cite_start]If an image is provided, pass the base64 encoded image alongside the prompt to Qwen2.5-VL to extract text and analyze visual context[cite: 39, 41].

### 2. Live Search RAG (Retrieval-Augmented Generation)
* [cite_start]Extract key entities (names, dates, claims) from the ingested content[cite: 264].
* [cite_start]Trigger a Live Search API (e.g., Brave Search, DuckDuckGo, or Serper) directly from the client to fetch the latest verified articles[cite: 265].
* [cite_start]Use this retrieved context to ground the LVLM, preventing knowledge-cutoff hallucinations[cite: 26, 102].

### 3. Consistency Check & Logic Verification
* [cite_start]Prompt the model to evaluate the relationship between the image and the text (e.g., spotting a mismatched headline and photo)[cite: 43, 101].
* [cite_start]Analyze the text for logical fallacies (e.g., Ad Hominem, Slippery Slope) and emotionally charged language[cite: 49, 75, 79, 81].

### 4. The 7-Type FANDC Classification
* [cite_start]The system must not use a simple binary "True/False" output[cite: 16, 221]. 
* [cite_start]Map the findings to the FANDC taxonomy[cite: 19, 90]:
    1.  [cite_start]**Satire:** Humorous, no intent to harm[cite: 91].
    2.  [cite_start]**Clickbait:** Misleading headlines[cite: 92].
    3.  [cite_start]**Propaganda:** Biased, promotes a political cause[cite: 93].
    4.  [cite_start]**Disinformation:** Maliciously fabricated[cite: 94].
    5.  [cite_start]**Misinformation:** False information shared without malice[cite: 95].
    6.  [cite_start]**Hoax:** Deliberate fabrication to deceive[cite: 96].
    7.  [cite_start]**Junk News:** Conspiratorial or highly partisan[cite: 97].

## Expected AI Output Schema (Object Generation)
Use the Vercel AI SDK's `generateObject` or structured JSON outputs to ensure the response strictly adheres to the UI requirements. The schema should include:

```typescript
type TruthLensReport = {
  truthScore: number; // 0 to 100
  classification: "Satire" | "Clickbait" | "Propaganda" | "Disinformation" | "Misinformation" | "Hoax" | "Junk News";
  executiveSummary: string; // 2-3 sentences explaining the verdict
  digitalManipulationDetected: string | null; // e.g., "Mismatched font sizes in the headline suggest digital editing."
  logicalFallacies: Array<{
    type: string; // e.g., "Ad Hominem"
    quote: string; // The specific text snippet
    explanation: string; // Why it's a fallacy
  }>;
}

```

## Developer Guidelines

* **Error Handling:** Implement robust error handling for missing `localStorage` API keys, rate limits, and network failures.
* **State Management:** Use standard React hooks (`useState`, `useTransition`) or Zustand to manage the loading state of the multi-step pipeline so the user sees progress (e.g., "Extracting text...", "Searching the web...", "Analyzing logic...").
* **Security:** Ensure that API keys fetched from `localStorage` are passed securely in the headers of outgoing `fetch` requests and are never rendered in the DOM.

```
