
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, params = {} } = await req.json();
    
    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Missing endpoint parameter' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Build the TMDb API URL
    const tmdbBaseUrl = 'https://api.themoviedb.org/3';
    
    // Start with the API key
    const queryParams = new URLSearchParams();
    queryParams.append('api_key', TMDB_API_KEY);
    
    // Always include the language parameter for French content
    if (!params.language) {
      queryParams.append('language', 'fr-FR');
    }
    
    // Add all additional params
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    
    // Construct the final URL
    const tmdbUrl = `${tmdbBaseUrl}${endpoint}?${queryParams.toString()}`;
    
    console.log(`Calling TMDb API: ${endpoint} with params: ${JSON.stringify(params)}`);
    
    // Call the TMDb API
    const response = await fetch(tmdbUrl);
    
    if (!response.ok) {
      console.error(`TMDb API error: ${response.status} - ${response.statusText}`);
      return new Response(
        JSON.stringify({ error: `TMDb API error: ${response.statusText}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const data = await response.json();
    console.log(`TMDb API response: Found ${data.results?.length || 0} results`);
    
    // Return the data from TMDb
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in TMDb API function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
