import React, {useState} from "react";
import "./login.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default () => {
  const [ username, setUsername ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");

  const login = () => {
    console.log(username);
    console.log(password);
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