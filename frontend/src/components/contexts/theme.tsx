import MakeContext from '@/components/higher-order/make-context';
import { setTheme, Theme } from '@/lib/theme';

setTheme('dark');

const [ThemeContextProvider, useThemeContext] = MakeContext<ThemeState, Theme>(
  { theme: 'dark' },
  (_, theme: Theme) => (setTheme(theme), { theme }),
);

interface ThemeState {
  theme: Theme;
}

export { ThemeContextProvider, useThemeContext };
