export type ClassValue = string | number | boolean | undefined | null;

/**
 * Lightweight classNames merger without external dependencies.
 */
export function cn(...inputs: (ClassValue | ClassValue[])[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === "string") {
      classes.push(input);
    }
  }

  return classes.join(" ");
}
