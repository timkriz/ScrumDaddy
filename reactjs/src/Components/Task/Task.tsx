import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {IProject, ISprint, IStory, ITask, IUser} from "../ProjectList/IProjectList";
import {ArrowBackRounded, ArrowForwardRounded, DeleteRounded, EditRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import {Color} from "@material-ui/lab/Alert";
import {getProject} from "../../api/ProjectService";
import {getSprint} from "../../api/SprintService";
import {getStory} from "../../api/UserStoriesService";
import {getTask, putTask} from "../../api/TaskService";
import "./task.css";
import moment from "moment";
import {getUserId} from "../../api/TokenService";
import {ProjectRoles} from "../../data/Roles";

interface IProjectParams {
  projectId: string;
}

interface ISprintParams {
  sprintId: string;
}

interface IStoryParams {
  storyId: string;
}

interface ITaskParams {
  taskId: string;
}

export default () => {
  const [ sprint, setSprint ] = useState<ISprint>();
  const [ project, setProject] = useState<IProject>();
  const [ story, setStory ] = useState<IStory>();
  const [ task, setTask ] = useState<ITask>();

  const [ assignedUser, setAssignedUser ] = useState<IUser>();

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const { projectId } = useParams<IProjectParams>();
  const { sprintId } = useParams<ISprintParams>();
  const { storyId } = useParams<IStoryParams>();
  const { taskId } = useParams<ITaskParams>();

  const history = useHistory();

  useEffect(() => {
    fetchProject();
    fetchSprint();
    fetchStory();
    fetchTask();
  }, [ projectId, sprintId, storyId, taskId ]);

  const fetchProject = async () => {
    console.log(projectId)
    const gottenProject = (await getProject(projectId)).data.data as IProject;
    setProject(gottenProject);
  }

  const fetchSprint = async () => {
    const gottenSprint = (await getSprint(projectId, sprintId)).data.data as ISprint;
    setSprint(gottenSprint);
  }

  const fetchStory = async () => {
    const gottenStory = (await getStory(projectId, sprintId, storyId)).data.data as IStory;
    setStory(gottenStory);
  }

  const fetchTask = async () => {
    const gottenTask = (await getTask(projectId, sprintId, storyId, taskId)).data.data as ITask;
    setTask(gottenTask);
  }

  const back = () => {
    history.push(`/projects/${projectId}/sprints/${sprintId}/stories/${storyId}`);
  }

  const closeSnack = () => {
    setSnackOpen(false);
  }

  const openSnack = (message: string, severity: Color, refresh?: boolean) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  }

  const assignUser = (set: boolean) => {
    if(set) {
      try {
        if (task !== undefined){
          const userId = getUserId();
          if (userId !== null){
            putTask(projectId, sprintId, storyId, taskId, task.name, task.description, task.timeEstimate, task.suggestedUser, userId);
          }
        }
      } catch (e) {
        console.log("ERR PUT TASK")
      }
    }else{
      try {
        if (task !== undefined){
          putTask(projectId, sprintId, storyId, taskId, task.name, task.description, task.timeEstimate, task.suggestedUser, "None");
        }
      } catch (e) {
        console.log("ERR PUT TASK")
      }
    }
    window.location.reload(true);
  };

  return (
    <>
      {
        sprint !== undefined && project !== undefined && story !== undefined && task !== undefined &&
        <>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackOpen} autoHideDuration={6000} onClose={closeSnack}>
                <Alert variant="filled" onClose={closeSnack} severity={snackSeverity}>{snackMessage}</Alert>
            </Snackbar>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton size="medium" color="primary" onClick={() => back()}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
                <div className="page_title">{task.name}</div>
                <IconButton size="medium" color="secondary" style={{ opacity: 0, cursor: "auto" }}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
            </div>
            {task.assignedUser == getUserId()? (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color="primary" onClick={() => assignUser(false)} style={{ alignSelf: "flex-start", marginTop: 20 }}>DECLINE TASK</Button>
                </div>      
            ) : task.assignedUser == "None"? (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color="primary" onClick={() => assignUser(true)} style={{ alignSelf: "flex-start", marginTop: 20 }}>ACCEPT TASK</Button>
                </div>
            ) : (
              <div className="page_title">USER ALREADY ASSIGNED TO THIS TASK</div>
            )}
            <hr style={{ margin: "30px 0" }}/>
            <div className="page_title">Description: {task.description}</div>
            <div className="page_title">Time estimate: {task.timeEstimate}</div>
            <div className="page_title">Suggested user: {task.suggestedUser}</div>
            <div className="page_title">Assigned user: {task.assignedUser}</div>
        </>
      } 
    </>
  )
}