import React, {useState} from "react";
import "./login.css";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {userLogin} from "../../api/AuthService";
import {setToken, setUserId, setUserRole} from "../../api/TokenService";
import {useHistory} from "react-router-dom";
import {Alert, Color} from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";

export default () => {
  const [ username, setUsername ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const history = useHistory();

  const login = () => {
    userLogin(username, password)
      .then((res) => {
        const token = res.data.token;
        setToken(token);
        setUserId(res.data.userId);
        setUserRole(res.data.userRole);
        history.push("/projects");
      })
      .catch(() => {
        openSnack("Incorrect username or password!", "error");
      });
  }

  const closeSnack = () => {
    setSnackOpen(false);
  }

  const openSnack = (message: string, severity: Color) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  }

  return (
    <>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackOpen} autoHideDuration={6000} onClose={closeSnack}>
        <Alert variant="filled" onClose={closeSnack} severity={snackSeverity}>{snackMessage}</Alert>
      </Snackbar>

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
    </>
  )
}