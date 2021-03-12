import React, {useEffect, useState} from "react";
import "./project_list.css";
import {Button} from "@material-ui/core";
import {IProject} from "./IProjectList";
import {ArrowForwardRounded, DeleteRounded, EditRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert} from "@material-ui/lab";
import {Color} from "@material-ui/lab/Alert";
import { useHistory } from "react-router-dom";
import {deleteProject, getProjects} from "../../api/ProjectService";
import ProjectDialog from "./ProjectDialog";

export default () => {
  const [ projects, setProjects ] = useState<IProject[]>([]);
  const [ dialogOpen, setDialogOpen ] = useState<boolean>(false);
  const [ editId, setEditId ] = useState<string>();

  const [snackOpen, setSnackOpen] = useState<boolean>(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const [snackSeverity, setSnackSeverity] = useState<Color>("success");

  const history = useHistory();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const allProjects = (await getProjects()).data.data as IProject[];
    setProjects(allProjects);
  }

  const deleteClickedProject = async (id: string) => {
    await deleteProject(id);
    fetchProjects();
  }

  const openDialog = (id?: string) => {
    id !== undefined && setEditId(id);

    setDialogOpen(true);
  }

  const closeDialog = () => {
    setDialogOpen(false);
    setEditId(undefined);
  }

  const closeSnack = () => {
    setSnackOpen(false);
  }

  const openSnack = (message: string, severity: Color, refresh?: boolean) => {
    setSnackMessage(message);
    setSnackSeverity(severity);
    setSnackOpen(true);

    if(refresh) {
      fetchProjects();
    }
  }

  const projectDetailsClick = (id: string) => {
    history.push(`/projects/${id}`);
  }

  return (
    <>
      <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={snackOpen} autoHideDuration={6000} onClose={closeSnack}>
        <Alert onClose={closeSnack} severity={snackSeverity}>{snackMessage}</Alert>
      </Snackbar>

      <div className="page_title">Project List</div>

      <Button variant="contained" color="primary" onClick={() => openDialog()} style={{ alignSelf: "flex-start" }}>ADD PROJECT</Button>

      <ProjectDialog open={dialogOpen} handleClose={closeDialog} openSnack={openSnack} editId={editId} />

      <hr style={{ margin: "30px 0" }}/>

      {
        projects.map((project, i) => (
          <div key={i} className="project_row">
            <div className="project_row_title">{project.name}</div>
            <div className="project_row_icons">
              <IconButton color="primary" onClick={() => deleteClickedProject(project._id)}>
                <DeleteRounded />
              </IconButton>
              <IconButton color="primary" onClick={() => openDialog(project._id)}>
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