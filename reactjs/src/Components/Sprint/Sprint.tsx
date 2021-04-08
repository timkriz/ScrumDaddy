import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {IProject, ISprint, IStory, IProjectUser} from "../ProjectList/IProjectList";
import {ArrowBackRounded, ArrowForwardRounded, DeleteRounded, EditRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import {Color} from "@material-ui/lab/Alert";
import {getProject, getProjectUser} from "../../api/ProjectService";
import {getSprint} from "../../api/SprintService";
import {getStories} from "../../api/UserStoriesService";
import "./sprint.css";
import moment from "moment";
import {getUserId} from "../../api/TokenService";
import {ProjectRoles, projectRoleTitles} from "../../data/Roles";
import StoryNotes from "./StoryNotes";
import Typography from "@material-ui/core/Typography";

interface IProjectParams {
  projectId: string;
}

interface ISprintParams {
  sprintId: string;
}

export default () => {
  const [ sprint, setSprint ] = useState<ISprint>();
  const [ project, setProject] = useState<IProject>();
  const [ stories, setStories ] = useState<IStory[]>([]);
  const [ userRole, setUserRole ] = useState<ProjectRoles>();

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const { projectId } = useParams<IProjectParams>();
  const { sprintId } = useParams<ISprintParams>();
  
  const history = useHistory();

  useEffect(() => {
    fetchProject();
    fetchSprint();
    fetchStories();
    fetchProjectUser();
  }, [ projectId, sprintId ]);

  const fetchProject = async () => {
    console.log(projectId)
    const gottenProject = (await getProject(projectId)).data.data as IProject;
    setProject(gottenProject);
  }

  const fetchSprint = async () => {
    const gottenSprint = (await getSprint(projectId, sprintId)).data.data as ISprint;
    setSprint(gottenSprint);
  }

  const fetchStories = async () => {
    const gottenStories = (await getStories(projectId, sprintId)).data.data as IStory[];
    setStories(gottenStories);
  }

  const fetchProjectUser = async () => {
    const userId = getUserId();
    if(userId !== null) {
      const gottenProjectUser = (await getProjectUser(projectId, userId)).data.data as IProjectUser;
      setUserRole(gottenProjectUser.userRole);
    }
  }

  const back = () => {
    history.push(`/projects/${projectId}`);
  }

  const storyDetailsClick = (storyId: string) => {
    history.push(`/projects/${projectId}/sprints/${sprintId}/stories/${storyId}`);
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
        sprint !== undefined && project !== undefined &&
        <>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackOpen} autoHideDuration={6000} onClose={closeSnack}>
                <Alert variant="filled" onClose={closeSnack} severity={snackSeverity}>{snackMessage}</Alert>
            </Snackbar>
            
            <Typography style = {{textAlign: "right"}} variant="body1">{ userRole !== undefined ? "Role: "+projectRoleTitles[userRole] : "" }</Typography>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <IconButton size="medium" color="primary" onClick={() => back()}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
                <div className="page_title">{sprint.name}</div>
                <IconButton size="medium" color="secondary" style={{ opacity: 0, cursor: "auto" }}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
            </div>
            <hr style={{ margin: "30px 0" }}/>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                  <div className="page_subtitle" style={{ marginBottom: 20 }}>Stories</div>
                  {
                    stories.map((story, i) => (
                      <div key={i} className="sprint_row">
                        <div style={{ display: "flex", flexDirection: "column", width: "100%"}}>
                          <div style={{ display: "flex"}} className="sprint_row_title">{story.name}</div>
                          <div style={{ display: "flex", marginTop: 10}}>{story.description}</div>

                          <div style={{ display: "flex", marginTop: 10 }}>
                            <div style={{ marginRight: 20 }}>
                                <div className="sprint_label">Status:</div>
                                <div className="sprint_value">{story.status}</div>
                            </div>

                            <div style={{ marginRight: 20 }}>
                              <div className="sprint_label">Priority:</div>
                              <div className="sprint_value">{story.priority}</div>
                            </div>

                            <div>
                              <div className="sprint_label">Business Value:</div>
                              <div className="sprint_value">{story.businessValue}</div>
                            </div>
                          </div>
                           {/* Adding notes input */}
                           { userRole !== undefined && <StoryNotes projectId={projectId} sprintId={sprintId} storyId={story._id} userRole={userRole} openSnack={(message, severity, refresh) => {
                              openSnack(message, severity);}}></StoryNotes>
                           }

                        </div>
                        <div className="sprint_row_icons">
                          <IconButton color="primary" onClick={() => void 0}>
                            <DeleteRounded />
                          </IconButton>
                          <IconButton color="primary" onClick={() => void 0}>
                            <EditRounded />
                          </IconButton>
                          <IconButton color="primary" onClick={() => storyDetailsClick(story._id)}>
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