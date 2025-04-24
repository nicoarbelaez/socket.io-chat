export const generateId = (prefix: string): string =>
  `${prefix}${Date.now()}-${Math.floor(Math.random() * 1_000_000)}`;
