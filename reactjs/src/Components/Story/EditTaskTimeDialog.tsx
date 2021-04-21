/* eslint-disable import/no-anonymous-default-export */
import React, {useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {Color} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {editTimeEstimateTask} from "../../api/TaskService";


interface IProps {
  projectId: string;
  taskId: string;
  sprintId: string;
  storyId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ projectId, sprintId, storyId, taskId, open, handleClose, openSnack }: IProps) => {
  const [ text, setText ] = useState<string>("");
  const [ timeEstimate, setTimeEstimate] = useState<number>(10);

  const confirmAction = async () => {
    try {
      await editTimeEstimateTask(projectId, sprintId, storyId, taskId, timeEstimate);
      setTimeEstimate(10);
      openSnack("Time estimate updated.", "success", true);
      handleClose();
    } catch (e) {
      openSnack("Something went wrong...", "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      
      <DialogTitle style={{ textAlign: "center" }}>Estimated remaining time</DialogTitle>

      <TextField
        style={{ marginLeft: "40%", width: "20%" }}
        InputProps={{
          inputProps: { 
            min: 1 ,max: 100
          }
        }}
        label="Time remaining"
        type="number"
        value={timeEstimate}
        onChange={(e) => {setTimeEstimate(e.target.value as unknown as number)}}
      />

      <DialogActions style={{ justifyContent: "center", padding: "8px 24px 16px 24px" }}>
        <Button onClick={confirmAction} color="primary" variant="contained">CONFIRM</Button>
        <Button onClick={handleClose} style={{ marginLeft: "50px"}} color="primary" variant="contained">CANCEL</Button>
      </DialogActions>
    </Dialog>
  )
}