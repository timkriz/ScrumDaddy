import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {IProject, ISprint} from "../ProjectList/IProjectList";
import {ArrowBackRounded, ArrowForwardRounded, DeleteRounded, EditRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import {Color} from "@material-ui/lab/Alert";
import {getProject} from "../../api/ProjectService";
import {deleteSprint, getSprints} from "../../api/SprintService";
import "./project.css";
import moment from "moment";
import SprintDialog from "./SprintDialog";

interface IProjectParams {
  projectId: string;
}

export default () => {
  const [ project, setProject ] = useState<IProject>();
  const [ spriteDialogOpen, setSpriteDialogOpen ] = useState<boolean>(false);
  const [ editId, setEditId ] = useState<string>();
  const [ sprints, setSprints ] = useState<ISprint[]>([]);

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const { projectId } = useParams<IProjectParams>();
  const history = useHistory();

  useEffect(() => {
    fetchProject();
    fetchSprints();
  }, [ projectId ]);

  const fetchProject = async () => {
    const gottenProject = (await getProject(projectId)).data.data as IProject;
    setProject(gottenProject);
  }

  const fetchSprints = async () => {
    const gottenSprints = (await getSprints(projectId)).data.data as ISprint[];
    setSprints(gottenSprints);
  }

  const back = () => {
    history.push("/projects");
  }

  const closeSnack = () => {
    setSnackOpen(false);
  }

  const openSnack = (message: string, severity: Color, refresh?: boolean) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);

    if(refresh) {
      fetchSprints();
    }
  }

  const openSprintDialog = (sprintId?: string) => {
    sprintId !== undefined && setEditId(sprintId);

    setSpriteDialogOpen(true);
  }

  const closeSprintDialog = () => {
    setSpriteDialogOpen(false);
    setEditId(undefined);
  }

  const sprintDetailsClick = (sprintId: string) => {
    history.push(`/projects/${projectId}/sprints/${sprintId}`);
  }

  const deleteClickedSprint = async (sprintId: string) => {
    await deleteSprint(projectId, sprintId);
    fetchSprints();
  }

  return (
    <>
      {
        project !== undefined &&
        <>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackOpen} autoHideDuration={6000} onClose={closeSnack}>
                <Alert onClose={closeSnack} severity={snackSeverity}>{snackMessage}</Alert>
            </Snackbar>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <IconButton size="medium" color="primary" onClick={back}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
                <div className="page_title">{project.projectName}</div>
                <IconButton size="medium" color="secondary" style={{ opacity: 0, cursor: "auto" }}>
                    <ArrowBackRounded fontSize="large" />
                </IconButton>
            </div>

            <Button variant="contained" color="primary" onClick={() => openSprintDialog()} style={{ alignSelf: "flex-start", marginTop: 20 }}>ADD SPRINT</Button>

            <SprintDialog projectId={projectId} open={spriteDialogOpen} handleClose={closeSprintDialog} openSnack={openSnack} editId={editId} />

            <hr style={{ margin: "30px 0" }}/>

            {
              sprints.map((sprint, i) => (
                <div key={i} className="sprint_row">
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div className="sprint_row_title">{sprint.sprintName}</div>
                    <div style={{ display: "flex", marginTop: 10 }}>
                      <div style={{ marginRight: 20 }}>
                        <div className="sprint_label">Start Date:</div>
                        <div className="sprint_value">{moment(sprint.sprintStartTime).format("DD.MM.YYYY")}</div>
                      </div>

                      <div style={{ marginRight: 20 }}>
                        <div className="sprint_label">End Date:</div>
                        <div className="sprint_value">{moment(sprint.sprintEndTime).format("DD.MM.YYYY")}</div>
                      </div>

                      <div>
                        <div className="sprint_label">Sprint Velocity:</div>
                        <div className="sprint_value">{sprint.sprintVelocity}</div>
                      </div>
                    </div>
                  </div>
                  <div className="sprint_row_icons">
                    <IconButton color="primary" onClick={() => deleteClickedSprint(project._id)}>
                      <DeleteRounded />
                    </IconButton>
                    <IconButton color="primary">
                      <EditRounded />
                    </IconButton>
                    <IconButton color="primary" onClick={() => sprintDetailsClick(sprint._id)}>
                      <ArrowForwardRounded />
                    </IconButton>
                  </div>
                </div>
              ))
            }
        </>
      }
    </>
  )
}