import Color from 'color';

const contrast = (color: Color, ratio = 0.8) => (color.isDark() ? color.lighten(ratio) : color.darken(ratio));

const generateCssThemeVariables = (theme: Record<string, Color>) =>
  Object.entries(theme).reduce<Record<string, string>>((acc, [key, color]) => {
    acc[`--color-${key}-hex`] = color.hex();
    acc[`--color-${key}-rgb`] = color.rgb().array().join(', ');
    acc[`--color-${key}-contrast-hex`] = contrast(color).hex();
    acc[`--color-${key}-hsl`] = color.hsl().string();
    return acc;
  }, {});

function generateCssBreakpointVariables(breakPoints: Record<string, number>) {
  const orderedBreakpoints = Object.entries(breakPoints).sort(([, v1], [, v2]) => v1 - v2);
  return orderedBreakpoints.reduce<Record<string, string>>((acc, [key, value], i) => {
    acc[`--breakpoint-${key}-min`] = `${value}px`;
    acc[`--breakpoint-${key}-max`] = `${orderedBreakpoints[i + 1]?.[1] || value + 1000}px`;
    return acc;
  }, {});
}

const themeColors = {
  dark: generateCssThemeVariables({
    primary: Color([56, 128, 255]),
    secondary: Color([61, 194, 255]),
    tertiary: Color([82, 96, 255]),
    success: Color([45, 211, 111]),
    warning: Color([255, 196, 9]),
    danger: Color([235, 68, 90]),
    dark: Color([34, 36, 40]),
    medium: Color([146, 148, 156]),
    light: Color([244, 245, 248]),
  }),
};

const breakpoints = generateCssBreakpointVariables({
  desktop: 1024,
  tablet: 768,
  phone: 420,
});

export const setTheme = (theme: Theme = 'dark') =>
  Object.entries({ ...themeColors[theme], ...breakpoints }).forEach(([key, value]) => {
    document.body.style.setProperty(key, value);
  });

export type Theme = keyof typeof themeColors;
