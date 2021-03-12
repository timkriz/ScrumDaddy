import React, {useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import {IProject, IProjectDialogAssign, IProjectUser, IUser} from "./IProjectList";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import {projectRoles} from "../../data/Roles";
import {
  deleteProjectUsers,
  getProject,
  getProjectUsers,
  postProject,
  postProjectUser,
  putProject
} from "../../api/ProjectService";
import {getUsers} from "../../api/UserService";
import {Color} from "@material-ui/lab";
import {ClearRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

interface IProps {
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
  editId?: string;
}

export default ({ open, handleClose, openSnack, editId }: IProps) => {
  const [ projectTitle, setProjectTitle ] = useState<string>("");
  const [ projectDescription, setProjectDescription ] = useState<string>("");
  const [ allUsers, setAllUsers ] = useState<IUser[]>([]);
  const [ assignedUsers, setAssignedUsers ] = useState<IProjectDialogAssign[]>([]);

  // Fetch all users
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if(open) {
      // Fetch project details, users and fill out the fields
      if(editId !== undefined) {
        fetchProject();
      }

      // Clear the fields
      else {
        setProjectTitle("");
        setProjectDescription("");
        setAssignedUsers([]);
      }
    }
  }, [ open ]);

  const fetchUsers = async () => {
    const users = (await getUsers()).data.data as IUser[];
    setAllUsers(users);
  }

  const fetchProject = async () => {
    if(editId !== undefined) {
      // Project
      const gottenProject = (await getProject(editId)).data.data as IProject;
      setProjectTitle(gottenProject.name);
      setProjectDescription(gottenProject.description);

      // Project Users
      const gottenProjectUsers = (await getProjectUsers(editId)).data.data as IProjectUser[];
      let newAssignedUsers: IProjectDialogAssign[] = [];
      gottenProjectUsers.forEach(user => {
        const newAssign: IProjectDialogAssign = { userId: user.userId, roleId: user.userRole };
        newAssignedUsers.push(newAssign);
      });
      setAssignedUsers(newAssignedUsers);
    }
  };

  const addAssignRow = () => {
    if(allUsers.length > 0) {
      let assignedUsersCopy: IProjectDialogAssign[] = JSON.parse(JSON.stringify(assignedUsers));
      setAssignedUsers([ ...assignedUsersCopy, { userId: allUsers[0]._id, roleId: projectRoles[0].id } ]);
    }
  };

  const deleteAssignRow = (i: number) => {
    let assignedUsersCopy: IProjectDialogAssign[] = JSON.parse(JSON.stringify(assignedUsers));
    assignedUsersCopy = assignedUsersCopy.filter((assignedUser, j) => i !== j);
    setAssignedUsers(assignedUsersCopy);
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

  const confirmAction = async () => {
    // Edit project
    if(editId !== undefined) {
      try {
        // PUT the project
        await putProject(editId, projectTitle, projectDescription);

        // DELETE the assigned users
        await deleteProjectUsers(editId);

        // POST new assigned users
        for (let i = 0; i < assignedUsers.length; i++) {
          await postProjectUser(editId, assignedUsers[i].userId, assignedUsers[i].roleId);
        }

        openSnack("Project updated successfully!", "success", true);
        handleClose();
      } catch (e) {
        openSnack("Project update failed!", "error");
      }
    }

    // Add project
    else {
      try {
        const newProject = (await postProject(projectTitle, projectDescription)).data.data as IProject;

        for(let i = 0; i < assignedUsers.length; i++) {
          await postProjectUser(newProject._id, assignedUsers[i].userId, assignedUsers[i].roleId);
        }

        openSnack("Project created successfully!", "success", true);
        handleClose();
      } catch (e) {
        openSnack("Project creation failed!", "error");
      }
    }
  };
  
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{ editId !== undefined ? "Edit" : "Add" } Project</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill out the required fields to { editId !== undefined ? "edit" : "add" } a project.
        </DialogContentText>
        <TextField
          label="Project Title"
          fullWidth
          value={projectTitle}
          onChange={(e) => {setProjectTitle(e.target.value)}}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Project Description"
          fullWidth
          multiline
          value={projectDescription}
          onChange={(e) => {setProjectDescription(e.target.value)}}
        />

        <Button variant="contained" color="primary" onClick={addAssignRow} style={{ margin: "20px 0" }}>ADD USER</Button>

        {
          assignedUsers.map((assignedUser, i) => (
            <div key={i} style={{ display: "flex", margin: "10px 0", justifyContent: "space-between" }}>
              <div>
                <FormControl style={{ marginRight: "20px" }}>
                  <InputLabel>User</InputLabel>
                  <Select
                    value={assignedUser.userId}
                    onChange={(e) => { handleUserSelect(e, i) }}
                  >
                    {
                      allUsers.map((user, j) => (
                        <MenuItem key={j} value={user._id}>{user.name} {user.surname}</MenuItem>
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
                      projectRoles.map((role, k) => (
                        <MenuItem key={k} value={role.id}>{role.title}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </div>

              <div>
                <IconButton color="primary" onClick={() => deleteAssignRow(i)}>
                  <ClearRounded />
                </IconButton>
              </div>
            </div>
          ))
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={confirmAction} color="primary">
          { editId !== undefined ? "CONFIRM CHANGES" : "ADD" }
        </Button>
      </DialogActions>
    </Dialog>
  )
}