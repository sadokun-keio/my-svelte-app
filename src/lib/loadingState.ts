// Persists across client-side navigations (module state lives for the whole SPA session).
// A full page reload resets it, so the loader shows once per visit.
export const loadingState = { done: false };
