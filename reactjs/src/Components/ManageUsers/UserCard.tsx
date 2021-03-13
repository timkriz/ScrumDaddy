import React, {useEffect, useState} from "react";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import {Card} from "@material-ui/core";
import {systemRoles} from "../../data/Roles";
import {deleteUser, patchUser, postUser} from "../../api/UserService";
import {IUser} from "../ProjectList/IProjectList";
import {Color} from "@material-ui/lab";

interface IProps {
  user?: IUser;
  title: string;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
  enableDelete?: boolean;
  noRole?: boolean;
}

export default ({ user, title, openSnack, enableDelete, noRole }: IProps) => {
  const [ username, setUsername ] = useState<string>("");
  const [ password, setPassword ] = useState<string>("");
  const [ name, setName ] = useState<string>("");
  const [ surname, setSurname ] = useState<string>("");
  const [ email, setEmail ] = useState<string>("");
  const [ role, setRole ] = useState<string>(systemRoles[0].id);

  useEffect(() => {
    if(user !== undefined) {
      setUsername(user.username);
      setName(user.name);
      setSurname(user.surname);
      setEmail(user.email);
      setRole(user.role);
    }
  }, []);

  const confirmAction = () => {
    // Update existing user
    if(user !== undefined) {
      patchUser(user._id, username, password, role, name, surname, email)
        .then(() => {
          openSnack("User updated successfully!", "success", true);
        })
        .catch(() => {
          openSnack("User update failed!", "error");
        })
    }

    // Create new user
    else {
      postUser(username, password, role, name, surname, email)
        .then(() => {
          openSnack("User created successfully!", "success", true);
        })
        .catch(() => {
          openSnack("User creation failed!", "error");
        })
    }
  }

  const deleteClickedUser = (id: string) => {
    deleteUser(id)
      .then(() => {
        openSnack("User deleted successfully!", "success", true);
      })
      .catch(() => {
        openSnack("User deleted failed!", "error");
      })
  }

  return (
    <Card style={{ minWidth: 400, marginRight: 20, marginTop: 10 }}>
      <CardHeader title={title}/>
      <CardContent>
        <Typography style={{ color: "#0097a7", fontWeight: 500 }}>Credentials:</Typography>
        <div style={{ display: "flex", marginTop: 10 }}>
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

        <Typography style={{ marginTop: 40, color: "#0097a7", fontWeight: 500 }}>Personal Info:</Typography>
        <div style={{ display: "flex", marginTop: 10 }}>
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

          {
            !noRole &&
            <FormControl>
                <InputLabel>Role</InputLabel>
                <Select
                    value={role}
                    onChange={(e) => { setRole(e.target.value as string) }}
                >
                  {
                    systemRoles.map((role, j) => (
                      <MenuItem key={j} value={role.id}>{role.title}</MenuItem>
                    ))
                  }
                </Select>
            </FormControl>
          }

        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: 40 }}>
          { user && enableDelete && <Button variant="contained" color="primary" style={{ marginRight: 10 }} onClick={() => deleteClickedUser(user._id)}>DELETE</Button> }
          <Button variant="contained" color="primary" onClick={confirmAction}>{ user ? "UPDATE" : "ADD" }</Button>
        </div>
      </CardContent>
    </Card>
  )
}