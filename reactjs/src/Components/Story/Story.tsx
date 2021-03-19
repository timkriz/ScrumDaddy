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
import {getTasks} from "../../api/TaskService";
import "./story.css";
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

export default () => {
  const [ sprint, setSprint ] = useState<ISprint>();
  const [ project, setProject] = useState<IProject>();
  const [ story, setStory ] = useState<IStory>();
  const [ tasks, setTasks ] = useState<ITask[]>([]);

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const { projectId } = useParams<IProjectParams>();
  const { sprintId } = useParams<ISprintParams>();
  const { storyId } = useParams<IStoryParams>();

  const history = useHistory();

  useEffect(() => {
    fetchProject();
    fetchSprint();
    fetchStory();
    fetchTasks();
  }, [ projectId, sprintId, storyId ]);

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

  const fetchTasks = async () => {
    const gottenTasks = (await getTasks(projectId, sprintId, storyId)).data.data as ITask[];
    setTasks(gottenTasks);
  }

  const back = () => {
    history.push(`/projects/${projectId}/sprints/${sprintId}`);
  }

  const taskDetailsClick = (taskId: string) => {
    history.push(`/projects/${projectId}/sprints/${sprintId}/stories/${storyId}/task/${taskId}`);
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
        sprint !== undefined && project !== undefined && story !== undefined &&
        <>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackOpen} autoHideDuration={6000} onClose={closeSnack}>
                <Alert variant="filled" onClose={closeSnack} severity={snackSeverity}>{snackMessage}</Alert>
            </Snackbar>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton size="medium" color="primary" onClick={() => back()}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
                <div className="page_title">{story.name}</div>
                <IconButton size="medium" color="secondary" style={{ opacity: 0, cursor: "auto" }}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
            </div>

            <hr style={{ margin: "30px 0" }}/>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <div className="page_subtitle" style={{ marginBottom: 20 }}>Tasks</div>
                  {
                    tasks.map((task, i) => (
                      <div key={i} className="sprint_row">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div className="sprint_row_title">{task.name}</div>
                          <div style={{ display: "flex", marginTop: 10 }}>
                            {task.description}
                          </div>
                        </div>
                        <div className="sprint_row_icons">
                          <IconButton color="primary" onClick={() => void 0}>
                            <DeleteRounded />
                          </IconButton>
                          <IconButton color="primary" onClick={() => void 0}>
                            <EditRounded />
                          </IconButton>
                          <IconButton color="primary" onClick={() => taskDetailsClick(task._id)}>
                            <ArrowForwardRounded />
                          </IconButton>
                        </div>
                      </div>
                    ))
                  }
                </div>
            </div>
        </>
      }
    </>
  )
}