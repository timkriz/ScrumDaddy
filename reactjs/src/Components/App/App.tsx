import React, {useEffect, useState} from 'react';
import './App.css';
import {AppBar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Login from "../Login/Login";
import {BrowserRouter, Route, Switch, useHistory} from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {AccountBalanceWallet, Face} from "@material-ui/icons";
import {isAuthenticated, removeToken} from "../../api/TokenService";
import Projects from "../Projects/Projects";
import Button from "@material-ui/core/Button";

function App() {
  const [ open, setOpen ] = useState<boolean>();
  const history = useHistory();

  // Redirect to login if user not logged in
  useEffect(() => {
    if(!isAuthenticated()) {
      history.push("/login");
    }

    else {
      history.push("/projects");
    }
  }, []);

  const toggleDrawer = () => {
    if(isAuthenticated()) {
      setOpen(!open);
    }
  };

  const logout = () => {
    removeToken();
    history.push("/login");
    setOpen(false);
  }

  return (
    <>
      <AppBar color="primary" position="static" style={{ zIndex: 1300 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer}>
            <Face />
          </IconButton>
          <Typography variant="h6">
            Scrum Daddy
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Toolbar />
        <div>
          <List>
            {['Projects'].map((text, index) => (
              <ListItem button key={text} onClick={() => { history.push("/projects") }}>
                <ListItemIcon><AccountBalanceWallet /></ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="contained" color="primary" onClick={logout}>LOGOUT</Button>
          </div>
        </div>
      </Drawer>

      <div className="page_container">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/projects">
            <Projects />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
