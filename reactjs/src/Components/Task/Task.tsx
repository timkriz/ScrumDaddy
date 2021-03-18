import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {IProject, ISprint, IStory, ITask} from "../ProjectList/IProjectList";
import {ArrowBackRounded, ArrowForwardRounded, DeleteRounded, EditRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import {Color} from "@material-ui/lab/Alert";
import {getProject} from "../../api/ProjectService";
import {getSprint} from "../../api/SprintService";
import {getStory} from "../../api/UserStoriesService";
import {getTask} from "../../api/TaskService";
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
    history.push(`/stories/${projectId}/${sprintId}/${storyId}`);
  }

  const closeSnack = () => {
    setSnackOpen(false);
  }

  const openSnack = (message: string, severity: Color, refresh?: boolean) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  }

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

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" onClick={() => void 0} style={{ alignSelf: "flex-start", marginTop: 20 }}>ACCEPT TASK</Button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" onClick={() => void 0} style={{ alignSelf: "flex-start", marginTop: 20 }}>DECLINE TASK</Button>
            </div>
            <hr style={{ margin: "30px 0" }}/>

        </>
      } 
    </>
  )
}