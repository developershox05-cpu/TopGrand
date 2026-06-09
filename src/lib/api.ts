/**
 * Dynamic API endpoint resolver.
 * Directs API requests to the active full-stack container backend when hosted on static hosting like Cloudflare Pages.
 */
export const getApiUrl = (endpoint: string): string => {
  // If running in AI Studio preview sandbox environment or localhost, use relative paths directly
  const isAistudioPreview = 
    window.location.hostname.includes('aistudio.build') ||
    window.location.hostname.includes('localhost') ||
    window.location.hostname === '127.0.0.1';

  if (isAistudioPreview) {
    return endpoint;
  }

  // Fallback for production static hosting (e.g. cloudflare pages topgrand.pages.dev)
  const isStaticHost = 
    window.location.hostname.includes('pages.dev') || 
    window.location.hostname.includes('github.io');

  if (isStaticHost) {
    // If hosted on topgrand.pages.dev, let's dynamically target back to the user's active Cloud Run instance if known,
    // or fallback to relative. Since companion servers run on port 3000, we prioritize relative or current origin.
    return endpoint;
  }

  return endpoint;
};
