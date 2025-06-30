import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

interface TTSOptions {
  voice_id?: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const { text, options = {} }: { text: string; options?: TTSOptions } = await req.json()

    // Get ElevenLabs API key from environment variables
    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY')
    if (!elevenLabsApiKey) {
      console.error('❌ ElevenLabs API key not configured')
      throw new Error('ElevenLabs API key not configured')
    }

    // Use the specified voice ID with enhanced settings
    const {
      voice_id = 'wDsJlOXPqcvIUKdLXjDs', // Your specified voice ID
      model_id = 'eleven_monolingual_v1',
      voice_settings = {
        stability: 0.6,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true
      }
    } = options

    console.log('🎤 Using voice ID:', voice_id)
    console.log('🔧 Voice settings:', voice_settings)

    const requestBody = {
      text: text.substring(0, 2500), // Limit text length
      model_id,
      voice_settings
    }

    console.log('📤 Sending request to ElevenLabs:', requestBody)

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsApiKey
      },
      body: JSON.stringify(requestBody)
    })

    console.log('📥 ElevenLabs response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ ElevenLabs API error:', response.status, errorText)
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const audioBlob = await response.blob()
    console.log('✅ Audio blob generated, size:', audioBlob.size)
    
    return new Response(audioBlob, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBlob.size.toString(),
        ...corsHeaders,
      }
    })

  } catch (error) {
    console.error('❌ TTS error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Text-to-speech conversion failed. Please check your API configuration.'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        }
      }
    )
  }
})