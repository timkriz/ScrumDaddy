import React, {useEffect, useState} from "react";
import "./productbacklog.css";
import {Button} from "@material-ui/core";
//import {ISprint, IProject} from "../ProjectList/IProjectList";
//import {IStory} from "./IStory"
import {getProjects} from "../../api/ProjectService";
import {getSprints, getStories} from "../../api/UserStoriesService";
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

const allProjects: IProject[] = [
    {
      _id: "6046abf2543fd334f05175e9",
      name: "",
      description: ""
    }
  ];
export default () => {
  const [ projects, setProjects ] = useState<IProject[]>([]);
  const [ sprints, setSprints ] = useState<ISprint[]>([]);
  const [ stories, setStories ] = useState<IStory[]>([]);
  let [selectedProject, setSelectedProject] = React.useState(allProjects[0]);
  const [valueTab, setValue] = React.useState(0);
  const history = useHistory();

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  /* Fetch all projects*/
  const fetchProjects = async () => {
    const allFetchedProjects = (await getProjects()).data.data as IProject[];
    setProjects(allFetchedProjects);
  }
  /* Fetch all sprints*/
  const fetchSprints = async (project_id: string) => {
    const allSprints = (await getSprints(project_id)).data.data as ISprint[];
    setSprints(allSprints);
    allSprints.forEach( (sprint) => {
      fetchStories(sprint._id)
     });
  }
  /* Fetch stories for sprints*/
  const fetchStories = async (sprint_id: string) => {
    const allStories = (await getStories(selectedProject._id, sprint_id)).data.data as IStory[];
    setStories(allStories);
    console.log(allStories)
  }

  const projectSelectionClick= (project: IProject) => {
    setSelectedProject(project);
    fetchSprints(project._id)
  }

  return (
    <div className="product_backlog_container">
        <div className="page_title">Product backlog: {selectedProject.name}</div>
        <hr style={{ margin: "30px 0" }}/>

        <Grid container direction="row" justify="center" alignItems="flex-start">

            {/* SELECT PROJECT */}

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
                    color="primary"
                    aria-label="vertical contained primary button group"
                    variant="text"
                >
                    {
                    projects.map((project, i) => (
                        <Button key={i} onClick={() => projectSelectionClick(project)} style={{justifyContent: "flex-start"}}>{project.name}</Button>
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
                        {
                        sprints.map((sprint, i) => (
                          <Typography key={i} component={'span'} variant="h5" style={{marginBottom: "10px"}}>{sprint.name}</Typography>
                        ))
                        }
                        {/*  CARDS OF STORIES */}
                        {
                        stories.map((story, i) => (
                          <div key={i} className="story_row">
                            <div className="story_row_title">{story.name}</div>
                            <div className="story_row_title">
                              <Typography key={i} component={'span'} display = "block" variant="subtitle2" className="story_row_status">Status: {story.status}</Typography>
                              <Typography key={i} component={'span'} display = "block" variant="subtitle2" className="story_row_status">Priority: {story.priority}</Typography>
                              <Typography key={i} component={'span'} display = "block" variant="subtitle2" className="story_row_status">Business Value: {story.businessValue}</Typography>
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
                        <p>Not assigned to sprints</p>
                        <Button variant="contained" color="primary" style={{ alignSelf: "flex-start" }}>ADD USER STORY</Button>
                    </TabPanel>
                    <TabPanel value={valueTab} index={1}>
                        <p>Realized stories</p>
                    </TabPanel>
                </div>
                </Paper>
            </Grid>
        </Grid>
    </div>
  )
}