export const join = (...segments: (string | false | undefined | null)[]) =>
  segments
    .reduce<string[]>((acc, segment) => (segment && acc.push(segment.replace(/(^\/+|\/+$)/g, '')), acc), [])
    .join('/');
