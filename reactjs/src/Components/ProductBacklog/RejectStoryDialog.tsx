import React, {useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {Color} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {IStory, ISprint} from "./IStory";
import {rejectUserStory} from "../../api/UserStoriesService";


interface IProps {
  projectId: string;
  sprintId: string;
  storyId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ projectId, sprintId, storyId, open, handleClose, openSnack }: IProps) => {
  const [ text, setText ] = useState<string>("");

  const confirmAction = async () => {
    try {
      await rejectUserStory(projectId, sprintId, storyId, text);

      openSnack("This user story was marked as unrealized and was put back in the product backlog. ", "success", true);
      handleClose();
    } catch (e) {
      openSnack("User story rejection failed!", "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Reject User Story</DialogTitle>
      <DialogContent>
        User story will be put back in the product backlog. Please state the reason why the story did not pass the acceptance test.
      </DialogContent>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={5}
          value={text}
          onChange={e => setText(e.target.value)}
          label="Story Rejection Reason"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: "space-between", padding: "8px 24px 16px 24px" }}>
        <Button onClick={confirmAction} color="primary" variant="contained">REJECT STORY</Button>
      </DialogActions>
    </Dialog>
  )
}