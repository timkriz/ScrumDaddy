import React, {useState} from "react";
import "./projects.css";
import {Button} from "@material-ui/core";
import {IProject} from "./IProjects";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import AddProjectDialogContent from "./AddProjectDialogContent";

export default () => {
  const [ projects, setProjects ] = useState<IProject[]>([]);
  const [ open, setOpen ] = useState<boolean>(false);

  const onAddProjectsClick = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div className="projects_container">
      <Button variant="contained" color="primary" onClick={onAddProjectsClick}>ADD PROJECT</Button>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <AddProjectDialogContent handleClose={handleClose} />
      </Dialog>

      <hr style={{ margin: "30px 0" }}/>

      {
        projects.map((project) => (
          <div/>
        ))
      }
    </div>
  )
}