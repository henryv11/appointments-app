import { createReducerContext } from '@/lib/create-reducer-context';
import { setTheme, Theme } from '@/lib/theme';

setTheme('dark');

const [ThemeContextProvider, ThemeContextConsumer, useThemeContext] = createReducerContext<ThemeState, Theme>(
  { theme: 'dark' },
  (_, theme: Theme) => (setTheme(theme), { theme }),
);

interface ThemeState {
  theme: Theme;
}

export { ThemeContextProvider, ThemeContextConsumer, useThemeContext };
