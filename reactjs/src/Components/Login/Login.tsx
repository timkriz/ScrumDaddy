import React, {useState} from "react";
import "./login.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {userLogin} from "../../api/AuthService";
import {setToken, setUserId, setUserRole} from "../../api/TokenService";
import {useHistory} from "react-router-dom";

export default () => {
  const [ username, setUsername ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");

  const history = useHistory();

  const login = () => {
    userLogin(username, password).then((res) => {
      const token = res.data.token;
      setToken(token);
      setUserId(res.data.userId);
      setUserRole(res.data.userRole);
      history.push("/projects");
    });
  }

  return (
    <div className="login_container">
      <div className="login_title">Scrum Daddy</div>
      <div className="login_form">
        <div className="login_header">Login</div>
        <TextField
          style={{ margin: "40px" }}
          label="Username"
          value={username}
          onChange={(e) => {setUsername(e.target.value)}}
        />
        <TextField
          style={{ margin: "0 40px" }}
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {setPassword(e.target.value)}}
        />
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "60px" }}
          onClick={login}
        >
          GO!
        </Button>
      </div>
    </div>
  )
}