/** Join class names (shadcn-style helper without Tailwind requirement). */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
