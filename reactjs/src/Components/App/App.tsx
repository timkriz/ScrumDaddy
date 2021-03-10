import React, {useEffect, useState} from 'react';
import './App.css';
import {AppBar} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Login from "../Login/Login";
import {Route, Switch, useHistory} from "react-router-dom";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {AccountBalanceWallet, Face} from "@material-ui/icons";
import {isAuthenticated, removeToken} from "../../api/TokenService";
import ProjectList from "../ProjectList/ProjectList";
import Button from "@material-ui/core/Button";
import {drawerItems} from "../../data/DrawerItems";
import ManageUsers from "../ManageUsers/ManageUsers";
import ProductBacklog from "../ProductBacklog/ProductBacklog";
import Project from "../Project/Project";

function App() {
  const [ open, setOpen ] = useState<boolean>();
  const history = useHistory();

  // Redirect to login if user not logged in
  useEffect(() => {
    if(!isAuthenticated()) {
      history.push("/login");
    }
  }, []);

  const toggleDrawer = () => {
    if(isAuthenticated()) {
      setOpen(!open);
    }

    else {
      history.push("/login");
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
        <Toolbar style={{ width: 250 }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div>
            <List>
              {
                drawerItems.map((item, i, index) => (
                  <ListItem button key={i} onClick={() => { history.push(item.path); toggleDrawer(); }}>
                    <ListItemIcon>
                      <AccountBalanceWallet />
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItem>
                ))
              }
            </List>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Button variant="contained" color="primary" onClick={logout}>LOGOUT</Button>
          </div>
        </div>
      </Drawer>

      <div className="page_container">
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route exact path="/projects">
            <ProjectList />
          </Route>
          <Route path="/projects/:projectId">
            <Project />
          </Route>
          <Route path="/manage_users">
            <ManageUsers />
          </Route>
          <Route path="/product_backlog">
            <ProductBacklog />
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
