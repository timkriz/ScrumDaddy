/* eslint-disable import/no-anonymous-default-export */
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import "./productbacklog.css";
import {Button} from "@material-ui/core";
import {getSprints, getStories, acceptUserStory, setUserStoryStatus} from "../../api/UserStoriesService";
import {ITask} from "../ProjectList/IProjectList";
import {getTasks} from "../../api/TaskService";
import Typography from "@material-ui/core/Typography";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {TabPanel} from "./TabPanel"
import IconButton from "@material-ui/core/IconButton";
import {ArrowForwardRounded, DeleteRounded, EditRounded, PriorityHighSharp, ReportRounded} from "@material-ui/icons";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import {ProjectRoles, SystemRoles} from "../../data/Roles";
import {Color} from "@material-ui/lab";
import RejectStoryDialog from './RejectStoryDialog';
import StoryDialog from "../Story/StoryDialog";
import StoryToSprintDialog from "../Story/StoryToSprintDialog";
import DeleteStoryDialog from './DeleteStoryDialog';
import EditStoryDialog from './EditStoryDialog';
import {allPriorities, Priorities} from "../Story/Priorities";
import {allStatuses, Status} from "../Story/Status";

interface IProject {
  _id: string;
  name: string;
  description: string;
}
interface ISprint {
  _id: string;
  name: string;
  description: number;
  startTime: number;
  endTime: number;
  velocity: number;
  projectId: string;
}
interface IStory {
  _id: string;
  name: string;
  description: string;
  timeEstimate: number;
  businessValue: number;
  comment: string;
  priority: string;
  tests: string;
  status: string;
  projectId: string;
  sprintId: string;
}
interface ISprintCollection{ 
  _id: string; 
  name: string;
  stories: IStory[];
}

interface IProjectParams {
  projectId: string;
}

interface ISprintParams {
  sprintId: string;
}


const project1: IProject[] = [
    {
      _id: "",
      name: "",
      description: ""
    }
  ];

