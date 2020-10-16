export const stringify = (object: Record<string, any>) =>
  '?' +
  Object.entries(object)
    .reduce(
      (query, [key, value]) => (query.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`), query),
      [] as string[],
    )
    .join('&');
