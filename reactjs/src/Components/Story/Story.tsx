/* eslint-disable import/no-anonymous-default-export */
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {IProject, ISprint, IStory, ITask, IUser, IProjectUser} from "../ProjectList/IProjectList";
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
import {getProjectUser} from "../../api/ProjectService";
import "./story.css";
import moment from "moment";
import {getUserId} from "../../api/TokenService";
import {ProjectRoles} from "../../data/Roles";

import TaskDialog from "./TaskDialog";
import DeleteTaskDialog from "./DeleteTaskDialog";
import EditTaskTimeDialog from './EditTaskTimeDialog';

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
  const [ editId, setEditId ] = useState<string>();

  const [ allUsers, setAllUsers ] = useState<IUser[]>([]);
  const [ userRole, setUserRole ] = useState<ProjectRoles>();
  const [ timeEstimated, setTimeEstimated ] = useState<number>(0);
  
  const [ tasks_unassigned, setTasksUnassigned ] = useState<ITask[]>([]);
  const [ tasks_assigned, setTasksAssigned ] = useState<ITask[]>([]);
  const [ tasks_active, setTasksActive] = useState<ITask[]>([]);
  const [ tasks_completed, setTasksCompleted ] = useState<ITask[]>([]);

  const [ deleteTaskId, setDeleteTaskId ] = useState<string>("");
  const [ editTaskId, setEditTaskId ] = useState<string>("");
  const [ editTaskTimeId, setEditTaskTimeId ] = useState<string>("");

  const [ taskDialogOpen, setTaskDialogOpen ] = useState<boolean>(false);
  const [ deleteTaskDialogOpen, setDeleteTaskDialogOpen ] = useState<boolean>(false);
  const [ editTaskTimeDialogOpen, setEditTaskTimeDialogOpen ] = useState<boolean>(false);

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
    fetchProjectUser();
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
    setTasksUnassigned(gottenTasksUnassigned);
    setTasksAssigned(gottenTasksAssigned);
    setTasksActive(gottenTasksActive);
    setTasksCompleted(gottenTasksCompleted);
    let sumTimeEstimated = 0
    gottenTasks.map((task, index) => {
      sumTimeEstimated = sumTimeEstimated + task.timeEstimate;
    })
    setTimeEstimated(sumTimeEstimated);
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

  const fetchProjectUser = async () => {
    const userId = getUserId();
    if(userId !== null) {
      const gottenProjectUser = (await getProjectUser(projectId, userId)).data.data as IProjectUser;
      setUserRole(gottenProjectUser.userRole);
    }
  }

  /* SNACK */
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

  const deleteClickedTask = async (taskId: string) => {
    await deleteTask(projectId, sprintId, storyId, taskId);
    fetchTasks();
  }

  /* "METHODOLOGY_KEEPER" and "DEV_TEAM_MEMEBER" can add new task*/
  const openTaskDialog = (taskId?: string) => {
    taskId !== undefined && setEditId(taskId);
    setTaskDialogOpen(true);
  }

  const closeTaskDialog = () => {
    setTaskDialogOpen(false);
    setEditId(undefined);
  }

  /* "METHODOLOGY_KEEPER" and "DEV_TEAM_MEMEBER" can delete task*/
  const handleOpenDeleteTaskDialog = async (taskId: string) => {
    setDeleteTaskId(taskId);
    openDeleteTaskDialog();
  }
  const openDeleteTaskDialog = () => {
    setDeleteTaskDialogOpen(true);
  }
  const closeDeleteTaskDialog = () => {
    fetchProject();
    fetchSprint();
    fetchStory();
    fetchTasks();
    fetchAllUsers();
    fetchProjectUser();
    setDeleteTaskDialogOpen(false);
  }

  /* Everyone can edit task time reamining*/
  const handleOpenEditTaskTimeDialog = async (taskId: string) => {
    setEditTaskTimeId(taskId);
    openEditTaskTimeDialog();
  }
  const openEditTaskTimeDialog = () => {
    setEditTaskTimeDialogOpen(true);
  }
  const closeEditTaskTimeDialog = () => {
    fetchProject();
    fetchSprint();
    fetchStory();
    fetchTasks();
    fetchAllUsers();
    fetchProjectUser();
    setEditTaskTimeDialogOpen(false);
  }

  /* "METHODOLOGY_KEEPER" and "DEV_TEAM_MEMEBER" can edit task*/
  /* TODO */

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

            {userRole === "DEV_TEAM_MEMBER" || userRole === "METH_KEEPER" &&
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color="primary" onClick={() => openTaskDialog()} style={{ alignSelf: "flex-start", marginTop: 20}}>ADD TASK</Button>
              </div>
            }

            {/* Add new task and edit task dialog*/}
            { <TaskDialog projectId={projectId} sprintId={sprintId} storyId={storyId} open={taskDialogOpen} handleClose={closeTaskDialog} openSnack={openSnack} editId={editId} /> }

            {/* Delete task dialog*/}
            { <DeleteTaskDialog projectId={projectId} sprintId={sprintId} storyId={storyId} taskId={deleteTaskId} open={deleteTaskDialogOpen} handleClose={closeDeleteTaskDialog} openSnack={openSnack} /> }

            {/* Edit task time dialog TODO*/}
            { <EditTaskTimeDialog projectId={projectId} storyId={storyId} sprintId={sprintId} taskId={editTaskTimeId} open={editTaskTimeDialogOpen} handleClose={closeEditTaskTimeDialog} openSnack={openSnack} /> }

            <hr style={{ margin: "30px 0" }}/>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div className="page_subtitle" style={{ marginBottom: 20 }}>Unassigned tasks</div>
                {
                  tasks_unassigned.map((task, i) => (
                    <div key={i} className="story_row">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div className="story_row_title">{task.name}</div>
                        <div className="task_label" style={{marginTop: 15}}>Suggested user:</div>
                        {
                          allUsers.map((user, j) => (
                            <div>
                                {
                                  user._id == task.suggestedUser? (
                                    <div className="task_value" style={{ display: "flex"}}>{user.name} {user.surname}</div>
                                  ) : (null)
                                }
                            </div>
                          ))
                        }
                        <div className="task_label" style={{marginTop: 5}}>Remaining time:</div>
                        <div className="task_value" style={{ display: "flex"}}>{task.timeEstimate} hours</div>
                      </div>

                      <div className="story_row_icons">
                        {/* DELETE TASK ICON VISIBLE ONLY TO METHODOLOGY KEEPER AND DEV_TEAM */}
                        {userRole === "DEV_TEAM_MEMBER" || userRole === "METH_KEEPER" &&
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <IconButton color="primary" onClick={() => openTaskDialog(task._id)}> {/* EDIT */}
                              <EditRounded />
                            </IconButton>
                            <IconButton color="primary" onClick={() => handleOpenDeleteTaskDialog(task._id)}> {/* DELETE */}
                              <DeleteRounded />
                            </IconButton>
                          </div>
                        }
                      </div>
                      <div>
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
                        <div key={i} className="story_row">
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className="story_row_title">{task.name}</div>
                            <div className="task_label" style={{marginTop: 15}}>Assigned user:</div>
                            {
                                allUsers.map((user, j) => (
                                  <div>
                                      {
                                        user._id == task.assignedUser? (
                                          <div className="task_value" style={{ display: "flex"}}>{user.name} {user.surname}</div>
                                        ) : (null)
                                      }
                                  </div>
                                ))
                              }
                            <div className="task_label" style={{marginTop: 5}}>Remaining time:</div>
                            <div className="task_value" style={{ display: "flex"}}>{task.timeEstimate} hours</div>
                          </div>

                          <div className="story_row_icons">
                            {/* DELETE TASK ICON VISIBLE ONLY TO METHODOLOGY KEEPER AND DEV_TEAM */}
                            {userRole === "DEV_TEAM_MEMBER" || userRole === "METH_KEEPER" &&
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <IconButton color="primary" onClick={() => openTaskDialog(task._id)}> {/* EDIT */}
                                  <EditRounded />
                                </IconButton>
                                <IconButton color="primary" onClick={() => handleOpenDeleteTaskDialog(task._id)}> {/* DELETE */}
                                  <DeleteRounded />
                                </IconButton>
                              </div>
                            }
                            {/* TASK OPTIONS */}
                            <div style={{ display: "flex", flexDirection: "column" }}>
                            {
                              task.assignedUser == getUserId()? (  
                                <>         
                                  <Button variant="contained" color="primary" onClick={() => assignUser(task, "unassign")} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 10}}>DECLINE TASK</Button>
                                  <Button variant="contained" color="primary" onClick={() => assignUser(task, "activate")} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 10}}>ACTIVATE</Button>
                                </>
                              ) : (
                                  <Button variant="contained" color="default" onClick={() => void 0} style={{alignSelf: "flex-start", marginTop: 25, marginLeft: 10}}>ASSIGNED</Button>
                              )
                            }
                            </div>
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
                        <div key={i} className="story_row">
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className="story_row_title">{task.name}</div>
                            <div className="task_label" style={{marginTop: 15}}>Assigned user:</div>
                            {
                                allUsers.map((user, j) => (
                                  <div>
                                      {
                                        user._id == task.assignedUser? (
                                          <div className="task_value" style={{ display: "flex"}}>{user.name} {user.surname}</div>
                                        ) : (null)
                                      }
                                  </div>
                                ))
                              }
                            <div className="task_label" style={{marginTop: 5}}>Remaining time:</div>
                            <div className="task_value" style={{ display: "flex"}}>{task.timeEstimate} hours</div>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column" }}>

                            <div className="story_row_icons">
                              {/* DELETE TASK ICON VISIBLE ONLY TO METHODOLOGY KEEPER AND DEV_TEAM */}
                              {userRole === "DEV_TEAM_MEMBER" || userRole === "METH_KEEPER" &&
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                  <IconButton color="primary" onClick={() => openTaskDialog(task._id)}> {/* EDIT */}
                                    <EditRounded />
                                  </IconButton>
                                  <IconButton color="primary" onClick={() => handleOpenDeleteTaskDialog(task._id)}> {/* DELETE */}
                                    <DeleteRounded />
                                  </IconButton>
                                </div>
                              }
                              {/* TASK OPTIONS */}
                              <div style={{ display: "flex", flexDirection: "column" }}>
                              {
                                task.assignedUser == getUserId()? (
                                  <>
                                    <Button variant="contained" color="primary" onClick={() => handleOpenEditTaskTimeDialog(task._id)} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 10}}>EDIT TIME</Button>
                                    <Button variant="contained" color="primary" onClick={() => assignUser(task, "deactivate")} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 10}}>DEACTIVATE</Button>
                                  </>
                                ) : (
                                    <Button variant="contained" color="default" onClick={() => void 0} style={{alignSelf: "flex-start", marginTop: 25, marginLeft: 10}}>ACTIVE</Button>
                                )
                              }
                              </div>
                            </div> 

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
                        <div key={i} className="story_row">
                          <div style={{ display: "flex", flexDirection: "column" }}>
                            <div className="story_row_title">{task.name}</div>
                            <div className="task_label" style={{marginTop: 15}}>Assigned user:</div>
                              {
                                allUsers.map((user, j) => (
                                  <div>
                                      {
                                        user._id == task.assignedUser? (
                                          <div className="task_value" style={{display: "flex"}}>{user.name} {user.surname}</div>
                                        ) : (null)
                                      }
                                  </div>
                                ))
                              }
                          </div>
                          <div className="story_row_icons">
                            {/* DELETE TASK ICON VISIBLE ONLY TO METHODOLOGY KEEPER AND DEV_TEAM */}
                            {userRole === "DEV_TEAM_MEMBER" || userRole === "METH_KEEPER" &&
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                <IconButton color="primary" onClick={() => openTaskDialog(task._id)}> {/* EDIT */}
                                  <EditRounded />
                                </IconButton>
                                <IconButton color="primary" onClick={() => handleOpenDeleteTaskDialog(task._id)}> {/* DELETE */}
                                  <DeleteRounded />
                                </IconButton>
                              </div>
                            }
                            <Button variant="contained" color="default" onClick={() => void 0} style={{alignSelf: "flex-start", marginTop: 25, marginLeft: 10}}>COMPLETED</Button>
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
                <div className="story_row">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className="story_row_title">Tasks summary:</div>
                    <div className="task_label" style={{marginTop: 5}}>Total remaining time:</div>
                    <div className="task_value" style={{ display: "flex"}}>{timeEstimated} hours</div>
                  </div>
                </div>
            </div>
          </div>

        </>
      }
    </>
  )
}