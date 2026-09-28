# Peer Support & Behavioral Health Training Simulator

A high-fidelity clinical training tool for peer support specialists and behavioral health professionals. This application uses advanced AI to simulate patient interactions and provide real-time clinical evaluation.

## Features

- **8 AI-Driven Clinical Personas**: Practice with a diverse range of behavioral health scenarios including Bipolar 1, Dual Diagnosis, Early Psychosis, and MDD.
- **Advanced Clinical Reasoning**: Powered by Gemini 3.1 Pro Preview with high-level thinking and Google Search grounding for evidence-based evaluations.
- **Real-Time Clinical Rubric**: Evaluation across OARS, Active Listening, CBT Techniques, and De-escalation.
- **Voice Integration**: Supports real-time audio transcription and text-to-speech for verbal training.
- **Google Workspace Export**: Export training reports to Google Docs and log progress to Google Sheets.
- **High-Fidelity Portraits**: Dynamic clinical portrait generation for each persona.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Lucide React, Framer Motion.
- **Backend**: Node.js, Express.
- **AI**: Google Gemini API (@google/genai).
- **Auth**: Firebase Authentication with Google Workspace scopes.

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file based on `.env.example` and add your `GEMINI_API_KEY`.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## License

SPDX-License-Identifier: Apache-2.0
