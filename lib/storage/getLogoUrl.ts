/**
 * Get logo URL with fallback
 * 1. First try Supabase Storage
 * 2. Fall back to external URL
 * 3. Finally show initials placeholder
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const BUCKET_NAME = 'ai-logos';

// Map of tool IDs to their storage file names and fallback URLs
const logoMap: Record<string, { storageId: string; fallbackUrl: string }> = {
  'ChatGPT': { storageId: 'chatgpt', fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
  'Claude': { storageId: 'claude', fallbackUrl: 'https://www.anthropic.com/images/icons/apple-touch-icon.png' },
  'GEMINI': { storageId: 'gemini', fallbackUrl: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
  'Midjourney': { storageId: 'midjourney', fallbackUrl: 'https://cdn.worldvectorlogo.com/logos/midjourney-1.svg' },
  'DALL-E 3': { storageId: 'dalle', fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
  'Runway': { storageId: 'runway', fallbackUrl: 'https://asset.brandfetch.io/idSFZwYhgE/idNVL6UQbQ.png' },
  'GitHub Copilot': { storageId: 'github-copilot', fallbackUrl: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' },
  'Cursor': { storageId: 'cursor', fallbackUrl: 'https://www.cursor.com/apple-touch-icon.png' },
  'ElevenLabs': { storageId: 'elevenlabs', fallbackUrl: 'https://elevenlabs.io/favicon.ico' },
  'Suno': { storageId: 'suno', fallbackUrl: 'https://suno.com/favicon.ico' },
  'Framer': { storageId: 'framer', fallbackUrl: 'https://www.framer.com/images/favicons/apple-touch-icon.png' },
  'Zapier AI': { storageId: 'zapier', fallbackUrl: 'https://zapier.com/apple-touch-icon.png' },
  'Jasper': { storageId: 'jasper', fallbackUrl: 'https://www.jasper.ai/favicon.ico' },
  'Copy.ai': { storageId: 'copyai', fallbackUrl: 'https://www.copy.ai/favicon.ico' },
  'Perplexity': { storageId: 'perplexity', fallbackUrl: 'https://www.perplexity.ai/favicon.ico' },
  'Writesonic': { storageId: 'writesonic', fallbackUrl: 'https://writesonic.com/favicon.ico' },
  'Rytr': { storageId: 'rytr', fallbackUrl: 'https://rytr.me/favicon.ico' },
  'QuillBot': { storageId: 'quillbot', fallbackUrl: 'https://quillbot.com/favicon.ico' },
  'Wordtune': { storageId: 'wordtune', fallbackUrl: 'https://www.wordtune.com/favicon.ico' },
  'Grammarly': { storageId: 'grammarly', fallbackUrl: 'https://static.grammarly.com/assets/files/efe57d016d9efff36da7884c193b646b/favicon.ico' },
  'Stable Diffusion': { storageId: 'stable-diffusion', fallbackUrl: 'https://stability.ai/favicon.ico' },
  'Leonardo AI': { storageId: 'leonardo', fallbackUrl: 'https://leonardo.ai/favicon.ico' },
  'Canva AI': { storageId: 'canva', fallbackUrl: 'https://static.canva.com/static/images/favicon.ico' },
  'Adobe Firefly': { storageId: 'adobe-firefly', fallbackUrl: 'https://www.adobe.com/favicon.ico' },
  'Pika Labs': { storageId: 'pika', fallbackUrl: 'https://pika.art/favicon.ico' },
  'Ideogram': { storageId: 'ideogram', fallbackUrl: 'https://ideogram.ai/favicon.ico' },
  'Udio': { storageId: 'udio', fallbackUrl: 'https://www.udio.com/favicon.ico' },
  'Mubert': { storageId: 'mubert', fallbackUrl: 'https://mubert.com/favicon.ico' },
  'AIVA': { storageId: 'aiva', fallbackUrl: 'https://www.aiva.ai/favicon.ico' },
  'Soundraw': { storageId: 'soundraw', fallbackUrl: 'https://soundraw.io/favicon.ico' },
  'Boomy': { storageId: 'boomy', fallbackUrl: 'https://boomy.com/favicon.ico' },
  'Descript': { storageId: 'descript', fallbackUrl: 'https://www.descript.com/favicon.ico' },
  'Webflow': { storageId: 'webflow', fallbackUrl: 'https://webflow.com/favicon.ico' },
  '10Web': { storageId: '10web', fallbackUrl: 'https://10web.io/favicon.ico' },
  'Wix ADI': { storageId: 'wix', fallbackUrl: 'https://www.wix.com/favicon.ico' },
  'Durable': { storageId: 'durable', fallbackUrl: 'https://durable.co/favicon.ico' },
  'Hostinger AI': { storageId: 'hostinger', fallbackUrl: 'https://www.hostinger.com/favicon.ico' },
  'Squarespace': { storageId: 'squarespace', fallbackUrl: 'https://www.squarespace.com/favicon.ico' },
  'Tabnine': { storageId: 'tabnine', fallbackUrl: 'https://www.tabnine.com/favicon.ico' },
  'Replit AI': { storageId: 'replit', fallbackUrl: 'https://replit.com/public/icons/favicon.ico' },
  'Codeium': { storageId: 'codeium', fallbackUrl: 'https://codeium.com/favicon.ico' },
  'Amazon Q': { storageId: 'amazon-q', fallbackUrl: 'https://a0.awsstatic.com/libra-css/images/site/fav/favicon.ico' },
  'Sourcegraph Cody': { storageId: 'sourcegraph', fallbackUrl: 'https://sourcegraph.com/favicon.ico' },
  'Make': { storageId: 'make', fallbackUrl: 'https://www.make.com/favicon.ico' },
  'n8n': { storageId: 'n8n', fallbackUrl: 'https://n8n.io/favicon.ico' },
  'Bardeen': { storageId: 'bardeen', fallbackUrl: 'https://www.bardeen.ai/favicon.ico' },
  'Axiom': { storageId: 'axiom', fallbackUrl: 'https://axiom.ai/favicon.ico' },
  'Magical': { storageId: 'magical', fallbackUrl: 'https://www.getmagical.com/favicon.ico' },
  'Duolingo Max': { storageId: 'duolingo', fallbackUrl: 'https://d35aaqx5ub95lt.cloudfront.net/favicon.ico' },
  'Khanmigo': { storageId: 'khanmigo', fallbackUrl: 'https://cdn.kastatic.org/images/favicon.ico' },
  'Quizlet': { storageId: 'quizlet', fallbackUrl: 'https://quizlet.com/favicon.ico' },
  'Photomath': { storageId: 'photomath', fallbackUrl: 'https://photomath.com/favicon.ico' },
  'Socratic': { storageId: 'socratic', fallbackUrl: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
  'HubSpot AI': { storageId: 'hubspot', fallbackUrl: 'https://www.hubspot.com/favicon.ico' },
  'Surfer SEO': { storageId: 'surfer', fallbackUrl: 'https://surferseo.com/favicon.ico' },
  'AdCreative.ai': { storageId: 'adcreative', fallbackUrl: 'https://www.adcreative.ai/favicon.ico' },
  'Frase': { storageId: 'frase', fallbackUrl: 'https://www.frase.io/favicon.ico' },
  'MarketMuse': { storageId: 'marketmuse', fallbackUrl: 'https://www.marketmuse.com/favicon.ico' },
  'OpenAI API': { storageId: 'openai-api', fallbackUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg' },
  'Google AI Studio': { storageId: 'google-ai-studio', fallbackUrl: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg' },
  'Anthropic API': { storageId: 'anthropic-api', fallbackUrl: 'https://www.anthropic.com/images/icons/apple-touch-icon.png' },
  'Hugging Face': { storageId: 'huggingface', fallbackUrl: 'https://huggingface.co/favicon.ico' },
  'Replicate': { storageId: 'replicate', fallbackUrl: 'https://replicate.com/favicon.ico' },
};

/**
 * Get the Supabase storage URL for a tool logo
 */
export function getStorageLogoUrl(toolName: string, extension: string = 'png'): string | null {
  const config = logoMap[toolName];
  if (!config || !SUPABASE_URL) return null;

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/${config.storageId}.${extension}`;
}

/**
 * Get the fallback URL for a tool logo
 */
export function getFallbackLogoUrl(toolName: string): string | null {
  return logoMap[toolName]?.fallbackUrl || null;
}

/**
 * Get logo info for a tool
 */
export function getLogoInfo(toolName: string): { storageId: string; fallbackUrl: string } | null {
  return logoMap[toolName] || null;
}
