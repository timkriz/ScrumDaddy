/* eslint-disable import/no-anonymous-default-export */
import React, {useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {Color} from "@material-ui/lab";
import {getTask} from "../../api/TaskService";
import {ISprint, ITask, ITaskUser} from "../ProjectList/IProjectList";
import {deleteTaskUser, getTaskUsers, postTaskUser, putTaskUser} from "../../api/TaskUserService";
import moment from "moment";
import {getSprint} from "../../api/SprintService";
import {getUserId} from "../../api/TokenService";
import "./timeLog.css";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import {Check, Delete} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

enum HttpMethods {
  NONE = "NONE",
  POST = "POST",
  PUT = "PUT"
}

interface IExtTaskUser extends ITaskUser {
  modified: HttpMethods;
}

interface IProps {
  projectId: string;
  taskId: string;
  sprintId: string;
  storyId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ projectId, sprintId, storyId, taskId, open, handleClose, openSnack }: IProps) => {
  const [ task, setTask ] = useState<ITask>();
  const [ taskUsers, setTaskUsers ] = useState<ITaskUser[]>();
  const [ extendedTaskUsers, setExtendedTaskUsers ] = useState<IExtTaskUser[]>([]);
  const [ timeRemaining, setTimeRemaining] = useState<number>();
  const [ showExtended, setShowExtended] = useState<boolean>(true);

  useEffect(() => {
    if(open && taskId !== "") {
      fetchData();
    }
  }, [open, taskId]);

  const fetchData = async () => {
    const task = (await getTask(projectId, sprintId, storyId, taskId)).data.data as ITask;
    setTask(task);

    let taskUsers = (await getTaskUsers(projectId, sprintId, storyId, taskId)).data.data as ITaskUser[];
    taskUsers = taskUsers.sort((a, b) => a.timestamp - b.timeRemaining);

    setTaskUsers(taskUsers);
  };

  // Calculate time remaining and create extended task users
  useEffect(() => {
    if(task !== undefined && taskUsers !== undefined) {
      const timeRem = taskUsers.length > 0 ? taskUsers[taskUsers.length-1].timeRemaining : task.timeEstimate;
      setTimeRemaining(timeRem);

      createExtendedTaskUsers();
    }
  }, [task, taskUsers, showExtended]);

  // Create extended task users
  const createExtendedTaskUsers = async () => {
    if(task !== undefined && taskUsers !== undefined) {

      if(showExtended) {
        const sprint = (await getSprint(projectId, sprintId)).data.data as ISprint;
        let curDay = moment.unix(sprint.startTime);
        const endDay = moment();

        let extTaskUsers: IExtTaskUser[] = [];
        let curTimeRem = task.timeEstimate;
        while(curDay.unix() < endDay.unix() || curDay.format("DD.MM.YYYY") === endDay.format("DD.MM.YYYY")) {
          // Check if that day already has a time log
          let timeLogThatDay: IExtTaskUser | undefined = undefined;
          for(let i = 0; i < taskUsers.length; i++) {
            // Found it - add to existing array
            if(moment.unix(taskUsers[i].timestamp).format("DD.MM.YYYY") === curDay.format("DD.MM.YYYY")) {
              timeLogThatDay = JSON.parse(JSON.stringify(taskUsers[i])) as IExtTaskUser;
              timeLogThatDay.modified = HttpMethods.NONE;
              curTimeRem = timeLogThatDay.timeRemaining;
              extTaskUsers.push(timeLogThatDay);
              break;
            }
          }

          // If no time log exists create it yourself and push it
          if(timeLogThatDay === undefined) {
            const userId = getUserId();

            if(userId !== null) {
              timeLogThatDay = {
                _id: "",
                projectId: projectId,
                sprintId: sprintId,
                storyId: storyId,
                taskId: taskId,
                userId: userId,
                timestamp: curDay.unix(),
                activatedTimestamp: -1,
                timeLog: 0,
                timeRemaining: curTimeRem,
                modified: HttpMethods.POST
              };
              extTaskUsers.push(timeLogThatDay);
            }
          }

          curDay = curDay.add(1, "day");
        }

        setExtendedTaskUsers(extTaskUsers);
      }

      else {
        let taskUsersCopy = JSON.parse(JSON.stringify(taskUsers)) as ITaskUser[];
        let extTaskUsers: IExtTaskUser[] = [];
        taskUsersCopy.forEach(taskUser => extTaskUsers.push({ ...taskUser, modified: HttpMethods.NONE }));
        setExtendedTaskUsers(extTaskUsers);
      }
    }
  };

  const updateTime = (type: "log" | "remaining", value: string, i: number) => {
    let extTaskUsersCopy = JSON.parse(JSON.stringify(extendedTaskUsers)) as IExtTaskUser[];
    if(type === "log") {
      extTaskUsersCopy[i].timeLog = parseInt(value);
    } else {
      extTaskUsersCopy[i].timeRemaining = parseInt(value);
    }
    extTaskUsersCopy[i].modified = extTaskUsersCopy[i]._id === "" ? HttpMethods.POST : HttpMethods.PUT;
    setExtendedTaskUsers(extTaskUsersCopy);
  };

  const handleDeleteTaskUser = async (i: number) => {
    const deleteId = extendedTaskUsers[i]._id;

    await deleteTaskUser(projectId, sprintId, storyId, taskId, deleteId);

    let taskUsersCopy = JSON.parse(JSON.stringify(taskUsers)) as ITaskUser[];
    taskUsersCopy = taskUsersCopy.filter(taskUser => taskUser._id !== deleteId);
    setTaskUsers(taskUsersCopy);

    openSnack("Time log deleted successfully!", "success", false);
  };

  const handleAcceptTaskUser = async (i: number) => {
    let extTaskUserCopy = JSON.parse(JSON.stringify(extendedTaskUsers[i])) as IExtTaskUser;
    const userId = getUserId();

    if(userId !== null) {
      if(extTaskUserCopy.modified === HttpMethods.POST) {
        const newTaskUser = (await postTaskUser(
          extTaskUserCopy.projectId,
          extTaskUserCopy.sprintId,
          extTaskUserCopy.storyId,
          extTaskUserCopy.taskId,
          extTaskUserCopy.userId,
          extTaskUserCopy.timestamp,
          extTaskUserCopy.activatedTimestamp,
          extTaskUserCopy.timeLog,
          extTaskUserCopy.timeRemaining
        )).data.data as ITaskUser;

        let taskUsersCopy = JSON.parse(JSON.stringify(taskUsers)) as ITaskUser[];
        taskUsersCopy.push(newTaskUser);
        taskUsersCopy = taskUsersCopy.sort((a, b) => a.timestamp - b.timestamp);
        setTaskUsers(taskUsersCopy);

        openSnack("Time logged successfully!", "success", false);
      }

      if(extTaskUserCopy.modified === HttpMethods.PUT) {
        const updatedTaskUser = (await putTaskUser(
          extTaskUserCopy.projectId,
          extTaskUserCopy.sprintId,
          extTaskUserCopy.storyId,
          extTaskUserCopy.taskId,
          extTaskUserCopy._id,
          extTaskUserCopy.userId,
          extTaskUserCopy.timestamp,
          extTaskUserCopy.activatedTimestamp,
          extTaskUserCopy.timeLog,
          extTaskUserCopy.timeRemaining
        )).data.data as ITaskUser;

        let taskUsersCopy = JSON.parse(JSON.stringify(taskUsers)) as ITaskUser[];
        taskUsersCopy = taskUsersCopy.filter(taskUser => taskUser._id !== updatedTaskUser._id);
        taskUsersCopy.push(updatedTaskUser);
        taskUsersCopy = taskUsersCopy.sort((a, b) => a.timestamp - b.timestamp);
        setTaskUsers(taskUsersCopy);

        openSnack("Time log updated successfully!", "success", false);
      }
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      
      <DialogTitle style={{ textAlign: "center" }}>Time Logger</DialogTitle>

      <DialogContent>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <FormControlLabel
            control={<Switch checked={showExtended} onChange={(e) => setShowExtended(e.target.checked)} name="showExtended" />}
            label="Show extended"
          />
        </div>

        {
          extendedTaskUsers.map((extTaskUser, i) => (
            <div key={i} className="time_log_row">
              <div className="time_log_left">
                <Typography variant="subtitle1" style={{ fontWeight: 500 }}>{moment.unix(extTaskUser.timestamp).format("DD.MM.YYYY")}</Typography>

                <TextField
                  label="Log Time"
                  type="number"
                  value={extTaskUser.timeLog}
                  onChange={(e) => updateTime("log", e.target.value, i)}
                  style={{ width: 140, marginRight: 10 }}
                />

                <TextField
                  label="Time Remaining"
                  type="number"
                  value={extTaskUser.timeRemaining}
                  onChange={(e) => updateTime("remaining", e.target.value, i)}
                  style={{ width: 140 }}
                />
              </div>
              <div className="time_log_right">
                <IconButton color="primary" onClick={() => handleAcceptTaskUser(i)} disabled={extTaskUser.modified === HttpMethods.NONE || extTaskUser.timeLog === 0}>
                  <Check />
                </IconButton>
                <IconButton color="primary" onClick={() => handleDeleteTaskUser(i)} disabled={extTaskUser._id === ""}>
                  <Delete />
                </IconButton>
              </div>
            </div>
          ))
        }
      </DialogContent>

      <DialogActions style={{ justifyContent: "center", padding: "8px 24px 16px 24px" }}>
        <Button onClick={handleClose} color="primary" variant="contained">CLOSE</Button>
      </DialogActions>
    </Dialog>
  )
}