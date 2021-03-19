import React, {useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {Color} from "@material-ui/lab";
import {ClearRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {getProjectUsers} from "../../api/ProjectService";
import {getStory, putStory, postStory} from "../../api/UserStoriesService";
import {IStory} from "../ProjectList/IProjectList";

interface IProps {
  projectId: string;
  sprintId: string;
  storyId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
  editId?: string;
}

export default ({ projectId, sprintId, storyId, open, handleClose, openSnack, editId }: IProps) => {
  const [ StoryTitle, setStoryTitle ] = useState<string>("");
  const [ StoryDescription, setStoryDescription ] = useState<string>("");
  const [ StoryTime, setStoryTime] = useState<number>(10);


  useEffect(() => {
    if(open) {
      // Fetch Story
      if(editId !== undefined) {
        fetchStory();
      }

      // Clear the fields
      else {
        setStoryTitle("");
        setStoryDescription("");
        setStoryTime(0);
      }
    }
  }, [ open ]);


  const fetchStory = async () => {
    if(editId !== undefined) {
      const gottenStory = (await getStory(projectId, sprintId, editId)).data.data as IStory;

      setStoryTitle(gottenStory.name);
      setStoryTime(gottenStory.timeEstimate);
    }
  }

  const confirmAction = async () => {
    // Edit Story
    if(editId !== undefined) {
      try {
        await putStory(projectId, sprintId, editId, StoryTitle, StoryTime);

        openSnack("Story updated successfully!", "success", true);
        handleClose();
      } catch (e) {
        openSnack("Story update failed!", "error");
      }
    }

    // Add Story
    else {
    try {
      await postStory(projectId, sprintId, StoryTitle, StoryTime);

      openSnack("Story created successfully!", "success", true);
      handleClose();
    } catch (e) {
      openSnack("Story creation failed!", "error");
    }
  }
};

const addAssignRow = () => {
};

const deleteAssignRow = (i: number) => {
};

const handleUserSelect = (e: any, i: number) => {
};



  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{ editId !== undefined ? "Edit" : "Add" } Story</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill out the required fields to { editId !== undefined ? "edit" : "add" } a Story.
        </DialogContentText>
        <TextField
          label="Story Title"
          fullWidth
          value={StoryTitle}
          onChange={(e) => {setStoryTitle(e.target.value)}}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Story description"
          fullWidth
          multiline
          rowsMax={4}
          value={StoryDescription}
          onChange={(e) => {setStoryDescription(e.target.value)}}
          variant="outlined"
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Story Time Estimate"
          type="number"
          value={StoryTime}
          onChange={(e) => {setStoryTime(e.target.value as unknown as number)}}
        />

        <Button variant="contained" color="primary" onClick={addAssignRow} style={{ margin: "20px 0",float: 'right' }}>ASSIGN USER</Button>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleClose} color="primary">
          { editId !== undefined ? "Confirm changes" : "Add" }
        </Button>
      </DialogActions>
    </Dialog>
  )
}