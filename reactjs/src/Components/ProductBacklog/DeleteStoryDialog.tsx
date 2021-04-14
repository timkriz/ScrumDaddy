import React, {useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {Color} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {IStory, ISprint} from "./IStory";
import {deleteUserStory} from "../../api/UserStoriesService";


interface IProps {
  projectId: string;
  storyId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ projectId, storyId, open, handleClose, openSnack }: IProps) => {
  const [ text, setText ] = useState<string>("");

  const confirmAction = async () => {
    try {
      await deleteUserStory(projectId, " ", storyId);

      openSnack("This user story was deleted. ", "success", true);
      handleClose();
    } catch (e) {
      openSnack("Failed to delete this user story!", "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      
      <DialogContent style={{ textAlign: "center", padding: "24px" }}>
      Are you sure you want to delete this user story?
      </DialogContent>
      
      <DialogActions style={{ justifyContent: "center", padding: "8px 24px 16px 24px" }}>
        <Button onClick={confirmAction} color="primary" variant="contained">Yes</Button>
        <Button onClick={handleClose} style={{ marginLeft: "50px"}} color="primary" variant="contained">No</Button>
      </DialogActions>
    </Dialog>
  )
}