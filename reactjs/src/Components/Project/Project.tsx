import React, {useEffect, useState} from "react";
import {useParams, useHistory} from "react-router-dom";
import {IProject} from "../ProjectList/IProjectList";
import {ArrowBackRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Button} from "@material-ui/core";
import AddProjectDialogContent from "../ProjectList/AddProjectDialog";
import {Color} from "@material-ui/lab/Alert";
import AddSpriteDialog from "./AddSpriteDialog";

interface IProjectParams {
  id: string;
}

export default () => {
  const [ project, setProject ] = useState<IProject>();
  const [ spriteAddDialogOpen, setSpriteAddDialogOpen ] = useState<boolean>(false);

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const { id } = useParams<IProjectParams>();
  const history = useHistory();

  useEffect(() => {
    const fetch = async () => {
      // const gottenProject = (await getProject(id)).data.data as IProject;
      const gottenProject: IProject = { _id: "12a34", projectName: "Super Mario Kart", projectDescription: "" };
      setProject(gottenProject);
    }
    fetch();
  }, [ id ]);

  const back = () => {
    history.push("/projects");
  }

  const handleSnackClose = () => {
    setSnackOpen(false);
  }

  const openSnack = (message: string, severity: Color) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  }

  const openSpriteAddDialog = () => {
    setSpriteAddDialogOpen(true);
  }

  const closeSpriteAddDialog = () => {
    setSpriteAddDialogOpen(false);
  }

  return (
    <>
      {
        project !== undefined &&
        <>
            <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
                <Alert onClose={handleSnackClose} severity={snackSeverity}>{snackMessage}</Alert>
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

            <Button variant="contained" color="primary" onClick={openSpriteAddDialog} style={{ alignSelf: "flex-start", marginTop: 20 }}>ADD SPRINT</Button>

            <AddSpriteDialog projectId={id} open={spriteAddDialogOpen} handleClose={closeSpriteAddDialog} openSnack={openSnack} />

            <hr style={{ margin: "30px 0" }}/>
        </>
      }
    </>
  )
}