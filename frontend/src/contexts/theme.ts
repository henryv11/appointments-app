import { createReducerContext } from '@/lib/react/create-reducer-context';
import { colors, setTheme, Theme } from '@/lib/theme';

const defaultTheme = 'dark' as const;

setTheme(defaultTheme);

export const [ThemeContextProvider, ThemeContextConsumer, useThemeContext] = createReducerContext<ThemeState, Theme>(
  { theme: defaultTheme, colors: colors[defaultTheme] },
  (_, theme: Theme) => (setTheme(theme), { theme, colors: colors[theme] }),
);

interface ThemeState {
  theme: Theme;
  colors: typeof colors[Theme];
}
