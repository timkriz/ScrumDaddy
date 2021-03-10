import React, {useState} from "react";
import "./project_list.css";
import {Button} from "@material-ui/core";
import {IProject} from "./IProjectList";
import AddProjectDialogContent from "./AddProjectDialog";
import {ArrowForwardRounded, DeleteRounded, EditRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Color} from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";

const allProjects: IProject[] = [
  {
    _id: "12a34",
    projectName: "Super Mario Brothers"
  },
  {
    _id: "67b3c",
    projectName: "Mario Kart"
  }
];

export default () => {
  const [ projects, setProjects ] = useState<IProject[]>(allProjects);
  const [ open, setOpen ] = useState<boolean>(false);

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const history = useHistory();

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

  const projectDetailsClick = (id: string) => {
    history.push(`/projects/${id}`);
  }

  return (
    <>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackOpen} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity={snackSeverity}>{snackMessage}</Alert>
      </Snackbar>

      <div className="page_title">Project List</div>

      <Button variant="contained" color="primary" onClick={handleOpen} style={{ alignSelf: "flex-start" }}>ADD PROJECT</Button>

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
              <IconButton color="primary" onClick={() => projectDetailsClick(project._id)}>
                <ArrowForwardRounded />
              </IconButton>
            </div>
          </div>
        ))
      }
    </>
  )
}