import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

declare module '@material-ui/core/styles/createMixins' {
  interface Mixins {
    drawer: CSSProperties;
  }
}

export const mainTheme = responsiveFontSizes(
  createMuiTheme({
    mixins: {
      toolbar: {
        height: 80,
      },
      drawer: {
        width: 240,
        minWidth: 60,
      },
    },
  }),
);
