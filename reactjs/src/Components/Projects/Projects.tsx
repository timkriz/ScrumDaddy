import React, {useState} from "react";
import "./projects.css";
import {Button} from "@material-ui/core";
import {IProject} from "./IProjects";
import AddProjectDialogContent from "./AddProjectDialogContent";
import {ArrowForward, ArrowForwardRounded, DeleteRounded, EditRounded, Face} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Color} from "@material-ui/lab/Alert";

const allProjects: IProject[] = [
  {
    _id: "0",
    projectName: "Super Mario Brothers"
  },
  {
    _id: "1",
    projectName: "Mario Kart"
  }
];

export default () => {
  const [ projects, setProjects ] = useState<IProject[]>(allProjects);
  const [ open, setOpen ] = useState<boolean>(false);

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleSnackClose = () => {
    setSnackOpen(false);
  }

  const openSnack = (message: string, severity: Color) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);
  }

  return (
    <div className="projects_container">
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleClose} severity={snackSeverity}>{snackMessage}</Alert>
      </Snackbar>

      <Button variant="contained" color="primary" onClick={handleOpen}>ADD PROJECT</Button>

      <AddProjectDialogContent open={open} handleClose={handleClose} openSnack={openSnack} />

      <hr style={{ margin: "30px 0" }}/>

      {
        projects.map((project, i) => (
          <div key={i} className="project_row">
            <div className="project_row_title">{project.projectName}</div>
            <div className="project_row_icons">
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
  )
}