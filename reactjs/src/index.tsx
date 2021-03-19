import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App/App';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {ThemeProvider} from '@material-ui/styles';
import teal from "@material-ui/core/colors/teal";
import {BrowserRouter} from "react-router-dom";
import cyan from "@material-ui/core/colors/cyan";
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: ['Roboto:300,400,500,700,900']
  }
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: teal[400],
    },
    secondary: {
      main: cyan[700],
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
