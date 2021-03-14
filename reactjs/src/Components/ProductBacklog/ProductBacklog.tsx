import React, {useEffect, useState} from "react";
import "./productbacklog.css";
import {Button} from "@material-ui/core";
//import {ISprint, IProject} from "../ProjectList/IProjectList";
//import {IStory} from "./IStory"
import {IProjectUser} from "../ProjectList/IProjectList";
import {getProjects, getProjectUser} from "../../api/ProjectService";
import {getSprints, getStories} from "../../api/UserStoriesService";
import {getUserId, getUserRole} from "../../api/TokenService";
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {TabPanel} from "./TabPanel"
import { useHistory } from "react-router-dom";
import IconButton from "@material-ui/core/IconButton";
import {ArrowForwardRounded, DeleteRounded, EditRounded} from "@material-ui/icons";
import {ProjectRoles, SystemRoles} from "../../data/Roles";

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
  priority: number;
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

export default () => {
  const [ projects, setProjects ] = useState<IProject[]>([]);
  const [ sprints, setSprints ] = useState<ISprint[]>([]);
  const [ stories, setStories ] = useState<IStory[]>([]);
  const [ ISprintCollection, setSprintCollection ] = useState<ISprintCollection[]>([]);
  let [selectedProject, setSelectedProject] = useState<IProject>(project1[0]);
  const [valueTab, setValue] = React.useState(0);
  const [selectedBtn, setSelectedBtn] = React.useState(-1);
  const history = useHistory();
  const userRole = getUserRole();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* Fetch all projects */
  const fetchProjects = async () => {
    const userId = getUserId();
    if(userId !== null) {
      const allFetchedProjects = (await getProjects()).data.data as IProject[];

      /* Show projects that belong to the user */
      let shownProjects: IProject[] = [];
      let shownProjectRoles: (ProjectRoles | null)[] = [];

      for(let i = 0; i < allFetchedProjects.length; i++) {
        const curProject = allFetchedProjects[i];
        const gottenProjectUser = (await getProjectUser(curProject._id, userId)).data.data as IProjectUser;

        if(userRole === SystemRoles.ADMIN || gottenProjectUser !== null) {
          shownProjects.push(curProject);
          shownProjectRoles.push(gottenProjectUser ? gottenProjectUser.userRole : null);
        }
      }
      setProjects(shownProjects);
      /* Set initial project to first one*/
      if(shownProjects[0] != undefined) {
        setSelectedProject(shownProjects[0])
        const ISprintCollection = await fetchSprints(shownProjects[0]._id);  
        setSprintCollection(ISprintCollection);
        setSelectedBtn(0) // Change button color
      }
      //setProjectRoles(shownProjectRoles);
    }
  }

  /* Fetch all sprints */
  const fetchSprints = async (project_id: string) => {
    const allSprints = (await getSprints(project_id)).data.data as ISprint[];
    const ISprintCollection:ISprintCollection[] = [];

    setSprints(allSprints);
    allSprints.forEach( async (sprint) => {
      const found1 = ISprintCollection.some((el:ISprintCollection) => el._id === sprint._id);
      if (!found1) ISprintCollection.push({ _id: sprint._id, name: sprint.name,  stories: []});

      /* Get stories of a sprint */
      const allStories = (await getStories(project_id, sprint._id)).data.data as IStory[];
      const found2 = ISprintCollection.find((el:ISprintCollection) => el._id === sprint._id);
      if(found2){
        found2.stories = allStories;
      }
      setStories(allStories)
     });
     return ISprintCollection
  }
 
  const projectSelectionClick = async (project: IProject, buttonIn:number) => {
    setSelectedProject(project); // Update clicked project
    const ISprintCollection = await fetchSprints(project._id);  
    setSprintCollection(ISprintCollection); // Update sprint and its stories
    setSelectedBtn(buttonIn) // Change button color
    console.log(buttonIn)
  }

  return (
    <div className="product_backlog_container">

        <Grid container direction="row" justify="center" alignItems="flex-start">

            {/* PROJECT SELECTION */}

            <Grid item xs={12} md={3}>
            <Paper elevation={0} style={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                }} className="project_">
                <Typography variant="h6">
                    List of my projects
                </Typography>
                <div className="">
                <ButtonGroup 
                    orientation="vertical"
                    aria-label="vertical contained button group"
                    variant="text"
                >
                    {
                    projects.map((project, i) => (
                        <Button key={i} onClick={() => projectSelectionClick(project, i)} style={selectedBtn == i ?{justifyContent: "flex-start", color: "#26a69a"} : {justifyContent: "flex-start", color: "#000000"}}>{project.name}</Button>
                    ))
                    }
                </ButtonGroup>
                </div>
            </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
                <Paper elevation={0} style={{
                    backgroundColor: "transparent",
                    boxShadow: "none",
                }} className="{paper_project">
                
                {/* TABS */}
                <div>
                        <Tabs value={valueTab} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Unrealized stories"  />
                        <Tab label="Realized stories"  />
                        </Tabs>
                    
                    <TabPanel value={valueTab} index={0}>
                        <div>
                        <div className="page_subtitle" style={{ marginBottom: 20 }}>Sprint backlog</div>
                        {/* DIFFERENT SPRINTS */}
                        {
                          ISprintCollection.map((sprint, i) => (
                            <div key={i}>
                              <Typography key={i} variant="h6">{sprint.name}</Typography>

                              <div>
                                <Typography key={i} component={'span'} display = "block" variant="subtitle2" className="story_row_status">
                                  {sprint.stories === undefined || sprint.stories.length == 0 ? 'No stories in sprint' : ''}
                                </Typography>
                                </div>
                              <div>
                              {/* DIFFERENT STORY CARDS */}
                              {
                                sprint.stories.map((story, j) =>(
                                  <div key={j} className="story_row">
                                    <div className="story_row_title">{story.name}</div>
                                    <div className="story_row_title">
                                      <Typography key={j} component={'span'} display = "block" variant="subtitle2" className="story_row_status">Status: {story.status}</Typography>
                                      <Typography key={j} component={'span'} display = "block" variant="subtitle2" className="story_row_status">Priority: {story.priority}</Typography>
                                      <Typography key={j} component={'span'} display = "block" variant="subtitle2" className="story_row_status">Business Value: {story.businessValue}</Typography>
                                    </div>
                                    <div className="story_row_icons">
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
                            </div>
                          ))
                        }
                        </div>
                        <hr style={{ margin: "30px 0" }}/>
                        <div className="page_subtitle" style={{ marginBottom: 20 }}>Product backlog</div>

                        <Typography component={'span'} display = "block" variant="subtitle2" className="story_row_status">
                                Needs an new endpoint i think
                        </Typography>
                        <Button variant="contained" color="primary" style={{ alignSelf: "flex-start" }}>ADD USER STORY</Button>
                    </TabPanel>
                    <TabPanel value={valueTab} index={1}>
                        <Typography component={'span'} display = "block" variant="subtitle2" className="story_row_status">
                                In progress
                        </Typography>
                    </TabPanel>
                </div>
                </Paper>
            </Grid>
        </Grid>
    </div>
  )
}