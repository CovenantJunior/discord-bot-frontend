import { createMuiTheme, colors } from '@material-ui/core';
import shadows from './shadows';
import typography from './typography';

const theme = createMuiTheme({
  palette: {
    background: {
      default: '#F4F6F8',
      paper: "#161B22"
    },
    primary: {
      contrastText: '#ffffff',
      main: '#090C10'
    },
    secondary: {
      contrastText: '#000000',
      main: '#f3d576'
    },
    text: {
      primary: '#172b4d',
      secondary: '#6b778c'
    },
    action:{
      disabled:"#b2b2b2",
      disabledBackground:"#2d2730"
    }
  },
  shadows,
  typography
});

export default theme;
