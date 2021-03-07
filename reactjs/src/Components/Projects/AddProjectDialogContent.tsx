import React, {useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import {IProjectDialogAssign, IRole, IUser} from "./IProjects";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";

const users: IUser[] = [
  {
    id: 0,
    name: "Arne",
    surname: "Simonič"
  },
  {
    id: 1,
    name: "Luka",
    surname: "Železnik"
  },
];

const roles: IRole[] = [
  {
    id: 0,
    title: "Product Leader",
  },
  {
    id: 1,
    title: "Methodology Keeper",
  },
  {
    id: 2,
    title: "Development Team Member",
  },
];

interface IProps {
  open: boolean;
  handleClose: () => void;
}

export default ({ open, handleClose }: IProps) => {
  const [ projectTitle, setProjectTitle ] = useState<string>("");
  const [ allUsers, setAllUsers ] = useState<IUser[]>(users);
  const [ allRoles, setRoles ] = useState<IRole[]>(roles);
  const [ assignedUsers, setAssignedUsers ] = useState<IProjectDialogAssign[]>([]);

  const addAssignRow = () => {
    if(allUsers.length > 0 && allRoles.length > 0) {
      let assignedUsersCopy: IProjectDialogAssign[] = JSON.parse(JSON.stringify(assignedUsers));
      setAssignedUsers([ ...assignedUsersCopy, { userId: allUsers[0].id, roleId: allRoles[0].id } ]);
    }
  };

  const handleUserSelect = (e: any, i: number) => {
    let assignedUsersCopy: IProjectDialogAssign[] = JSON.parse(JSON.stringify(assignedUsers));
    assignedUsersCopy[i].userId = e.target.value;
    setAssignedUsers(assignedUsersCopy);
  };

  const handleRoleSelect = (e: any, i: number) => {
    let assignedUsersCopy: IProjectDialogAssign[] = JSON.parse(JSON.stringify(assignedUsers));
    assignedUsersCopy[i].roleId = e.target.value;
    setAssignedUsers(assignedUsersCopy);
  };

  const addProject = () => {
    console.log(assignedUsers);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill out the required fields to add a new project.
        </DialogContentText>
        <TextField
          label="Project Title"
          fullWidth
          value={projectTitle}
          onChange={(e) => {setProjectTitle(e.target.value)}}
        />

        <Button variant="contained" color="primary" onClick={addAssignRow} style={{ margin: "20px 0" }}>ADD USER</Button>

        {
          assignedUsers.map((assignedUser, i) => (
            <div key={i} style={{ display: "flex", margin: "10px 0", justifyContent: "space-between" }}>
              <FormControl style={{ marginRight: "20px" }}>
                <InputLabel>User</InputLabel>
                <Select
                  value={assignedUser.userId}
                  onChange={(e) => { handleUserSelect(e, i) }}
                >
                  {
                    allUsers.map((user, j) => (
                      <MenuItem key={j} value={user.id}>{user.name} {user.surname}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Role</InputLabel>
                <Select
                  value={assignedUser.roleId}
                  onChange={(e) => { handleRoleSelect(e, i) }}
                >
                  {
                    allRoles.map((role, k) => (
                      <MenuItem key={k} value={role.id}>{role.title}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </div>
          ))
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={addProject} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}