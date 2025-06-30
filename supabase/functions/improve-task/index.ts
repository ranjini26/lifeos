import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { taskTitle, taskDescription }: { taskTitle: string; taskDescription: string } = await req.json()

    // Get OpenAI API key from environment variables
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a productivity expert. Improve the given task by making it more specific, actionable, and well-structured. Return a JSON object with:
- improvedTitle: clearer, more specific title
- improvedDescription: detailed, actionable description with clear steps
- suggestedPriority: 'low', 'medium', or 'high'
- estimatedTime: realistic time estimate (e.g., "30 minutes", "2 hours")`
          },
          {
            role: "user",
            content: `Task Title: ${taskTitle}\nTask Description: ${taskDescription}`
          }
        ],
        temperature: 0.5,
        max_tokens: 400
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const improvedTask = JSON.parse(data.choices[0]?.message?.content || '{}')

    return new Response(
      JSON.stringify(improvedTask),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    )

  } catch (error) {
    console.error('Error improving task:', error)
    
    return new Response(
      JSON.stringify({
        improvedTitle: 'Improved task title',
        improvedDescription: 'Improved task description with actionable steps',
        suggestedPriority: 'medium',
        estimatedTime: '1 hour'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    )
  }
})