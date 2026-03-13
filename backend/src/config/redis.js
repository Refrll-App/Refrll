// Redis removed — RTK Query handles frontend caching
// MongoDB handles all data at current scale (5k users)
// Re-add Redis/Upstash when you need server-side caching at 50k+ users
export const cached = async (key, ttlSeconds, fetchFn) => {
  return await fetchFn();
};
