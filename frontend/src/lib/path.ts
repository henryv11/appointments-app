export const join = (...segments: string[]) =>
    segments.map(segment => segment.replace(/(^\/+|\/+$)/g, ''), '').join('/');
