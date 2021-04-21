import React, {useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {Color} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {deleteTask} from "../../api/TaskService";

interface IProps {
  projectId: string;
  sprintId: string;
  storyId: string;
  taskId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ projectId, sprintId, storyId, taskId, open, handleClose, openSnack }: IProps) => {
  const confirmAction = async () => {
    try {
      await deleteTask(projectId, sprintId, storyId, taskId);

      openSnack("This task was deleted. ", "success", true);
      handleClose();
    } catch (e) {
      openSnack("Failed to delete this task!", "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      
      <DialogContent style={{ textAlign: "center", padding: "24px" }}>
      Are you sure you want to delete this task?
      </DialogContent>
      
      <DialogActions style={{ justifyContent: "center", padding: "8px 24px 16px 24px" }}>
        <Button onClick={confirmAction} color="primary" variant="contained">Yes</Button>
        <Button onClick={handleClose} style={{ marginLeft: "50px"}} color="primary" variant="contained">No</Button>
      </DialogActions>
    </Dialog>
  )
}