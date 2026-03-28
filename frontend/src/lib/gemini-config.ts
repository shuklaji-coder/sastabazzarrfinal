// Gemini API Configuration
// For local development: Create .env file with VITE_GEMINI_API_KEY=your_key_here
// For production: Add VITE_GEMINI_API_KEY in your hosting provider's environment variables

export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIZaSyCwdOiQ73O_aGWJ-X3NLJV_6zqvztE4WNg";

// If no API key is provided, the system will use intelligent fallback responses
// To get a free API key: https://makersuite.google.com/app/apikey
