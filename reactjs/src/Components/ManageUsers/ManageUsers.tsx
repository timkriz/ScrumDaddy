import React, {useState} from "react";
import {Card} from "@material-ui/core";
import CardHeader from "@material-ui/core/CardHeader";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import {postUser} from "../../api/UserService";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, {AlertProps, Color} from '@material-ui/lab/Alert';

export interface ISystemRole {
  id: string;
  title: string;
}

const roles: ISystemRole[] = [
  {
    id: "ADMIN",
    title: "Admin"
  },
  {
    id: "USER",
    title: "User"
  }
];

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default () => {
  const [ username, setUsername ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");
  const [ name, setName ] = useState<string>("");
  const [ surname, setSurname ] = useState<string>("");
  const [ email, setEmail ] = useState<string>("");
  const [ role, setRole ] = useState<string>(roles[0].id);
  const [ allRoles, setAllRoles ] = useState<ISystemRole[]>(roles);

  const [open, setOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const openSnack = (message: string, severity: Color) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setOpen(true);
  }

  const addUser = () => {
    postUser(username, password, role, name, surname, email)
      .then(() => {
        openSnack("User created successfully!", "success");
      })
      .catch(() => {
        openSnack("User creation failed!", "error");
      })
  }

  return (
    <>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={snackSeverity}>{snackMessage}</Alert>
      </Snackbar>

      <Card style={{ margin: 40 }}>
        <CardHeader title="Add User"/>
        <CardContent>
          <Typography>Credentials:</Typography>
          <div style={{ display: "flex" }}>
            <TextField
              style={{ marginRight: 20 }}
              label="Username"
              value={username}
              onChange={(e) => {setUsername(e.target.value)}}
            />
            <TextField
              label="Password"
              value={password}
              onChange={(e) => {setPassword(e.target.value)}}
            />
          </div>

          <Typography style={{ marginTop: 40 }}>Personal Info:</Typography>
          <div style={{ display: "flex" }}>
            <TextField
              style={{ marginRight: 20 }}
              label="First Name"
              value={name}
              onChange={(e) => {setName(e.target.value)}}
            />
            <TextField
              label="Last Name"
              value={surname}
              onChange={(e) => {setSurname(e.target.value)}}
            />
          </div>
          <div style={{ display: "flex", marginTop: 20 }}>
            <TextField
              style={{ marginRight: 20 }}
              label="Email"
              value={email}
              onChange={(e) => {setEmail(e.target.value)}}
            />
            <FormControl>
              <InputLabel>Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => { setRole(e.target.value as string) }}
              >
                {
                  allRoles.map((role, j) => (
                    <MenuItem key={j} value={role.id}>{role.title}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
            <Button variant="contained" color="primary" onClick={addUser}>ADD</Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}