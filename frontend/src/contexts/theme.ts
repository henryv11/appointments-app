import { createReducerContext } from '@/lib/react/create-reducer-context';
import { setTheme, Theme } from '@/lib/theme';

setTheme('dark');

export const [ThemeContextProvider, ThemeContextConsumer, useThemeContext] = createReducerContext<ThemeState, Theme>(
  { theme: 'dark' },
  (_, theme: Theme) => (setTheme(theme), { theme }),
);

interface ThemeState {
  theme: Theme;
}
