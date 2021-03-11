import React, {useEffect, useState} from "react";
import {getUsers} from "../../api/UserService";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, {AlertProps, Color} from '@material-ui/lab/Alert';
import {IUser} from "../ProjectList/IProjectList";
import {getUserId} from "../../api/TokenService";
import UserCard from "./UserCard";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default () => {
  const [ user, setUser ] = useState<IUser>();
  const [ users, setUsers ] = useState<IUser[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const gottenUsers = (await getUsers()).data.data as IUser[];
    const thisUserId = getUserId();

    const thisUser = gottenUsers.filter(user => user._id === thisUserId)[0];
    const otherUsers = gottenUsers.filter(user => user._id !== thisUserId);

    setUser(thisUser);
    setUsers(otherUsers);
  }

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const openSnack = (message: string, severity: Color, refresh?: boolean) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setOpen(true);

    if(refresh) {
      fetchUsers();
    }
  }
  
  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={snackSeverity}>{snackMessage}</Alert>
        </Snackbar>

        { user !== undefined && <UserCard user={user} title="Update Personal Info" openSnack={openSnack} /> }

        { user !== undefined && user.role === "ADMIN" && <UserCard title="Add User" openSnack={openSnack} /> }
      </div>

      {
        user !== undefined && user.role === "ADMIN" &&
        <div style={{ display: "flex", flexDirection: "column", marginTop: 40 }}>
          <div className="page_title" style={{ alignSelf: "flex-start", fontSize: 30 }}>Manage System Users</div>
          <div style={{ display: "flex", flexWrap: "wrap", marginTop: 20 }}>
            {
              users.map((user) => (
                <UserCard key={user._id} user={user} title={user.name} openSnack={openSnack} enableDelete />
              ))
            }
          </div>
        </div>
      }
    </>
  )
}