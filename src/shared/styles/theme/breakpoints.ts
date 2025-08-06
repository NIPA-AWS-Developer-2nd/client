export const breakpoints = {
  mobile: "768px",
  tablet: "1024px",
  desktop: "1200px",
} as const;

export const breakpointValues = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
} as const;

export type Breakpoints = typeof breakpoints;