import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface UserContext {
  tasks: Array<{
    title: string;
    description: string;
    priority: string;
    status: string;
  }>;
  notes: Array<{
    title: string;
    content: string;
    tags: string[];
  }>;
  habits: Array<{
    name: string;
    streak: number;
    completionRate: number;
  }>;
  recentActivity: string[];
  timeOfDay: string;
  dayOfWeek: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { userContext }: { userContext: UserContext } = await req.json()

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
            content: `Create a personalized daily plan based on the user's current tasks, habits, and productivity patterns. Return a JSON object with:
- morningFocus: specific morning routine/focus area
- afternoonGoals: main afternoon objectives
- eveningReflection: suggested evening activities
- keyPriorities: array of 3-4 top priorities for the day`
          },
          {
            role: "user",
            content: buildContextPrompt(userContext)
          }
        ],
        temperature: 0.6,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const dailyPlan = JSON.parse(data.choices[0]?.message?.content || '{}')

    return new Response(
      JSON.stringify(dailyPlan),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    )

  } catch (error) {
    console.error('Error generating daily plan:', error)
    
    return new Response(
      JSON.stringify({
        morningFocus: "Start with your most important task",
        afternoonGoals: "Focus on collaborative work and meetings",
        eveningReflection: "Review progress and plan tomorrow",
        keyPriorities: ["Complete high-priority tasks", "Maintain healthy habits", "Plan ahead"]
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

function buildContextPrompt(context: UserContext): string {
  const taskSummary = context.tasks.length > 0 
    ? `Tasks: ${context.tasks.map(t => `${t.title} (${t.priority} priority, ${t.status})`).join(', ')}`
    : 'No current tasks'

  const habitSummary = context.habits.length > 0
    ? `Habits: ${context.habits.map(h => `${h.name} (${h.streak} day streak, ${h.completionRate}% completion)`).join(', ')}`
    : 'No tracked habits'

  const notesSummary = context.notes.length > 0
    ? `Recent notes: ${context.notes.slice(0, 3).map(n => n.title).join(', ')}`
    : 'No recent notes'

  return `Current context:
Time: ${context.timeOfDay} on ${context.dayOfWeek}
${taskSummary}
${habitSummary}
${notesSummary}
Recent activity: ${context.recentActivity.join(', ')}

Analyze this data and provide insights about productivity patterns, suggest improvements, and recommend optimizations.`
}