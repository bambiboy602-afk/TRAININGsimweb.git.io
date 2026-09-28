import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createHttpServer } from 'http';
import { WebSocketServer } from 'ws';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const httpServer = createHttpServer(app);
const wss = new WebSocketServer({ server: httpServer, path: '/api/live' });

// In development, mount Vite's middleware
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });
  app.use(vite.middlewares);
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Live API WebSocket Setup
wss.on('connection', async (ws) => {
  console.log('Live API client connected');
  let session: any = null;

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.setup) {
        session = await ai.live.connect({
          model: 'gemini-3.8-live',
          config: {
            systemInstruction: data.setup.systemInstruction,
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
          },
          callbacks: {
            onmessage: (msg: any) => {
              const audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audio) {
                ws.send(JSON.stringify({ audio }));
              }
              if (msg.serverContent?.interrupted) {
                ws.send(JSON.stringify({ interrupted: true }));
              }
            },
          },
        });
      } else if (data.audio && session) {
        session.sendRealtimeInput({
          audio: { data: data.audio, mimeType: 'audio/pcm;rate=16000' },
        });
      }
    } catch (err) {
      console.error('Live API error:', err);
    }
  });

  ws.on('close', () => {
    console.log('Live API client disconnected');
  });
});

// TTS Route
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [{ role: 'user', parts: [{ text, speechMetadata: { style: 'Empathetic, calm counselor' } }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });

    const audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    res.json({ audio });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Transcription Route
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audio } = req.body; // base64
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: { parts: [{ inlineData: { data: audio, mimeType: 'audio/webm' } }, { text: 'Transcribe this audio exactly.' }] },
    });
    res.json({ text: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Schema for Evaluation Response
const evalSchema = {
  type: Type.OBJECT,
  properties: {
    scores: {
      type: Type.OBJECT,
      properties: {
        oars: { type: Type.NUMBER },
        activeListening: { type: Type.NUMBER },
        cbtTechniques: { type: Type.NUMBER },
        deEscalation: { type: Type.NUMBER },
      },
      required: ['oars', 'activeListening', 'cbtTechniques', 'deEscalation'],
    },
    feedback: { type: Type.STRING },
    unlockedSymptoms: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['scores', 'feedback', 'unlockedSymptoms'],
};

// Route for Persona Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, persona } = req.body;
    
    const systemPrompt = `You are roleplaying as ${persona.name}, a ${persona.age}-year-old ${persona.demographics}. 
    Your clinical profile is: ${persona.diagnosis}. 
    Family History: ${persona.familyHistory}.
    Difficulty Level: ${persona.difficulty}.
    
    Current state and symptoms to potentially exhibit:
    ${persona.symptoms.map((s: any) => `- ${s.name}: ${s.description}`).join('\n')}

    INSTRUCTIONS:
    1. Stay strictly in character. Do not break character for any reason.
    2. Respond with the emotional weight appropriate to your difficulty level (${persona.difficulty}).
    3. If the user uses grounding techniques, de-escalation, or OARS (Open-ended questions, Affirmations, Reflections, Summaries), respond by gradually becoming more cooperative, though maintain your core struggle.
    4. Keep responses concise and natural for a conversation.
    5. Do not explicitly state your diagnosis or symptom names unless it's natural for the character.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: messages.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: systemPrompt,
      }
    });

    res.json({ content: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route for Evaluation
app.post('/api/evaluate', async (req, res) => {
  try {
    const { messages, persona, currentScores } = req.body;

    const systemPrompt = `You are a clinical supervisor evaluating a peer support trainee's interaction with a patient named ${persona.name}.
    
    PATIENT PROFILE:
    - Diagnosis: ${persona.diagnosis}
    - Symptoms: ${persona.symptoms.map((s: any) => s.name).join(', ')}

    EVALUATION CRITERIA:
    1. OARS (0-25): Use of Open-ended questions, Affirmations, Reflections, and Summaries.
    2. Active Listening (0-25): Demonstrating presence, validating feelings, and avoiding interruption.
    3. CBT/Psych Techniques (0-25): Use of grounding, cognitive reframing, or behavioral activation.
    4. De-escalation & Safety (0-25): Calm tone, boundary setting, and suicide risk assessment (if applicable).

    CURRENT SCORES: ${JSON.stringify(currentScores)}

    INSTRUCTIONS:
    - Analyze the latest interaction. 
    - Use Google Search to verify if the trainee's approach aligns with current DSM-5 or peer support evidence-based practices.
    - Adjust scores based on the trainee's performance. Scores should be incremental and move towards 25.
    - Provide a short, constructive feedback message (max 2 sentences).
    - Identify if any of the patient's symptoms were 'unlocked' (discovered) by the trainee's inquiry.
    
    SYMPTOMS TO MONITOR FOR DISCOVERY:
    ${persona.symptoms.map((s: any) => `- ${s.name}`).join('\n')}

    Output MUST be a JSON object matching the requested schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [
        { role: 'user', parts: [{ text: `Conversation History: ${JSON.stringify(messages)}` }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: evalSchema,
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        tools: [{ googleSearch: {} }]
      }
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: any) {
    console.error('Eval API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route for Persona Image Generation
app.post('/api/generate-persona-image', async (req, res) => {
  try {
    const { persona } = req.body;
    const prompt = `A realistic clinical dossier portrait of ${persona.name}, a ${persona.age}-year-old ${persona.demographics}. 
    Emotional tone: ${persona.difficulty === 'Crisis' ? 'distressed and intense' : persona.difficulty === 'Acute' ? 'anxious and guarded' : 'reserved and quiet'}. 
    High-fidelity clinical photography, neutral background, cinematic lighting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    let base64Image = '';
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        base64Image = part.inlineData.data;
        break;
      }
    }

    if (base64Image) {
      res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
    } else {
      res.status(500).json({ error: 'No image generated' });
    }
  } catch (error: any) {
    console.error('Image Generation Error:', error);
    res.status(500).json({ error: error.message });
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

