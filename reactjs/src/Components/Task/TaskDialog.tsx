import React, {useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {ITask, ITaskDialogAssign, ITaskUser, IUser} from "./ITaskList";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {Color} from "@material-ui/lab";
import {ClearRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {getProjectUsers} from "../../api/ProjectService";
//import {getTask, postTask, putTask} from "../../api/TaskService";
//import {ITask} from "../TaskList/ITaskList";

interface IProps {
  projectId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
  editId?: string;
}

export default ({ projectId, open, handleClose, openSnack, editId }: IProps) => {
  const [ TaskTitle, setTaskTitle ] = useState<string>("");
  const [ TaskDescription, setTaskDescription ] = useState<string>("");
  const [ TaskTime, setTaskTime] = useState<number>(10);
  const [ projectUsers, setProjectUsers ] = useState<IUser[]>([]);
  const [ assignedUsers, setAssignedUsers ] = useState<ITaskDialogAssign[]>([]);


  useEffect(() => {
    if(open) {
      // Fetch project users
      if(editId !== undefined) {
        fetchProjectUsers();
      }

      // Clear the fields
      else {
        setTaskTitle("");
        setTaskDescription("");
        setTaskTime(0);
        setAssignedUsers([]);
      }
    }
  }, [ open ]);


  const fetchProjectUsers = async () => {
    if(editId !== undefined) {
      // Project Users
      const gottenProjectUsers = (await getProjectUsers(editId)).data.data as ITaskUser[];
      let newAssignedUsers: ITaskDialogAssign[] = [];
      gottenProjectUsers.forEach(user => {
        const newAssign: ITaskDialogAssign = { userId: user.userId };
        newAssignedUsers.push(newAssign);
      });
      setAssignedUsers(newAssignedUsers);
    }
  };
/*
  const fetchTask = async () => {
    if(editId !== undefined) {
      const gottenTask = (await getTask(projectId, editId)).data.data as ITask;

      setTaskTitle(gottenTask.TaskName);
      setTaskDescription(gottenTask.TaskDescription);
      setTaskTime(gottenTask.TaskTime);
    }
  }

  const confirmAction = async () => {
    // Edit Task
    if(editId !== undefined) {
      try {
        await putTask(projectId, editId, TaskTitle, TaskDescription, TaskTime);

        openSnack("Task updated successfully!", "success", true);
        handleClose();
      } catch (e) {
        openSnack("Task update failed!", "error");
      }
    }

    // Add Task
    else {
      try {
        await postTask(projectId, TaskTitle, TaskDescription, TaskTime);

        openSnack("Task created successfully!", "success", true);
        handleClose();
      } catch (e) {
        openSnack("Task creation failed!", "error");
      }
    }
  };
  */

  const addAssignRow = () => {
    if(projectUsers.length > 0) {
      let assignedUsersCopy: ITaskDialogAssign[] = JSON.parse(JSON.stringify(assignedUsers));
      setAssignedUsers([ ...assignedUsersCopy, { userId: projectUsers[0]._id}]);
    }
  };

  const deleteAssignRow = (i: number) => {
    let assignedUsersCopy: ITaskDialogAssign[] = JSON.parse(JSON.stringify(assignedUsers));
    assignedUsersCopy = assignedUsersCopy.filter((assignedUser, j) => i !== j);
    setAssignedUsers(assignedUsersCopy);
  };

  const handleUserSelect = (e: any, i: number) => {
    let assignedUsersCopy: ITaskDialogAssign[] = JSON.parse(JSON.stringify(assignedUsers));
    assignedUsersCopy[i].userId = e.target.value;
    setAssignedUsers(assignedUsersCopy);
  };




  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{ editId !== undefined ? "Edit" : "Add" } Task</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill out the required fields to { editId !== undefined ? "edit" : "add" } a task.
        </DialogContentText>
        <TextField
          label="Task Title"
          fullWidth
          value={TaskTitle}
          onChange={(e) => {setTaskTitle(e.target.value)}}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Task description"
          fullWidth
          multiline
          rowsMax={4}
          value={TaskDescription}
          onChange={(e) => {setTaskDescription(e.target.value)}}
          variant="outlined"
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Task Time Estimate"
          type="number"
          value={TaskTime}
          onChange={(e) => {setTaskTime(e.target.value as unknown as number)}}
        />

        <Button variant="contained" color="primary" onClick={addAssignRow} style={{ margin: "20px 0",float: 'right' }}>ASSIGN USER</Button>

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
                      projectUsers.map((user, j) => (
                        <MenuItem key={j} value={user._id}>{user.name} {user.surname}</MenuItem>
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
        <Button onClick={handleClose} color="primary">
          { editId !== undefined ? "Confirm changes" : "Add" }
        </Button>
      </DialogActions>
    </Dialog>
  )
}