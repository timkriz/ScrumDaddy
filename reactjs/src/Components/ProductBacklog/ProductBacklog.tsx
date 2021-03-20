import React, {useEffect, useState} from "react";
import "./productbacklog.css";
import {Button} from "@material-ui/core";
import {getSprints, getStories, rejectUserStory, acceptUserStory} from "../../api/UserStoriesService";
import Typography from "@material-ui/core/Typography";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {TabPanel} from "./TabPanel"
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import {ArrowForwardRounded, DeleteRounded, EditRounded} from "@material-ui/icons";
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';
import DoneRoundedIcon from '@material-ui/icons/DoneRounded';
import {ProjectRoles, SystemRoles} from "../../data/Roles";
import {Color} from "@material-ui/lab";
import RejectStoryDialog from './RejectStoryDialog';

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

  const [valueTab, setValue] = React.useState(0);
  const [ rejectDialogOpen, setRejectDialogOpen ] = useState<boolean>(false);
  const [ rejectedStorySprintId, setRejectedStorySprintId ] = useState<string>("");
  const [ rejectedStoryId, setRejectedStoryId ] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchSprints();
  }, []);

  /* Fetch all sprints */
  const fetchSprints = async () => {
    const gottenSprints = (await getSprints(projectId)).data.data as ISprint[];
    setSprints(gottenSprints);

    const ISprintCollection:ISprintCollection[] = [];
    const currentTime = Math.floor(Date.now() / 1000)

    gottenSprints.forEach( async (sprint) => {
      const found1 = ISprintCollection.some((el:ISprintCollection) => el._id === sprint._id);
      /*  CORRECTION - just active sprint */

      /* Get stories of a sprint */
      if (!found1 && sprint.startTime < currentTime && currentTime < sprint.endTime) {
        ISprintCollection.push({ _id: sprint._id, name: sprint.name,  stories: []});
        const allStories = (await getStories(projectId, sprint._id)).data.data as IStory[];
        const found2 = ISprintCollection.find((el:ISprintCollection) => el._id === sprint._id);

        /* Filter already accepted and realized stories*/
        if(found2){
          acceptedStories.length = 0;
          allStories.forEach( async (story) => {
            if(story.status === "Accepted") {
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
        setStories(allStories)
      }
      /* Get stories of a product backlog */
      if (!found1) {
        const allStoriesInProductBacklog = (await getStories(projectId, "/")).data.data as IStory[];
        if(allStoriesInProductBacklog) setProductBacklog(allStoriesInProductBacklog);
        setStories(allStoriesInProductBacklog)
      }
     });
     setSprintCollection(ISprintCollection); // Update sprint and its stories
     return ISprintCollection
  }

  /* "PROD_LEAD" can accept story once it is finished*/
  const handleAcceptUserStory = async (story: IStory) => {
    if(userRole === "PROD_LEAD"){
      await acceptUserStory(projectId, story.sprintId, story._id);
    }
    const ISprintCollection = await fetchSprints();
  }

  /* "PROD_LEAD" can reject story and it goes back to product backlog*/
  const handleRejectUserStory = async (story: IStory) => {
    setRejectedStorySprintId(story.sprintId)
    setRejectedStoryId(story._id)
    openRejectDialog()
  }

  /* TEMPORARY - MOVE ACCEPTED STORY BACK TO UNREALIZED STORIES*/
  const handleRestoreUserStory = async (story: IStory) => {
    //await rejectUserStory(projectId, story.sprintId, story._id);

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
  return (
    <>

      <div className="page_subtitle" style={{ marginBottom: 20 }}>Product backlog</div>

      {/* TABS */}
      <div>
              <Tabs value={valueTab} onChange={handleChange} aria-label="simple tabs example">
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
                          <div className="story_value">Comment: {story.comment}</div>
                          <div style={{ display: "flex", marginTop: 10 }}>
                            <div style={{ marginRight: 20 }}>
                              <div className="story_label">Status:</div>
                              <div className="story_value">{story.status}</div>
                            </div>

                            <div style={{ marginRight: 20 }}>
                              <div className="story_label">Priority:</div>
                              <div className="story_value">{story.priority}</div>
                            </div>

                            <div>
                              <div className="story_label">Business Value:</div>
                              <div className="story_value">{story.businessValue}</div>
                            </div>
                          </div>
                        </div>
                        <div className="sprint_row_icons">
                          <IconButton color="primary">
                            <DeleteRounded />
                          </IconButton>
                          <IconButton color="primary">
                            <EditRounded />
                          </IconButton>
                          <IconButton color="primary">
                            <ArrowForwardRounded />
                          </IconButton>
                        </div>
                      </div>
                    ))
                }
              </div>

              <Button variant="contained" color="primary" style={{ alignSelf: "flex-start" }}>ADD USER STORY</Button>

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
                          <div style={{ display: "flex", marginTop: 10 }}>
                            <div style={{ marginRight: 20 }}>
                              <div className="story_label">Sprint:</div>
                              <div className="story_value">{sprint.name}</div>
                            </div>

                            <div style={{ marginRight: 20 }}>
                              <div className="story_label">Status:</div>
                              <div className="story_value">{story.status}</div>
                            </div>

                            <div style={{ marginRight: 20 }}>
                              <div className="story_label">Priority:</div>
                              <div className="story_value">{story.priority}</div>
                            </div>

                            <div>
                              <div className="story_label">Business Value:</div>
                              <div className="story_value">{story.businessValue}</div>
                            </div>
                          </div>
                        </div>
                        {userRole ==="PROD_LEAD" &&
                        <div className="story_row_icons">
                          <IconButton color="primary" disabled={userRole !== "PROD_LEAD"} onClick={() => handleAcceptUserStory(story)}>
                            <DoneRoundedIcon /> 
                            <Typography component={'span'} display = "block" variant="caption">Accept</Typography>
                          </IconButton>
                          <IconButton color="primary" disabled={userRole !== "PROD_LEAD"} onClick={() => handleRejectUserStory(story)}>
                            <CloseRoundedIcon />
                            <Typography component={'span'} display = "block" variant="caption">Remove</Typography>
                          </IconButton>
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
                      <div style={{ display: "flex", marginTop: 10 }}>

                        <div style={{ marginRight: 20 }}>
                          <div className="story_label">Status:</div>
                          <div className="story_value">{story.status}</div>
                        </div>

                        <div style={{ marginRight: 20 }}>
                          <div className="story_label">Priority:</div>
                          <div className="story_value">{story.priority}</div>
                        </div>

                        <div>
                          <div className="story_label">Business Value:</div>
                          <div className="story_value">{story.businessValue}</div>
                        </div>
                      </div>
                    </div>
                    <div className="story_row_icons">
                      <IconButton color="primary" onClick={() => handleRestoreUserStory(story)}>
                        <CloseRoundedIcon />
                        <Typography component={'span'} display = "block" variant="caption">Restore story</Typography>
                      </IconButton>
                    </div>
                  </div>
                  ))
              }
            </div>
          </TabPanel>
      </div>
    </>
  )
}