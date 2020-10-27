import Color from 'color';

const contrast = (color: Color, ratio = 0.8) => (color.isDark() ? color.lighten(ratio) : color.darken(ratio));

const generateCssThemeVariables = (theme: Record<ColorKey, Color>) =>
  Object.entries(theme).reduce((acc, [key, color]) => {
    acc[`--color-${key}-hex`] = color.hex();
    acc[`--color-${key}-rgb`] = color.rgb().array().join(', ');
    acc[`--color-${key}-contrast-hex`] = contrast(color).hex();
    acc[`--color-${key}-hsl`] = color.hsl().string();
    return acc;
  }, {} as Record<string, string>);

const themes = {
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

export const setTheme = (theme: Theme = 'dark') =>
  Object.entries(themes[theme]).forEach(([key, value]) => {
    document.body.style.setProperty(key, value);
  });

export type Theme = keyof typeof themes;

type ColorKey = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'danger' | 'dark' | 'medium' | 'light';
