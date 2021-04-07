import React, {useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {Color} from "@material-ui/lab";
import moment, {Moment} from "moment"
import {DatePicker} from "@material-ui/pickers";
import {getTask, postTask, putTask} from "../../api/TaskService";
import {getUsers} from "../../api/UserService";
import {ITask, IUser, IProjectUser, IProjectDialogAssign} from "../ProjectList/IProjectList";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {getProjectUsers} from "../../api/ProjectService";
import { isNonNullExpression } from "typescript";
import { ContactSupportOutlined } from "@material-ui/icons";


interface IProps {
  projectId: string;
  sprintId: string;
  storyId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
  editId?: string;
}

export default ({ projectId, sprintId, storyId, open, handleClose, openSnack, editId }: IProps) => {
  const [ taskName, setTaskName ] = useState<string>("");
  const [ taskDescription, setTaskDescription ] = useState<string>("");
  const [ taskTimeEstimate, setTaskTimeEstimate] = useState<number>(1);
  const [ taskTimeLog, setTaskTimeLog] = useState<number>(0);
  const [ projectUsers, setProjectUsers ] = useState<IProjectUser[]>([]);
  const [ allUsers, setAllUsers ] = useState<IUser[]>([]);
  const [ taskSuggestedUser, setTaskSuggestedUser] = useState<string>("");
  const [ assignedUsers, setAssignedUsers ] = useState<IProjectDialogAssign[]>([]);

  

  // Fetch all users
  useEffect(() => {
    fetchProjectUsers();
    fetchAllUsers();
  }, []);

  useEffect(() => {
    if(open) {
      // Fetch task and fill out the fieldss
      if(editId !== undefined) {
        fetchTask();
      }
      // Clear the fields
      else {
        fetchProjectUsers();
        fetchAllUsers();
        setTaskName("");
        setTaskDescription("");
        setTaskTimeEstimate(1);
        setTaskSuggestedUser("")
      }
    }
  }, [ open ]);

  const fetchProjectUsers = async () => {
    const users = (await getProjectUsers(projectId)).data.data as IProjectUser[];
    setProjectUsers(users);
  }

  const fetchAllUsers = async () => {
    const users = (await getUsers()).data.data as IUser[];
    setAllUsers(users);
  }

  const fetchTask = async () => {
    if(editId !== undefined) {
      const gottenTask = (await getTask(projectId, sprintId, storyId, editId)).data.data as ITask;

      setTaskName(gottenTask.name);
      setTaskDescription(gottenTask.description);
      setTaskTimeEstimate(gottenTask.timeEstimate);
      setTaskSuggestedUser(gottenTask.suggestedUser);
    }
  }

  const confirmAction = async () => {
    // Edit task
    if(editId !== undefined) {

    }
    // Add task
    else {
      try {
        await postTask(projectId, sprintId, storyId, taskName, taskDescription, taskTimeEstimate, 0, "None", "None", "unassigned");

        openSnack("Task created successfully!", "success", true);
        handleClose();
      } catch (e) {
        let message = "Task creation failed!";
        if(e && e.response && e.response.data && e.response.data.message) message = e.response.data.message;
        openSnack(message, "error");
      }
    }
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
          value={taskName}
          onChange={(e) => {setTaskName(e.target.value)}}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Task Description"
          fullWidth
          multiline
          value={taskDescription}
          onChange={(e) => {setTaskDescription(e.target.value)}}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Time estimate (hours)"
          type="number"
          value={taskTimeEstimate}
          onChange={(e) => {setTaskTimeEstimate(e.target.value as unknown as number)}}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={confirmAction} color="primary">
          { editId !== undefined ? "Confirm changes" : "Add" }
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/*
<div style={{ display: "flex", margin: "10px 0", justifyContent: "space-between" }}>
<div>
    <FormControl style={{ marginRight: "20px" }}>
    <InputLabel>User</InputLabel>
    <Select
        value=""
        onChange={(e) => {suggestedUser(e)}}
    >
        {
        projectUsers.map((user, j) => (
          <div>
          {
            allUsers.map((user_all, i) => (
              <div>
                {
                  user.userId == user_all._id? (
                    <MenuItem key={j} value={user_all._id}>{user_all.name} {user_all.surname}</MenuItem>
                  ) : (null)
                }
              </div>
            ))
          }
          </div>
        ))
        }
    </Select>
    </FormControl>
</div>
</div>
*/
