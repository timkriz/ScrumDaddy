import React, {useEffect, useState} from "react";
import {useParams, useHistory} from "react-router-dom";
import {IProject, ISprint} from "../ProjectList/IProjectList";
import {ArrowBackRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import {Color} from "@material-ui/lab/Alert";
import SpriteDialog from "./SprintDialog";
import {getProject} from "../../api/ProjectService";
import {getSprints} from "../../api/SprintService";
import AddProjectDialog from "../ProjectList/ProjectDialog";

interface IProjectParams {
  id: string;
}

export default () => {
  const [ project, setProject ] = useState<IProject>();
  const [ spriteDialogOpen, setSpriteDialogOpen ] = useState<boolean>(false);
  const [ editId, setEditId ] = useState<string>();
  const [ sprints, setSprints ] = useState<ISprint[]>([]);

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const { id } = useParams<IProjectParams>();
  const history = useHistory();

  useEffect(() => {
    fetchProject();
    fetchSprints();
  }, [ id ]);

  const fetchProject = async () => {
    const gottenProject = (await getProject(id)).data.data as IProject;
    setProject(gottenProject);
  }

  const fetchSprints = async () => {
    const gottenSprints = (await getSprints(id)).data.data as ISprint[];
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

            <SpriteDialog projectId={id} open={spriteDialogOpen} handleClose={closeSprintDialog} openSnack={openSnack} editId={editId} />

            <hr style={{ margin: "30px 0" }}/>
        </>
      }
    </>
  )
}