# Adding API Keys to Supabase

To fix the Edge Function errors, you need to add your API keys as environment variables in your Supabase project.

## Step 1: Get Your API Keys

### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. Sign in to your account
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-`)

### ElevenLabs API Key (for Text-to-Speech)
1. Go to [ElevenLabs](https://elevenlabs.io/)
2. Sign in to your account
3. Go to your Profile → API Keys
4. Copy your API key

## Step 2: Add Environment Variables to Supabase

1. **Open your Supabase Dashboard**
   - Go to [supabase.com](https://supabase.com)
   - Sign in and select your project

2. **Navigate to Edge Functions Settings**
   - In the left sidebar, click on "Edge Functions"
   - Click on the "Settings" tab

3. **Add Environment Variables**
   - Click "Add new variable" or "Environment Variables"
   - Add these two variables:

   **Variable 1:**
   - Name: `OPENAI_API_KEY`
   - Value: Your OpenAI API key (starts with `sk-`)

   **Variable 2:**
   - Name: `ELEVENLABS_API_KEY`
   - Value: Your ElevenLabs API key

4. **Save the Variables**
   - Click "Save" or "Update" to save the environment variables

## Step 3: Redeploy Edge Functions (if needed)

The environment variables should be available immediately, but if you continue to have issues:

1. In your Supabase dashboard, go to "Edge Functions"
2. For each function (`ai-suggestions`, `improve-task`, `generate-daily-plan`, `text-to-speech`):
   - Click on the function name
   - Click "Deploy" or "Redeploy" to ensure it picks up the new environment variables

## Step 4: Test the Application

1. Go back to your application
2. Try using the AI Copilot features
3. The Edge Functions should now work with your API keys

## Troubleshooting

If you still get errors:

1. **Check API Key Format:**
   - OpenAI keys start with `sk-`
   - Make sure there are no extra spaces or characters

2. **Verify API Key Permissions:**
   - Make sure your OpenAI account has sufficient credits
   - Ensure your ElevenLabs account is active

3. **Check Supabase Logs:**
   - In Supabase dashboard, go to "Edge Functions"
   - Click on a function and check the "Logs" tab for detailed error messages

4. **Wait a Few Minutes:**
   - Sometimes it takes a few minutes for environment variables to propagate

## Security Note

- Never commit API keys to your code repository
- The environment variables in Supabase are secure and only accessible by your Edge Functions
- Your API keys are encrypted and not visible in your frontend code