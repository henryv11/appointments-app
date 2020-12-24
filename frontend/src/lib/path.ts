export function join(...segments: (string | false | undefined | null)[]) {
  return segments
    .reduce<string[]>((path, segment) => (segment && path.push(segment.replace(/(^\/+|\/+$)/g, '')), path), [])
    .join('/');
}
