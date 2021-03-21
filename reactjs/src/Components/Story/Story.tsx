import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {IProject, ISprint, IStory, ITask} from "../ProjectList/IProjectList";
import {ArrowBackRounded, ArrowForwardRounded, DeleteRounded, EditRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import {Color} from "@material-ui/lab/Alert";
import {getUser} from "../../api/UserService";
import {getProject} from "../../api/ProjectService";
import {getSprint} from "../../api/SprintService";
import {getStory} from "../../api/UserStoriesService";
import {getTasks, getTask, putTask, deleteTask} from "../../api/TaskService";
import "./story.css";
import moment from "moment";
import {getUserId} from "../../api/TokenService";
import {ProjectRoles} from "../../data/Roles";
import TaskDialog from "../Task/TaskDialog";

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
  const [ taskDialogOpen, setTaskDialogOpen ] = useState<boolean>(false);
  const [ editId, setEditId ] = useState<string>();
  const [ tasks_unassigned, setTasksUnassigned ] = useState<ITask[]>([]);
  const [ tasks_assigned, setTasksAssigned ] = useState<ITask[]>([]);
  const [ tasks_active, setTasksActive] = useState<ITask[]>([]);
  const [ tasks_completed, setTasksCompleted ] = useState<ITask[]>([]);

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
    const gottenTasksUnassigned = [] as ITask[];
    const gottenTasksAssigned = [] as ITask[];
    const gottenTasksActive = [] as ITask[];
    const gottenTasksCompleted = [] as ITask[];
    gottenTasks.map((task, index) => {
      if (task.status == "unassigned"){
        gottenTasksUnassigned.push(task)
      }else if (task.status == "assigned"){
        gottenTasksAssigned.push(task)        
      }else if (task.status == "active"){
        gottenTasksActive.push(task)        
      }else{
        gottenTasksCompleted.push(task)        
      }
    })
    setTasks(gottenTasks);
    setTasksUnassigned(gottenTasksUnassigned);
    setTasksAssigned(gottenTasksAssigned);
    setTasksActive(gottenTasksActive);
    setTasksCompleted(gottenTasksCompleted);
  }

  const deleteClickedTask = async (taskId: string) => {
    await deleteTask(projectId, sprintId, storyId, taskId);
    fetchTasks();
  }

  const back = () => {
    history.push(`/projects/${projectId}/sprints/${sprintId}`);
  }

  const assignUser = (task: ITask, action: string) => {   
    try {
      const userId = getUserId();
      if (task !== undefined){
        if (userId !== null){
          if (action == "assign") {
            if(task.assignedUser !== "None"){
              putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.suggestedUser, userId, "assigned");
            }
          }else if(action == "unassign") {
            putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.suggestedUser, "None", "unassigned");
          }else if(action == "activate") {
            putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.suggestedUser, task.assignedUser, "active");
          }else if(action == "deactivate") {
            putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.suggestedUser, task.assignedUser, "assigned");
          }else if(action == "complete") {
            putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.suggestedUser, task.assignedUser, "completed");
          }
        }
      }
    } catch (e) {
      console.log("ERROR: ACCEPT/DECLINE TASK")
    }
    window.location.reload(true);
  };

  const closeSnack = () => {
    setSnackOpen(false);
  }

  const openSnack = (message: string, severity: Color, refresh?: boolean) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  }

  const openTaskDialog = (taskId?: string) => {
    taskId !== undefined && setEditId(taskId);

    setTaskDialogOpen(true);
  }

  const closeTaskDialog = () => {
    setTaskDialogOpen(false);
    setEditId(undefined);
  }

  const closeSprintDialog = () => {
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
                <div className="page_title">Story: {story.name}</div>
                <IconButton size="medium" color="secondary" style={{ opacity: 0, cursor: "auto" }}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" onClick={() => openTaskDialog()} style={{ alignSelf: "flex-start", marginTop: 20 }}>ADD TASK</Button>
            </div>

            {/*
            <TaskDialog projectId={projectId} open={taskDialogOpen} handleClose={closeTaskDialog} openSnack={openSnack} editId={editId} />
            */}

            <hr style={{ margin: "30px 0" }}/>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div className="page_subtitle" style={{ marginBottom: 20 }}>Unassigned tasks</div>
                {
                  tasks_unassigned.map((task, i) => (
                    <div key={i} className="sprint_row">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div className="sprint_row_title">{task.name}</div>
                        <div style={{ display: "flex", marginTop: 10 }}>TODO</div>
                      </div>
                      <div className="sprint_row_icons">
                        <IconButton color="primary" onClick={() => deleteClickedTask(task._id)}>
                          <DeleteRounded />
                        </IconButton>
                        <IconButton color="primary" onClick={() => void 0}>
                          <EditRounded />
                        </IconButton>                 
                        <Button variant="contained" color="primary" onClick={() => assignUser(task, "assign")} style={{alignSelf: "flex-start", marginTop: 5}}>ACCEPT TASK</Button>
                      </div>
                    </div>
                  ))
                }
              </div>

            <div className="center_divider"/>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <div className="page_subtitle" style={{ marginBottom: 20 }}>Assigned tasks</div>
                    {
                      tasks_assigned.map((task, i) => (
                        <div key={i} className="sprint_row">
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className="sprint_row_title">{task.name}</div>
                            <div style={{ display: "flex", marginTop: 10 }}>TODO</div>
                          </div>
                          <div className="sprint_row_icons">
                            <IconButton color="primary" onClick={() => deleteClickedTask(task._id)}>
                              <DeleteRounded />
                            </IconButton>
                            <IconButton color="primary" onClick={() => void 0}>
                              <EditRounded />
                            </IconButton>
                            {
                              task.assignedUser == getUserId()? (
                                <div>
                                  <Button variant="contained" color="primary" onClick={() => assignUser(task, "unassign")} style={{alignSelf: "flex-start", marginTop: 5}}>DECLINE TASK</Button>
                                  <Button variant="contained" color="primary" onClick={() => assignUser(task, "activate")} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 5}}>ACTIVATE</Button>
                                </div>
                              ) : (
                                <Button variant="contained" color="default" onClick={() => void 0} style={{alignSelf: "flex-start", marginTop: 5}}>ASSIGNED</Button>
                              )
                            }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

            <div className="center_divider"/>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <div className="page_subtitle" style={{ marginBottom: 20 }}>Active tasks</div>
                    {
                      tasks_active.map((task, i) => (
                        <div key={i} className="sprint_row">
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className="sprint_row_title">{task.name}</div>
                            <div style={{ display: "flex", marginTop: 10 }}>TODO</div>
                          </div>
                          <div className="sprint_row_icons">
                            <IconButton color="primary" onClick={() => deleteClickedTask(task._id)}>
                              <DeleteRounded />
                            </IconButton>
                            <IconButton color="primary" onClick={() => void 0}>
                              <EditRounded />
                            </IconButton>
                            {
                              task.assignedUser == getUserId()? (
                                  <div>
                                  <Button variant="contained" color="primary" onClick={() => assignUser(task, "complete")} style={{alignSelf: "flex-start", marginTop: 5}}>COMPLETE</Button>
                                  <Button variant="contained" color="primary" onClick={() => assignUser(task, "deactivate")} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 5}}>DEACTIVATE</Button>
                                  </div>
                              ) : (
                                  <Button variant="contained" color="default" onClick={() => void 0} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 5}}>ACTIVE</Button>
                              )
                              }
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

            <div className="center_divider"/>
            
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <div className="page_subtitle" style={{ marginBottom: 20 }}>Completed tasks</div>
                    {
                      tasks_completed.map((task, i) => (
                        <div key={i} className="sprint_row">
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className="sprint_row_title">{task.name}</div>
                            <div style={{ display: "flex", marginTop: 10 }}>TODO</div>
                          </div>
                          <div className="sprint_row_icons">
                            <IconButton color="primary" onClick={() => deleteClickedTask(task._id)}>
                              <DeleteRounded />
                            </IconButton>
                            <IconButton color="primary" onClick={() => void 0}>
                              <EditRounded />
                            </IconButton>
                            <Button variant="contained" color="default" onClick={() => void 0} style={{alignSelf: "flex-start", marginTop: 5}}>COMPLETED</Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>

          </div>
        </>
      }
    </>
  )
}