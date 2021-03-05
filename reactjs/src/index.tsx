import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App/App';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {ThemeProvider} from '@material-ui/styles';
import teal from "@material-ui/core/colors/teal";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[400],
    },
    secondary: {
      main: '#11cb5f',
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