interface IProps {
  projectId: string;
  userRole: ProjectRoles;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ projectId, userRole, openSnack }: IProps) => {
  const [ projects, setProjects ] = useState<IProject[]>([]); 
  const [ sprints, setSprints ] = useState<ISprint[]>([]);
  const [ stories, setStories ] = useState<IStory[]>([]);

  const [ ISprintCollection, setSprintCollection ] = useState<ISprintCollection[]>([]); /* Categorized stories into sprints */
  const [ productBacklog, setProductBacklog ] = useState<IStory[]>([]);  /* Special sprint for stories not assigned to sprint */
  const [ acceptedStories, setAcceptedStories ] = useState<IStory[]>([]);  /* Realized and accepted user stories*/
  const [ sprintDict, setSprintDict ] = useState<{ [id: string] : string; }>({});  /* Realized and accepted user stories*/
  //let sprintDict: { [id: string] : string; } = {}; 

  const [valueTab, setValue] = React.useState(0);
  const [ rejectDialogOpen, setRejectDialogOpen ] = useState<boolean>(false);
  const [ deleteStoryDialogOpen, setDeleteStoryDialogOpen ] = useState<boolean>(false);
  const [ editStoryDialogOpen, setEditStoryDialogOpen ] = useState<boolean>(false);
  const [ rejectedStorySprintId, setRejectedStorySprintId ] = useState<string>("");
  const [ rejectedStoryId, setRejectedStoryId ] = useState<string>("");
  const [ deletedStoryId, setDeletedStoryId ] = useState<string>("");
  const [ editStoryId, setEditStoryId ] = useState<string>("");
  const [ editedStory, setEditedStory ] = useState<IStory>();

  const [ storyToSprintOpen, setStoryToSprintOpen] = useState<boolean>(false);

  const [ storyDialogOpen, setStoryDialogOpen ] = useState<boolean>(false);
  const [ editId, setEditId ] = useState<string>();
  //const { projectId } = useParams<IProjectParams>();
  const { sprintId } = useParams<ISprintParams>();
  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchBacklogStories();
    fetchSprints();
  }, []);

  /* Fetch all sprints */
  const fetchBacklogStories = async () => {
    const allStoriesInProductBacklog = (await getStories(projectId, "/")).data.data as IStory[];
    setProductBacklog(allStoriesInProductBacklog);
  }

  /* Fetch all sprints */
  const fetchSprints = async () => {
    const gottenSprints = (await getSprints(projectId)).data.data as ISprint[];
    setSprints(gottenSprints);

    const ISprintCollection:ISprintCollection[] = [];
    const currentTime = Math.floor(Date.now() / 1000)

    gottenSprints.forEach( async (sprint) => {
      const found1 = ISprintCollection.some((el:ISprintCollection) => el._id === sprint._id);

      /* Get stories of a product backlog */ /*But why? Just fetch sprints here and do stories elsewhere?*/
      if (!found1) {
        // I don't know why is this here? I am not gonna delete this just in case! - VeliPeli
        //const allStoriesInProductBacklog = (await getStories(projectId, "/")).data.data as IStory[];
        //if(allStoriesInProductBacklog) setProductBacklog(allStoriesInProductBacklog);
        //setStories(allStoriesInProductBacklog);
        sprintDict[sprint._id] = sprint.name;
        setSprintDict(sprintDict);
      }

      /*  CORRECTION - just active sprint */

      /* Get stories of a active sprint */
      if (!found1 && sprint.startTime < currentTime && currentTime < sprint.endTime) {
        ISprintCollection.push({ _id: sprint._id, name: sprint.name,  stories: []});
        const allStories = (await getStories(projectId, sprint._id)).data.data as IStory[];
        const found2 = ISprintCollection.find((el:ISprintCollection) => el._id === sprint._id);

        /* Filter already accepted and realized stories */
        if(found2){
          acceptedStories.length = 0;
          allStories.forEach( async (story) => {
            if(story.status === "ACCEPTED") {
              const found3 = acceptedStories.some((el:IStory) => el._id === story._id);
              if(!found3) acceptedStories.push(story);
              setAcceptedStories(acceptedStories)
            }
            else {
              const found3 = found2.stories.some((el:IStory) => el._id === story._id);
              if(!found3) found2.stories.push(story);
            }
          });
        }
        setStories(allStories);
      }
    
      /* Get accepted stories from unactive sprints */
      if (!found1){
        const allStories = (await getStories(projectId, sprint._id)).data.data as IStory[];
        allStories.forEach( async (story) => {
          if(story.status === "ACCEPTED") {
            const found3 = acceptedStories.some((el:IStory) => el._id === story._id);
            if(!found3) acceptedStories.push(story);
            setAcceptedStories(acceptedStories);
          }
        });
      }

     });
     setSprintCollection(ISprintCollection); // Update sprint and its stories
     return ISprintCollection
  }
  /* "PROD_LEAD" can accept story once it is finished*/
  const handleAcceptUserStory = async (story: IStory) => {
    if(userRole === "PROD_LEAD"){
      /* CHECK IF ALL TASKS IN THIS STORY ARE COMPLETED */
      try {
        const gottenTasks = (await getTasks(projectId, story.sprintId, story._id)).data.data as ITask[];
        let allCompleted = 1;
        gottenTasks.map((task, index) => {
          if (task.status != "completed"){
            allCompleted = 0;
          }
        })
        if(allCompleted) {
          await acceptUserStory(projectId, story.sprintId, story._id);
          openSnack("Story was successfully accepted!", "success", true);
        }
        else {
          openSnack("All tasks in this story need to be completed first!", "error");
        }
      } catch (e) {
        openSnack("Something went wrong!", "error");
      }
    }
    const ISprintCollection = await fetchSprints();
  }

  /* "PROD_LEAD" can reject story and it goes back to product backlog*/
  const handleRejectUserStory = async (story: IStory) => {
    setRejectedStoryId(story._id)
    setRejectedStorySprintId(story.sprintId)
    openRejectDialog();
  }

  /* TEMPORARY - MOVE ACCEPTED STORY BACK TO UNREALIZED STORIES*/
  const handleRestoreUserStory = async (story: IStory) => {
    if(userRole === "PROD_LEAD"){
      try {
        //await setUserStoryStatus(projectId, story.sprintId, story._id, "ACTIVE");
        openSnack("Cant mark story as active!", "error");
      } catch (e) {
        openSnack("Something went wrong!", "error");
      }
    }
    const ISprintCollection = await fetchSprints();
    setAcceptedStories(acceptedStories);
  }
  const openRejectDialog = () => {
    setRejectDialogOpen(true);
  }
  const closeRejectDialog = () => {
    fetchSprints();
    setRejectDialogOpen(false);
  }

  const openStoryDialog = (storyId?: string) => {
    storyId !== undefined && setEditId(storyId);
    setStoryDialogOpen(true);
  }

  const closeStoryDialog = () => {
    setStoryDialogOpen(false);
    setEditId(undefined);
    fetchSprints();
  }

  // Story to sprint dialog

  const openStoryToSprintDialog = (storyId?: string) => {
    storyId !== undefined && setEditId(storyId);
    setStoryToSprintOpen(true);
  }

  const closeStoryToSprintDialog = () => {
    setStoryToSprintOpen(false);
    setEditId(undefined);
    fetchSprints();
  }

  /* "PROD_LEAD" can reject story and it goes back to product backlog*/
  const handleOpenDeleteStoryDialog = async (storyId: string) => {
    setDeletedStoryId(storyId);
    openDeleteStoryDialog();
  }
  const openDeleteStoryDialog = () => {
    setDeleteStoryDialogOpen(true);
  }
  const closeDeleteStoryDialog = () => {
    fetchSprints();
    setDeleteStoryDialogOpen(false);
  }

  /* "METH_KEEPER" can change time estimate of story*/
  const handleOpenEditStoryDialog = async (storyId: string, storyToEdit: IStory) => {
    setEditStoryId(storyId);
    await setEditedStory(storyToEdit);
    openEditStoryDialog();
  }
  const openEditStoryDialog = () => {
    setEditStoryDialogOpen(true);
  }
  const closeEditStoryDialog = () => {
    fetchSprints();
    setEditStoryDialogOpen(false);
  }

  function flatMap(array: string[], fn:any) {
    let result:any = [];
    for (var i = 0; i < array.length; i++) {
      let mapping = fn(array[i]);
      if(i==array.length-1) mapping.pop();
      result = result.concat(mapping);
    }
    return result;
  }

  return (
    <>

      <div className="page_subtitle" style={{ marginBottom: 20 }}>Product backlog</div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 20, marginBottom: 30 }}>

        { /* ADD NEW STORY */}
        { (userRole === "PROD_LEAD" || userRole === "METH_KEEPER") &&
          <>
            <Button variant="contained" color="primary" onClick={() => openStoryDialog()} >ADD NEW STORY</Button>
          </>
        }
        { /* COSMETIC FIX */}
        { (userRole === "DEV_TEAM_MEMBER") &&
          <>
            <Button variant="contained" color="default" onClick={() => void 0}>ADD NEW STORY</Button>
          </>
        }

        { /* ADD TO SPRINT*/}
        { (userRole === "METH_KEEPER") &&
          <>
            <Button variant="contained" color="primary" onClick={() => openStoryToSprintDialog()}>ADD TO SPRINT </Button>
          </>
        }
        { /* COSMETIC FIX */}
        { (userRole !== "METH_KEEPER") &&
          <>
            <Button variant="contained" color="default" onClick={() => void 0}>ADD TO SPRINT </Button>
          </>
        }

        
      </div>
     
      <StoryDialog projectId={projectId} sprintId={sprintId} open={storyDialogOpen} handleClose={closeStoryDialog} openSnack={openSnack} editId={editId} />
      <StoryToSprintDialog projectId={projectId} sprintId={sprintId} open={storyToSprintOpen} handleClose={closeStoryToSprintDialog} openSnack={openSnack} editId={editId} />

      {/* TABS */}
      <div>
              <Tabs value={valueTab} onChange={handleChange} aria-label="simple tabs example" >
              <Tab label="Unrealized stories"  />
              <Tab label="Realized stories"  />
              </Tabs>
            
          <TabPanel value={valueTab} index={0}>
              <div>
              <div>
                {/* STORY CARDS IN PRODUCT BACKLOG*/}
                <div>
                  <Typography component={'span'} display = "block" variant="subtitle2" className="story_row_status">
                    {productBacklog === undefined || productBacklog.length == 0 ? 'No stories in product backlog.' : ''}
                  </Typography>
                </div>
                {
                  productBacklog.map((story, i) =>(
                    <div key={i} className="story_row">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div className="story_row_title">{story.name}</div>
                          <div className="story_label" style={{ display: "flex", marginTop: 10 }}>Description:</div>
                          <div className="story_value">{story.description}</div>

                          {/*Only show comment of product owner if it has been updated*/}
                          {story.comment != "NO_COMMENT" &&
                            <>
                            <div className="story_label">Comment:</div>
                            <div className="story_value">{story.comment}</div>
                            </>
                          }

                          <div className="story_label" style={{ display: "flex", marginTop: 10 }}>Tests:</div>
                          <div className="story_value" style = {{ whiteSpace: "pre-line"}}>{flatMap(story.tests.split('#'), function (part:any) {return [part, <span style={{color: "#0097E8"}}>#</span>];})}</div>
                          <div style={{ display: "flex", marginTop: 10 }}>
                            <div style={{ marginRight: 20 }}>
                              <div className="story_label">Status:</div>
                              {allStatuses.map((status, j) => (
                                story.status==status.type? (<div className="story_value">{status.label}</div>) :
                                  <></>
                              ))}
                            </div>

                            <div style={{ marginRight: 20 }}>
                              <div className="story_label">Priority:</div>
                              {allPriorities.map((priority, j) => (
                                story.priority==priority.type? (<div className="story_value">{priority.label}</div>) :
                                  <></>
                              ))}
                            </div>

                            <div>
                              <div className="story_label">Time estimate:</div>
                              <div className="story_value">{story.timeEstimate} Points</div>
                            </div>

                            <div>
                              <div className="story_label">Business Value:</div>
                              <div className="story_value">{story.businessValue}</div>
                            </div>
                          </div>
                        </div>
                        <div className="sprint_row_icons">
                          {(userRole == "PROD_LEAD" || userRole == "METH_KEEPER")  &&
                          <>
                            <IconButton color="primary" onClick={() => handleOpenDeleteStoryDialog(story._id)}>
                            <DeleteRounded />
                          </IconButton>
                          <IconButton color="primary" onClick={() => handleOpenEditStoryDialog(story._id, story)}>
                            <EditRounded />
                          </IconButton>
                          </>
                          }
                        </div>
                      </div>
                    ))
                }
              </div>

              {/* Delete story dialog*/}
              { <DeleteStoryDialog projectId={projectId} storyId={deletedStoryId} open={deleteStoryDialogOpen} handleClose={closeDeleteStoryDialog} openSnack={openSnack} /> }

              {/* Edit story dialog*/}
              { editedStory && editStoryDialogOpen && <EditStoryDialog projectId={projectId} storyId={editStoryId} story={editedStory} open={editStoryDialogOpen} handleClose={closeEditStoryDialog} openSnack={openSnack} userRole = {userRole} /> }

              {/*<Button variant="contained" color="primary" style={{ alignSelf: "flex-start" }}>ADD USER STORY</Button>*/}

              <hr style={{ margin: "30px 0"}}/>

              <Typography variant="h6" style={{ margin: "30px 0"}}>Active user stories</Typography>
              <Typography component={'span'} display = "block" variant="subtitle2" className="story_row_status">
                {ISprintCollection === undefined || ISprintCollection.length == 0 ? 'No active sprints.' : ''}
              </Typography>
              {/* DIFFERENT SPRINTS */}
              {
                ISprintCollection.map((sprint, i) => (
                  <div key={i}>
                    <div>
                      <Typography key={i} component={'span'} display = "block" variant="subtitle2" className="story_row_status">
                        {sprint.stories === undefined || sprint.stories.length == 0 ? 'No stories in sprint '.concat(sprint.name) : ''}
                      </Typography>
                    </div>
                    <div>
                    {/* ACTIVE STORY CARDS */}
                    {
                      sprint.stories.map((story, j) =>(
                        <div key={i} className="story_row">
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div className="story_row_title">{story.name}</div>
                          <div className="story_value" style={{ padding: 10 }}>{story.description}</div>
                          <div style={{ display: "flex", marginTop: 10 }}>
                            <div style={{ marginRight: 20 }}>
                                <div className="story_label">Sprint:</div>
                                <div className="story_value">{sprint.name}</div>
                            </div>
                            <div style={{ marginRight: 20 }}>
                              <div className="story_label">Tests:</div>
                                <div className="story_value" style = {{ whiteSpace: "pre-line"}}>{flatMap(story.tests.split('#'), function (part:any) {return [part, <span style={{color: "#0097E8"}}>#</span>];})}</div>
                            </div>
                          </div>
                          <div style={{ display: "flex", marginTop: 10 }}>
                          
                            <div style={{ marginRight: 20 }}>
                              <div className="story_label">Status:</div>
                              {allStatuses.map((status, j) => (
                                story.status==status.type? (<div className="story_value">{status.label}</div>) :
                                  <></>
                              ))}
                            </div>

                            <div style={{ marginRight: 20 }}>
                              <div className="story_label">Priority:</div>
                              {allPriorities.map((priority, j) => (
                                story.priority==priority.type? (<div className="story_value">{priority.label}</div>) :
                                  <></>
                              ))}
                            </div>
                            
                            <div>
                              <div className="story_label">Time estimate:</div>
                              <div className="story_value">{story.timeEstimate} Points</div>
                            </div>
                            <div>
                              <div className="story_label">Business Value:</div>
                              <div className="story_value">{story.businessValue}</div>
                            </div>
                  
                          </div>
                        </div>
                        {userRole ==="PROD_LEAD" &&
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <div className="story_value">Acceptance test</div>
                          <div className="story_row_icons">
                            <IconButton color="primary" disabled={userRole !== "PROD_LEAD" || story.status !== "COMPLETED"} onClick={() => handleAcceptUserStory(story)}>
                              <DoneRoundedIcon /> 
                              <Typography component={'span'} display = "block" variant="caption">Accept</Typography>
                            </IconButton>
                            <IconButton color="primary" disabled={userRole !== "PROD_LEAD" } onClick={() => handleRejectUserStory(story)}>
                              <CloseRoundedIcon />
                              <Typography component={'span'} display = "block" variant="caption">Reject</Typography>
                            </IconButton>
                          </div>
                        </div>
                        }
                        { <RejectStoryDialog projectId={projectId} sprintId={rejectedStorySprintId} storyId={rejectedStoryId} open={rejectDialogOpen} handleClose={closeRejectDialog} openSnack={openSnack} /> }

                      </div>
                      ))
                    }
                    </div>
                  </div>
                ))
              }
              </div>
          </TabPanel>
          <TabPanel value={valueTab} index={1}>
            <div>
              {/* ACCEPTED AND REALIZED STORY CARDS*/}
              <div>
                <Typography component={'span'} display = "block" variant="subtitle2" className="story_row_status">
                  {acceptedStories === undefined || acceptedStories.length == 0 ? 'No stories realized yet.' : ''}
                </Typography>
              </div>
              {
                acceptedStories.map((story, i) =>(
                  <div key={i} className="story_row">
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div className="story_row_title">{story.name}</div>
                      <div className="story_value" style={{ padding: 10 }}>{story.description}</div>
                      <div className="story_label">Tests:</div>
                      <div className="story_value" style = {{ whiteSpace: "pre-line"}}>{flatMap(story.tests.split('#'), function (part:any) {return [part, <span style={{color: "#0097E8"}}>#</span>];})}</div>
                      <div style={{ display: "flex", marginTop: 10 }}>
                      <div style={{ marginRight: 20 }}>
                              <div className="story_label">Sprint:</div>
                              <div className="story_value">{sprintDict[story.sprintId]}</div>
                            </div>

                        <div style={{ marginRight: 20 }}>
                          <div className="story_label">Status:</div>
                          {allStatuses.map((status, j) => (
                                story.status==status.type? (<div className="story_value">{status.label}</div>) :
                                  <></>
                          ))}
                        </div>

                        <div style={{ marginRight: 20 }}>
                          <div className="story_label">Priority:</div>
                          {allPriorities.map((priority, j) => (
                                story.priority==priority.type? (<div className="story_value">{priority.label}</div>) :
                                  <></>
                          ))}
                        </div>

                        <div>
                            <div className="story_label">Time estimate:</div>
                            <div className="story_value">{story.timeEstimate} Points</div>
                          </div>
                          <div>
                            <div className="story_label">Business Value:</div>
                            <div className="story_value">{story.businessValue}</div>
                          </div>
                      </div>
                    </div>
                    {/*<div className="story_row_icons">
                      <IconButton color="primary" onClick={() => handleRestoreUserStory(story)}>
                        <CloseRoundedIcon />
                        <Typography component={'span'} display = "block" variant="caption">Restore</Typography>
                      </IconButton>
                    </div>*/}
                  </div>
                  ))
              }
            </div>
          </TabPanel>
      </div>
    </>
  )
}