# AI Chatbot Setup Guide

## Quick Setup

To enable the AI-powered chatbot with OpenAI GPT-4, you need to add your OpenAI API key to your environment variables.

### Step 1: Get your OpenAI API Key
1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key or use an existing one
3. Copy the API key (starts with `sk-`)

### Step 2: Add to Environment
Create a `.env` file in your project root and add:

```bash
VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
```

### Step 3: Restart Development Server
```bash
npm run dev
```

## Features

✅ **Context-Aware Responses** - Knows about the current portfolio item being viewed
✅ **Conversation Memory** - Maintains context throughout the conversation  
✅ **Project-Specific Knowledge** - Detailed information about each video project
✅ **Fallback Responses** - Works even without API key (with smart fallbacks)
✅ **Professional Tone** - Responds as Kilah's knowledgeable AI assistant

## Usage Examples

- "Tell me about this project"
- "What techniques did Kilah use here?"
- "How can I hire Kilah for my brand?"
- "What's her creative process like?"

## Security Note

⚠️ **Important**: This setup uses client-side API calls for demo purposes. For production, implement server-side API calls to protect your API key.

## Cost Management

The chatbot uses GPT-4o-mini model which is cost-effective:
- ~$0.0001 per 1K tokens
- Most conversations cost less than $0.01
- Responses are limited to 200 tokens to control costs

## Without API Key

The chatbot still works with intelligent fallback responses that provide detailed information about Kilah's portfolio and creative work. 