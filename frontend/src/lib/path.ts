export const join = (...segments: (string | false | undefined | null)[]) =>
  segments
    .reduce<string[]>((path, segment) => (segment && path.push(segment.replace(/(^\/+|\/+$)/g, '')), path), [])
    .join('/');
