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

    // Get OpenAI API key from environment variables (stored securely in Supabase)
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = buildContextPrompt(userContext)
    
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
            content: `You are an AI productivity copilot for LifeOS. Analyze the user's current productivity data and provide exactly 3 actionable suggestions. Each suggestion should be specific, helpful, and based on their actual data patterns.

Return your response as a JSON array with exactly 3 objects, each having:
- type: one of 'task_improvement', 'planning_tip', 'productivity_insight', 'habit_suggestion'
- title: a concise, engaging title (max 50 chars)
- content: detailed explanation with specific advice (max 200 chars)
- actionable: boolean indicating if this requires user action
- priority: 'low', 'medium', or 'high'
- icon: one of 'lightbulb', 'target', 'trending-up', 'calendar', 'zap', 'brain'

Focus on patterns in their data, time-based insights, and practical improvements.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const suggestions = JSON.parse(data.choices[0]?.message?.content || '[]')
    
    return new Response(
      JSON.stringify(suggestions.map((s: any, index: number) => ({
        ...s,
        id: `suggestion-${Date.now()}-${index}`
      }))),
      {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    )

  } catch (error) {
    console.error('Error generating AI suggestions:', error)
    
    // Return fallback suggestions
    const fallbackSuggestions = [
      {
        id: 'fallback-1',
        type: 'planning_tip',
        title: 'Time-block your day',
        content: 'Schedule specific time slots for different types of work to improve focus and reduce context switching.',
        actionable: true,
        priority: 'medium',
        icon: 'calendar'
      },
      {
        id: 'fallback-2',
        type: 'productivity_insight',
        title: 'Review your priorities',
        content: 'Take 5 minutes to ensure your current tasks align with your most important goals.',
        actionable: true,
        priority: 'high',
        icon: 'target'
      },
      {
        id: 'fallback-3',
        type: 'habit_suggestion',
        title: 'Build momentum',
        content: 'Start with your easiest habit to create positive momentum for the rest of your day.',
        actionable: true,
        priority: 'low',
        icon: 'zap'
      }
    ]

    return new Response(
      JSON.stringify(fallbackSuggestions),
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