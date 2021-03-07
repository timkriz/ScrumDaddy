import React, {useState} from "react";
import "./projects.css";
import {Button} from "@material-ui/core";
import {IProject} from "./IProjects";
import AddProjectDialogContent from "./AddProjectDialogContent";
import {ArrowForward, ArrowForwardRounded, DeleteRounded, EditRounded, Face} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

const allProjects: IProject[] = [
  {
    id: 0,
    title: "Super Mario Brothers"
  },
  {
    id: 1,
    title: "Mario Kart"
  }
];

export default () => {
  const [ projects, setProjects ] = useState<IProject[]>(allProjects);
  const [ open, setOpen ] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <div className="projects_container">
      <Button variant="contained" color="primary" onClick={handleOpen}>ADD PROJECT</Button>

      <AddProjectDialogContent open={open} handleClose={handleClose} />

      <hr style={{ margin: "30px 0" }}/>

      {
        projects.map((project, i) => (
          <div key={i} className="project_row">
            <div className="project_row_title">{project.title}</div>
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