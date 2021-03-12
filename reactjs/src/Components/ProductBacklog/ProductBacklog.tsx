import React, {useState} from "react";
import "./productbacklog.css";
import {Button} from "@material-ui/core";
import {IProject} from "../ProjectList/IProjectList";
import {IStories} from "./IStories"
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from "@material-ui/core/Typography";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {TabPanel} from "./TabPanel"

/* Just for now ...*/
const allStories: IStories[] = [
  {
    _id: "string",
    storyName: "dshjf",
    storyTimeEstimate: 5,
    storyBusinessValue: 4,
    storyComment: "Comment",
    storyPriority: 5,
    storyTests: "string",
    storyStatus: "blabla",
    storyProjectId: "string",
    storySprintId: "string"
  }
];

const allProjects: IProject[] = [
    {
      _id: "0",
      name: "Super Mario Brothers",
      description: ""
    },
    {
      _id: "1",
      name: "Mario Kart",
      description: ""
    }
  ];
export default () => {
  const [ projects, setProjects ] = useState<IProject[]>(allProjects);
  let [selectedProject, setSelectedProject] = React.useState(allProjects[0]);
  const [valueTab, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="product_backlog_container">
        <div className="page_title">Product backlog / User Stories</div>
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
                        <Button key={i} onClick={() => setSelectedProject(project)} style={{justifyContent: "flex-start"}}>{project.name}</Button>
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
                <Typography variant="h6">
                    {selectedProject.name}
                </Typography>
                
                {/* TABS */}
                <div>
                        <Tabs value={valueTab} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Unrealized stories"  />
                        <Tab label="Realized stories"  />
                        </Tabs>
                    
                    <TabPanel value={valueTab} index={0}>
                        <p>Assigned to sprints </p>
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