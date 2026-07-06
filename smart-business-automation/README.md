# Generative AI for Smart Business Automation

A simple base project demonstrating how generative AI (Anthropic Claude) can
automate common business tasks: drafting emails, summarizing reports,
generating meeting notes, and suggesting process automation steps.

## Tech Stack
- **Backend:** Node.js + Express
- **AI:** Anthropic Claude API (`@anthropic-ai/sdk`)
- **Frontend:** Plain HTML/CSS/JavaScript (no build step required)

## Project Structure
```
smart-business-automation/
├── server.js           # Express server + /api/automate endpoint
├── package.json
├── .env.example         # Copy to .env and add your API key
└── public/
    ├── index.html        # UI
    ├── style.css
    └── script.js
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure your API key:
   ```
   cp .env.example .env
   ```
   Then open `.env` and set:
   ```
   ANTHROPIC_API_KEY=your_api_key_here
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open your browser at:
   ```
   http://localhost:3000
   ```

## How It Works

1. The user selects an automation task (email, summary, meeting notes,
   or workflow suggestion) and enters details in the textarea.
2. The frontend sends this to `POST /api/automate`.
3. The backend picks the matching prompt template (see `TASK_PROMPTS` in
   `server.js`) and calls the Claude API.
4. The generated result is returned and displayed, with a copy-to-clipboard
   option.

## Extending This Base Project

This is intentionally minimal so it's easy to build on. Common next steps:

- **Add new automation types**: add a new key to `TASK_PROMPTS` in
  `server.js` and a matching `<option>` in `index.html`.
- **Persist history**: connect a database (e.g. SQLite/Postgres/MongoDB) to
  store past generations per user.
- **Add authentication**: gate the `/api/automate` route behind user login
  if this becomes multi-tenant.
- **File uploads**: let users upload documents (PDF/DOCX) to summarize
  directly rather than pasting text.
- **Streaming responses**: use Claude's streaming API for a live "typing"
  effect on longer outputs.
- **Workflow integrations**: connect to email (SMTP/Gmail API), calendar,
  or CRM APIs so generated content can be sent/acted on directly instead of
  just copied.

## Notes
- Never commit your real `.env` file or API key to version control.
- The current model used is `claude-sonnet-4-6`; update this in `server.js`
  if you want to point to a different model.
