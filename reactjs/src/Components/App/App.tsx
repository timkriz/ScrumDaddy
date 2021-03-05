import React from 'react';
import './App.css';
import {AppBar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from "@material-ui/core/Toolbar";
import Login from "../Login/Login";

function App() {
  return (
    <>
      <AppBar color="primary" position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
            Scrum Daddy
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="page_container">
        <Login />
      </div>
    </>
  );
}

export default App;
