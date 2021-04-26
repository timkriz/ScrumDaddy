/* eslint-disable import/no-anonymous-default-export */
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {IProject, ISprint, IStory, ITask,ITaskUser, IUser, IProjectUser} from "../ProjectList/IProjectList";
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
import {deleteTaskUser, getTaskUsers, postTaskUser, putTaskUser} from "../../api/TaskUserService";
import {getProjectUser} from "../../api/ProjectService";
import "./story.css";
import moment, {Moment} from "moment";
import {getUserId} from "../../api/TokenService";
import {ProjectRoles} from "../../data/Roles";
import TaskDialog from "./TaskDialog";
import { time } from "node:console";
import DeleteTaskDialog from "./DeleteTaskDialog";
import EditTaskTimeDialog from './EditTaskTimeDialog';
import { truncateSync } from "node:fs";

interface ITaskTimeRem {
  task: ITask;
  timeRemaining: number;
}

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

  const [ taskTimesRemaining, setTaskTimesRemaining ] = useState<ITaskTimeRem[]>([]);

  const [ deleteTaskId, setDeleteTaskId ] = useState<string>("");
  const [ editTaskId, setEditTaskId ] = useState<string>("");
  const [ editTaskTimeId, setEditTaskTimeId ] = useState<string>("");

  const [ taskDialogOpen, setTaskDialogOpen ] = useState<boolean>(false);
  const [ deleteTaskDialogOpen, setDeleteTaskDialogOpen ] = useState<boolean>(false);
  const [ editTaskTimeDialogOpen, setEditTaskTimeDialogOpen ] = useState<boolean>(false);

  const [ active, setActive] = useState<boolean>(false);

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const [ startLogTime, setStartLogTime ] = useState<Moment>(moment());
  const [ endLogTime, setEndLogTime ] = useState<Moment>(moment());
  const [ finalTime, setFinalTime ] =  useState<any>();
  const [ task, setTask ] = useState<ITask>();
  const [ taskUsers, setTaskUsers ] = useState<ITaskUser[]>();

  const { projectId } = useParams<IProjectParams>();
  const { sprintId } = useParams<ISprintParams>();
  const { storyId } = useParams<IStoryParams>();
  const { taskId } = useParams<ITaskParams>();

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
    await calculateRemainingTimes(gottenTasks);
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

    const userId = getUserId();
    var err = false;
    gottenTasksActive.map((task, i) => {
      if (task.assignedUser === userId){
        err = true;
      }
    })
    if (err) setActive(true);
  }

  const calculateRemainingTimes = async (tasks: ITask[]) => {
    const userId = getUserId();
    if(userId !== null) {
      let taskTimesRem: ITaskTimeRem[] = [];
      for(let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        const taskId = task._id;
        let taskUsers = (await getTaskUsers(projectId, sprintId, storyId, taskId)).data.data as ITaskUser[];
        if(taskUsers.length > 0) {
          taskUsers = taskUsers.sort((a, b) => b.timestamp - a.timestamp);
          const timeRem = taskUsers[0].timeRemaining;
          taskTimesRem.push({ task: task, timeRemaining: timeRem });
        }

        else {
          taskTimesRem.push({ task: task, timeRemaining: task.timeEstimate });
        }
      }
      setTaskTimesRemaining(taskTimesRem);
    }
  }

  // Set status as completed if time remaining is 0
  useEffect(() => {
    for(let i = 0; i < taskTimesRemaining.length; i++) {
      const tr = taskTimesRemaining[i];
      // Check if it is not completed then mark it as completed
      if(tr.timeRemaining === 0) {
        const taskStatus = tr.task.status;
        if(taskStatus !== "completed") {
          assignUser(tr.task, "complete");
          break;
        }
      }
    }
  }, [taskTimesRemaining]);

  const back = () => {
    history.push(`/projects/${projectId}/sprints/${sprintId}`);
  }

  const assignUser = async (task: ITask, action: string) => {   
    try {
      const userId = getUserId();
      if (task !== undefined){
        if (userId !== null){
          if (action == "assign") {
            if(task.assignedUser == "None"){
              await putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.timeLog, task.suggestedUser, userId, "assigned");
            }
          }else if(action == "unassign") {
            await putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.timeLog, task.suggestedUser, "None", "unassigned");
          }else if(action == "activate") {

            /* ACTIVATE - start time logging */
            var now = moment(new Date());
            setStartLogTime(now);

            let taskUsersLogged = (await getTaskUsers(projectId, sprintId, storyId, task._id)).data.data as ITaskUser[];
            taskUsersLogged = taskUsersLogged.sort((a, b) => a.timestamp - b.timeRemaining);
            
            var logToday = false;
            var idx = -1;

            try{
              for (var i = 0; i < taskUsersLogged.length; i++){
                console.log(taskUsersLogged[i].timestamp,  taskUsersLogged.length)
                var dateThen = moment(new Date(taskUsersLogged[i].timestamp*1000)).format("MMM Do YY");
                if(dateThen === (now.format("MMM Do YY"))){
                  logToday = true;
                  idx = i;
                  break;
                }
              }

              /* if there is NO log for today yet, create new task user log */
              if(logToday == false){
                var timestamp = now.unix();

                await postTaskUser(
                projectId,
                sprintId,
                storyId,
                task._id,
                task.assignedUser,
                timestamp,
                timestamp,
                0,
                task.timeEstimate,
              )

              /* if there is log for today, put new timestamp in it*/
              }else{
                var alreadyLogged = taskUsersLogged[idx].timeLog;
                var b = taskUsersLogged[idx].timestamp;
                var timeLog = 0;
                
                await putTaskUser(
                  taskUsersLogged[idx].projectId,
                  taskUsersLogged[idx].sprintId,
                  taskUsersLogged[idx].storyId,
                  taskUsersLogged[idx].taskId,
                  taskUsersLogged[idx]._id,
                  taskUsersLogged[idx].userId,
                  taskUsersLogged[idx].timestamp,
                  now.unix(),                
                  timeLog,
                  taskUsersLogged[idx].timeRemaining
                );
              }
            }catch (e){
                let message = "Task acceptance failed!";
                if(e && e.response && e.response.data && e.response.data.message) message = e.response.data.message;
                openSnack(message, "error");
            }
            
            await putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.timeLog, task.suggestedUser, task.assignedUser, "active");           
            

          }else if(action == "deactivate") {
            
            /* DEACTIVATE - end and save time logging */
            var end = moment(new Date()); 
            setEndLogTime(end)

            let taskUsersLogged = (await getTaskUsers(projectId, sprintId, storyId, task._id)).data.data as ITaskUser[];
            taskUsersLogged = taskUsersLogged.sort((a, b) => a.timestamp - b.timestamp);
            console.log("END USERS LOGGED", taskUsersLogged, taskUsersLogged.length)
            let lastLog = taskUsersLogged[taskUsersLogged.length-1];

            /* check if last log of time started in the same day */
           
            var dateThen = moment(new Date(lastLog.timestamp*1000)).format("MMM Do YY");

          if(taskUsersLogged.length > 0){
            if(dateThen === (end.format("MMM Do YY"))){
              /* log time for activity started in the same day */
              var start = moment(lastLog.timestamp*1000);
              var duration = end.diff(start); 
              let hours = parseInt(moment.utc(duration).format("HH"));
              let minutes = parseInt(moment.utc(duration).format("mm"));
              var overTime = minutes%60;

              if (overTime > 20){
                hours+=1;
              }

              var before = lastLog.timeLog;
              var newTime = before + hours;
              var remaining = lastLog.timeRemaining - hours;
              if (remaining < 0) remaining = 0;
              
              /* log time */
              await putTaskUser(
                lastLog.projectId,
                lastLog.sprintId,
                lastLog.storyId,
                lastLog.taskId,
                lastLog._id,
                lastLog.userId,
                lastLog.timestamp,
                lastLog.timestamp,
                newTime,
                remaining
                  );
                
                let message = hours > 1 ? "Logged " + hours + " hours" : "No time was logged, session too short!";
                openSnack(message, "success");
              }else{
                /* Different start and end date of activity on task */
                /*var start = moment(lastLog.timestamp*1000);
                var duration = end.diff(start); 
                let hours = parseInt(moment.utc(duration).format("HH"));
                let minutes = parseInt(moment.utc(duration).format("mm"));
                var overTime = minutes%60;

                if (hours > parseInt(moment(end).startOf('day').fromNow())){

                  var timeToday = parseInt(moment(end).startOf('day').fromNow())

                  //post TaskUser for today because time log started yesterday
                  await postTaskUser(
                    projectId,
                    sprintId,
                    storyId,
                    task._id,
                    task.assignedUser,
                    0, // timestamp
                    timeToday,
                    task.timeEstimate,
                  )

                  var before = lastLog.timeLog;
                  var newTime = before + hours - timeToday;
                  var remaining = lastLog.timeRemaining - hours - timeToday;
                  if (remaining < 0) remaining = 0;

                  //log time for the last day activity was started
                  await putTaskUser(
                    lastLog.projectId,
                    lastLog.sprintId,
                    lastLog.storyId,
                    lastLog.taskId,
                    lastLog._id,
                    lastLog.userId,
                    lastLog.timestamp,
                    newTime,
                    remaining
                      );
                
                  let message = "Task was active during more days so hours have been logged for start and end day!"
                  //hours > 1 ? "Logged " + hours + " hours" : "No time was logged, session too short!"";
                  openSnack(message, "info");
                  message = "Please check and log time manually if necessary!"
                  openSnack(message, "warning");
                  

                }*/

              }
            }else{
              let message = "Error when logging time!";
              openSnack(message, "error");
            }
            await putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.timeLog, task.suggestedUser, task.assignedUser, "assigned");

          }else if(action == "complete") {
            await putTask(projectId, sprintId, storyId, task._id, task.name, task.description, task.timeEstimate, task.timeLog, task.suggestedUser, task.assignedUser, "completed");
          }else if(action == "return") {
            await putTask(projectId, sprintId, storyId, task._id, task.name, task.description, 1, task.timeLog, task.suggestedUser, task.assignedUser, "assigned");
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
  /* "METHODOLOGY_KEEPER" and "DEV_TEAM_MEMEBER" can edit task*/
  const openTaskDialog = (taskId?: string) => {
    taskId !== undefined && setEditId(taskId);
    setTaskDialogOpen(true);
  }

  const closeTaskDialog = () => {
    fetchProject();
    fetchSprint();
    fetchStory();
    fetchTasks();
    fetchAllUsers();
    fetchProjectUser();
    setTaskDialogOpen(false);
    setEditId(undefined);
    window.location.reload(true);
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
    window.location.reload(true);
  }

  /* everyone can edit timeremaining task*/
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
    window.location.reload(true);
  }

  const getTimeRemainingByTaskId = (taskId: string) => {
    const taskTimeRem = taskTimesRemaining.find(taskTr => taskTr.task._id === taskId);
    if(taskTimeRem !== undefined) {
      return taskTimeRem.timeRemaining;
    }

    else {
      return 10;
    }
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

            {/* Add new task and edit task dialog*/}
            { <TaskDialog projectId={projectId} sprintId={sprintId} storyId={storyId} open={taskDialogOpen} handleClose={closeTaskDialog} openSnack={openSnack} editId={editId} /> }

            {/* Delete task dialog*/}
            { <DeleteTaskDialog projectId={projectId} sprintId={sprintId} storyId={storyId} taskId={deleteTaskId} open={deleteTaskDialogOpen} handleClose={closeDeleteTaskDialog} openSnack={openSnack} /> }

            {/* Edit task time dialog TODO*/}
            { <EditTaskTimeDialog projectId={projectId} storyId={storyId} sprintId={sprintId} taskId={editTaskTimeId} open={editTaskTimeDialogOpen} handleClose={closeEditTaskTimeDialog} openSnack={openSnack} /> }



            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20 }}>

              { (userRole === "DEV_TEAM_MEMBER" || userRole === "METH_KEEPER") &&
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="contained" color="primary" onClick={() => openTaskDialog()} style={{ alignSelf: "flex-start", marginTop: 20}}>ADD TASK</Button>
                </div>
              }
              { (userRole === "PROD_LEAD") &&
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Button variant="contained" color="default" onClick={() => void 0} style={{ alignSelf: "flex-start", marginTop: 20}}>ADD TASK</Button>
                </div>
              }
              
              <div className="story_row">
                <div style={{ display: "flex", flexDirection: "row"}}>
                  <div className="story_label_big" style={{marginTop: 5}}>Total remaining time:</div>
                  <div className="story_value_big" style={{marginLeft: 15, marginTop: 5}}>{timeEstimated} hours</div>
                </div>
              </div>

            </div>

            <hr style={{ margin: "5px 0" }}/>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div className="page_subtitle" style={{ marginBottom: 20 }}>Unassigned tasks</div>
                {
                  tasks_unassigned.map((task, i) => (
                    <div key={i} className="story_row">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div className="story_row_title">{task.name}</div>

                        <div className="task_label" style={{marginTop: 15}}>Description:</div>
                        <div className="task_value" style={{display: "flex"}}>{task.description}</div>

                        <div className="task_label" style={{marginTop: 15}}>Remaining time:</div>
                        <div className="task_value" style={{ display: "flex"}}>{getTimeRemainingByTaskId(task._id)} hours</div>
                      </div>

                      <div className="story_row_icons">
                        {/* DELETE TASK ICON VISIBLE ONLY TO METHODOLOGY KEEPER AND DEV_TEAM */}
                        {(userRole === "DEV_TEAM_MEMBER" || userRole === "METH_KEEPER") &&
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

                            <div className="task_label" style={{marginTop: 15}}>Description:</div>
                            <div className="task_value" style={{display: "flex"}}>{task.description}</div>

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
                            <div className="task_label" style={{marginTop: 15}}>Remaining time:</div>
                            <div className="task_value" style={{ display: "flex"}}>{getTimeRemainingByTaskId(task._id)} hours</div>
                          </div>

                          <div className="story_row_icons">
                            {/* DELETE TASK ICON VISIBLE ONLY TO METHODOLOGY KEEPER AND DEV_TEAM */}
                            {(userRole === "DEV_TEAM_MEMBER" || userRole === "METH_KEEPER") &&
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
                                  { active? (
                                      <Button variant="contained" color="default" onClick={() => void 0} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 10}}>ACTIVATE</Button>
                                    ) : (
                                      <Button variant="contained" color="primary" onClick={() => assignUser(task, "activate")} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 10}}>ACTIVATE</Button>
                                    )
                                  }                  
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

                            <div className="task_label" style={{marginTop: 15}}>Description:</div>
                            <div className="task_value" style={{display: "flex"}}>{task.description}</div>

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
                            <div className="task_label" style={{marginTop: 15}}>Remaining time:</div>
                            <div className="task_value" style={{ display: "flex"}}>{getTimeRemainingByTaskId(task._id)} hours</div>
                          </div>

                          <div style={{ display: "flex", flexDirection: "column" }}>

                            <div className="story_row_icons">
                              {/* DELETE TASK ICON VISIBLE ONLY TO METHODOLOGY KEEPER AND DEV_TEAM */}
                              {(userRole === "DEV_TEAM_MEMBER" || userRole === "METH_KEEPER") &&
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
                                    <Button variant="contained" color="primary" onClick={() => handleOpenEditTaskTimeDialog(task._id)} style={{alignSelf: "flex-start", marginTop: 5, marginLeft: 10}}>LOG TIME</Button>
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
                            
                            <div className="task_label" style={{marginTop: 15}}>Description:</div>
                            <div className="task_value" style={{display: "flex"}}>{task.description}</div>

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
                            {(userRole === "DEV_TEAM_MEMBER" || userRole === "METH_KEEPER") &&
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
                            { (userRole === "PROD_LEAD") &&
                              <Button variant="contained" color="primary" onClick={() => assignUser(task, "return")} style={{alignSelf: "flex-start", marginTop: 25, marginLeft: 10}}>RETURN</Button>
                            }
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