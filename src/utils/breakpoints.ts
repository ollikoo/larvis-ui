export type Breakpoint = "xl" | "md" | "xs";

/**
 * Get breakpoint based on width
 */
export const getBreakpoint = (width: number): Breakpoint => {
  if (width >= breakpoints.xl) {
    return "xl";
  }
  if (width >= breakpoints.md) {
    return "md";
  }
  return "xs";
};

/**
 * Breakpoints for different screen sizes
 */
export const breakpoints: Record<Breakpoint, number> = {
  xl: 1200,
  md: 768,
  xs: 0,
} as const;
