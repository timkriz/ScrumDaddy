import React, {useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {ITaskDialogAssign, ITaskUser, IUser} from "./ITaskList";
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
import {getTask, putTask, postTask} from "../../api/TaskService";
import {ITask} from "../ProjectList/IProjectList";

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
  const [ TaskTitle, setTaskTitle ] = useState<string>("");
  const [ TaskDescription, setTaskDescription ] = useState<string>("");
  const [ TaskTime, setTaskTime] = useState<number>(10);
  const [ projectUsers, setProjectUsers ] = useState<IUser[]>([]);
  const [ assignedUsers, setAssignedUsers ] = useState<ITaskDialogAssign[]>([]);


  useEffect(() => {
    if(open) {
      // Fetch task
      if(editId !== undefined) {
        fetchTask();
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


  const fetchTask = async () => {
    if(editId !== undefined) {
      const gottenTask = (await getTask(projectId, sprintId, storyId, editId)).data.data as ITask;

      setTaskTitle(gottenTask.name);
      setTaskDescription(gottenTask.description);
      setTaskTime(gottenTask.timeEstimate);
    }
  }

  const confirmAction = async () => {
    // Edit task
    if(editId !== undefined) {
      try {
        await putTask(projectId, sprintId, storyId, editId, TaskTitle, TaskDescription, TaskTime);

        openSnack("Task updated successfully!", "success", true);
        handleClose();
      } catch (e) {
        openSnack("Task update failed!", "error");
      }
    }

    // Add task
    else {
    try {
      await postTask(projectId, sprintId, storyId, TaskTitle, TaskDescription, TaskTime);

      openSnack("Task created successfully!", "success", true);
      handleClose();
    } catch (e) {
      openSnack("Task creation failed!", "error");
    }
  }
};

const addAssignRow = () => {
};

const deleteAssignRow = (i: number) => {
};

const handleUserSelect = (e: any, i: number) => {
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