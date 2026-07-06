/**
 * Generative AI for Smart Business Automation
 * -------------------------------------------
 * Simple Express backend that exposes a single API endpoint which
 * uses a generative AI model (Anthropic Claude) to automate common
 * business tasks such as:
 *   - Drafting emails
 *   - Summarizing reports/documents
 *   - Generating meeting notes / action items
 *   - Suggesting process/workflow automation steps
 *
 * Run:
 *   1. npm install
 *   2. cp .env.example .env   (then add your ANTHROPIC_API_KEY)
 *   3. npm start
 *   4. Open http://localhost:3000
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Prompt templates for each automation type.
// Keeping these on the server means the frontend stays simple
// and the "business logic" of how each task is automated lives
// in one place, making it easy to extend.
const TASK_PROMPTS = {
  email: (input) => `You are a professional business communication assistant.
Draft a clear, polished business email based on the following request.
Include a subject line, greeting, body, and sign-off.

Request:
${input}`,

  summary: (input) => `You are a business analyst assistant.
Summarize the following report/document into concise bullet points,
highlighting key findings, risks, and recommended next steps.

Content:
${input}`,

  meeting_notes: (input) => `You are an executive assistant.
Convert the following raw meeting notes/transcript into a structured
summary with sections: Attendees (if mentioned), Key Discussion Points,
Decisions Made, and Action Items (with owners if mentioned).

Raw notes:
${input}`,

  workflow: (input) => `You are a business process automation consultant.
Analyze the following manual business process and propose a step-by-step
plan to automate it, including which steps could use AI, which tools or
integrations might help, and expected efficiency gains.

Process description:
${input}`,
};

app.post('/api/automate', async (req, res) => {
  try {
    const { taskType, input } = req.body;

    if (!input || !input.trim()) {
      return res.status(400).json({ error: 'Please provide task details.' });
    }

    const buildPrompt = TASK_PROMPTS[taskType];
    if (!buildPrompt) {
      return res.status(400).json({ error: 'Unknown task type.' });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(500).json({
        error: 'Server is missing ANTHROPIC_API_KEY. Add it to your .env file.',
      });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{ role: 'user', content: buildPrompt(input) }],
    });

    const outputText = message.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    res.json({ result: outputText });
  } catch (err) {
    console.error('Automation error:', err);
    res.status(500).json({ error: 'Something went wrong generating the automation output.' });
  }
});

app.listen(PORT, () => {
  console.log(`Smart Business Automation server running at http://localhost:${PORT}`);
});
