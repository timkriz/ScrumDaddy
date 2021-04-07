/* eslint-disable import/no-anonymous-default-export */
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {IProject, ISprint, IStory, ITask, IUser} from "../ProjectList/IProjectList";
import {ArrowBackRounded, ArrowForwardRounded, DeleteRounded, EditRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import {Color} from "@material-ui/lab/Alert";
import {getUsers} from "../../api/UserService";
import {getProject} from "../../api/ProjectService";
import {getSprint} from "../../api/SprintService";
import {getStory} from "../../api/UserStoriesService";
import {getTasks, getTask, putTask, deleteTask} from "../../api/TaskService";
import "./story.css";
import moment from "moment";
import {getUserId} from "../../api/TokenService";
import {ProjectRoles} from "../../data/Roles";
import TaskDialog from "./TaskDialog";

interface IProjectParams {
  projectId: string;
}

interface ISprintParams {
  sprintId: string;
}

interface IStoryParams {
  storyId: string;
}

export enum TaskStatuses {
  COMPLETED = "completed",
  ASSIGNED = "assigned",
  UNASSIGNED = "unassigned",
  ACTIVE = "active"
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
  const [ allUsers, setAllUsers ] = useState<IUser[]>([]);
  const [ timeLog, setTimeLog] = useState<number>(0);
  const [ timeEstimated, setTimeEstimated ] = useState<number>(0);

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
    fetchAllUsers();
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

  const fetchAllUsers = async () => {
    const users = (await getUsers()).data.data as IUser[];
    setAllUsers(users);
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
    let sumTimeLog = 0
    let sumTimeEstimated = 0
    gottenTasks.map((task, index) => {
      sumTimeLog = sumTimeLog + task.timeLog;
      sumTimeEstimated = sumTimeEstimated + task.timeEstimate;
    })
    setTimeLog(sumTimeLog);
    setTimeEstimated(sumTimeEstimated);
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
            if(task.assignedUser == "None"){
              putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.timeLog, task.suggestedUser, userId, "assigned");
            }
          }else if(action == "unassign") {
            putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.timeLog, task.suggestedUser, "None", "unassigned");
          }else if(action == "activate") {
            putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.timeLog, task.suggestedUser, task.assignedUser, "active");
          }else if(action == "deactivate") {
            putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.timeLog, task.suggestedUser, task.assignedUser, "assigned");
          }else if(action == "complete") {
            putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.timeLog, task.suggestedUser, task.assignedUser, "completed");
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

    if(refresh) {
      fetchTasks();
    }
  }

  const openTaskDialog = (taskId?: string) => {
    taskId !== undefined && setEditId(taskId);

    setTaskDialogOpen(true);
  }

  const closeTaskDialog = () => {
    setTaskDialogOpen(false);
    setEditId(undefined);
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
                <Button variant="contained" color="primary" onClick={() => openTaskDialog()} style={{ alignSelf: "flex-start", marginTop: 20}}>ADD TASK</Button>
            </div>

            <TaskDialog projectId={projectId} sprintId={sprintId} storyId={storyId} open={taskDialogOpen} handleClose={closeTaskDialog} openSnack={openSnack} editId={editId} />

            <hr style={{ margin: "30px 0" }}/>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div className="page_subtitle" style={{ marginBottom: 20 }}>Unassigned tasks</div>
                {
                  tasks_unassigned.map((task, i) => (
                    <div key={i} className="sprint_row">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div className="sprint_row_title">{task.name}</div>
                        <div className="sprint_label" style={{marginTop: 5}}>Suggested user:</div>               
                        {
                          allUsers.map((user, j) => (
                            <div>
                                {
                                  user._id == task.suggestedUser? (
                                    <div style={{ display: "flex"}}>{user.name} {user.surname}</div>
                                  ) : (null)
                                }
                            </div>
                          ))
                        }
                        <div className="sprint_label" style={{marginTop: 5}}>Estimated time:</div>
                        <div style={{ display: "flex"}}>{task.timeEstimate}</div>
                      </div>
                      <div className="sprint_row_icons">
                        <IconButton color="primary" onClick={() => deleteClickedTask(task._id)}>
                          <DeleteRounded />
                        </IconButton>
                        <Button variant="contained" color="primary" onClick={() => assignUser(task, "assign")} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 5}}>ACCEPT TASK</Button>
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
                            <div className="sprint_label" style={{marginTop: 5}}>Assigned user:</div>
                            {
                                allUsers.map((user, j) => (
                                  <div>
                                      {
                                        user._id == task.assignedUser? (
                                          <div style={{ display: "flex"}}>{user.name} {user.surname}</div>
                                        ) : (null)
                                      }
                                  </div>
                                ))
                              }
                            <div className="sprint_label" style={{marginTop: 5}}>Estimated time:</div>
                            <div style={{ display: "flex"}}>{task.timeEstimate}</div>
                          </div>
                          <div className="sprint_row_icons">
                            <IconButton color="primary" onClick={() => deleteClickedTask(task._id)}>
                              <DeleteRounded />
                            </IconButton>
                            {
                              task.assignedUser == getUserId()? (
                                <div>
                                  <Button variant="contained" color="primary" onClick={() => assignUser(task, "unassign")} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 5}}>DECLINE TASK</Button>
                                  <Button variant="contained" color="primary" onClick={() => assignUser(task, "activate")} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 5}}>ACTIVATE</Button>
                                </div>
                              ) : (
                                <Button variant="contained" color="default" onClick={() => void 0} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 5}}>ASSIGNED</Button>
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
                            <div className="sprint_label" style={{marginTop: 5}}>Assigned user:</div>
                            {
                                allUsers.map((user, j) => (
                                  <div>
                                      {
                                        user._id == task.assignedUser? (
                                          <div style={{ display: "flex"}}>{user.name} {user.surname}</div>
                                        ) : (null)
                                      }
                                  </div>
                                ))
                              }
                            <div className="sprint_label" style={{marginTop: 5}}>Estimated time:</div>
                            <div style={{ display: "flex"}}>{task.timeEstimate}</div>
                          </div>
                          <div className="sprint_row_icons">
                            <IconButton color="primary" onClick={() => deleteClickedTask(task._id)}>
                              <DeleteRounded />
                            </IconButton>
                            {
                              task.assignedUser == getUserId()? (
                                  <div>
                                  <Button variant="contained" color="primary" onClick={() => assignUser(task, "complete")} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 5}}>COMPLETE</Button>
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
                            <div className="sprint_label" style={{marginTop: 5}}>Assigned user:</div>
                              {
                                allUsers.map((user, j) => (
                                  <div>
                                      {
                                        user._id == task.assignedUser? (
                                          <div style={{ display: "flex"}}>{user.name} {user.surname}</div>
                                        ) : (null)
                                      }
                                  </div>
                                ))
                              }
                            <div className="sprint_label" style={{marginTop: 5}}>Estimated time:</div>
                            <div style={{ display: "flex"}}>{task.timeEstimate}</div>
                          </div>
                          <div className="sprint_row_icons">
                            <IconButton color="primary" onClick={() => deleteClickedTask(task._id)}>
                              <DeleteRounded />
                            </IconButton>
                            <Button variant="contained" color="default" onClick={() => void 0} style={{alignSelf: "flex-start", marginTop: 5}}>COMPLETED</Button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
            
            </div>
          <hr style={{ margin: "30px 0" }}/>


          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div className="sprint_row">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className="sprint_row_title">Tasks summary:</div>
                    <div className="sprint_label" style={{marginTop: 5}}>Total estimated time:</div>
                    <div style={{ display: "flex"}}>{timeEstimated}</div>
                    <div className="sprint_label" style={{marginTop: 5}}>Total logged time:</div>
                    <div style={{ display: "flex"}}>{timeLog}</div>
                  </div>
                </div>
            </div>
          </div>

        </>
      }
    </>
  )
}