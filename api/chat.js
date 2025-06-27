// Serverless function for OpenAI chat API
const axios = require('axios');

// This function will be executed when the endpoint is called
module.exports = async (req, res) => {
  // Log request information for debugging
  console.log('API Request received:', { 
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body ? { modelId: req.body.modelId } : null // Log only non-sensitive parts
  });
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, modelId } = req.body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }
    
    // Use the provided model ID or default to gpt-4o
    const model = modelId || 'gpt-4o';
    
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('OPENAI_API_KEY environment variable is not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }
    
    // Log that we have a valid API key (without revealing the key)
    console.log('API key is configured and available');
    
    console.log(`Making request to OpenAI API with model: ${model}`);
    
    // Call OpenAI API with timeout and retry logic
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    console.log('OpenAI API response received successfully');
    
    return res.json(response.data);
  } catch (error) {
    // Detailed error logging
    console.error('Error calling OpenAI API:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      code: error.code,
      stack: error.stack
    });
    
    // Check for specific error types
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Request to OpenAI timed out' });
    }
    
    if (error.response?.status === 401) {
      return res.status(401).json({ error: 'Invalid API key or authentication error' });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded with OpenAI API' });
    }
    
    return res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error?.message || 'Failed to get a response from OpenAI',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
