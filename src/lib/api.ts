/**
 * Dynamic API endpoint resolver.
 * Directs API requests to the active full-stack container backend when hosted on static hosting like Cloudflare Pages.
 */
export const getApiUrl = (endpoint: string): string => {
  // If running in development or local sandbox, use relative path directly
  const isLocalDev = 
    window.location.hostname.includes('localhost') ||
    window.location.hostname === '127.0.0.1';

  if (isLocalDev) {
    return endpoint;
  }

  // For static platform hostings (e.g., Cloudflare Pages, GitHub Pages)
  const isStaticHost = 
    window.location.hostname.includes('pages.dev') || 
    window.location.hostname.includes('github.io') ||
    !window.location.hostname.includes('run.app'); // Any non-cloud-run external domain

  if (isStaticHost) {
    // Dynamically target the live companion server API container, which has open CORS enabled
    return `https://ais-pre-563ze6njxkrwa26btbfzba-580667136284.asia-southeast1.run.app${endpoint}`;
  }

  return endpoint;
};
