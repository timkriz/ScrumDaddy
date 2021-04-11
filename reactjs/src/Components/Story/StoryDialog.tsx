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
import {putStory, postStory} from "../../api/StoryService";
import {getStory} from "../../api/UserStoriesService";
import {IStory} from "../ProjectList/IProjectList";
import {allPriorities, Priorities} from "./Priorities"; 
import {allStatuses, Status} from "./Status"; 
import { stat } from "node:fs";
import "./story.css";
import {rejectUserStory} from "../../api/UserStoriesService";


interface IProps {
  projectId: string;
  sprintId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
  editId?: string;
}

export default ({ projectId, sprintId, open, handleClose, openSnack, editId }: IProps) => {
  const [ id, setId] = useState<string>("");
  const [ name, setName ] = useState<string>("");
  const [ description, setDescription ] = useState<string>("");
  const [ timeEstimate, setTimeEstimate] = useState<number>(10);
  const [ bussinesValue, setBussinesValue] = useState<number>(10);
  const [ priority, setPriority] = useState<Priorities>(Priorities.MUST_HAVE);
  const [ comment, setComment] = useState<string>("");
  const [ tests, setTests] = useState<string>("");
  const [ status, setStatus] = useState<Status>(Status.UNASSIGNED);
  


  useEffect(() => {
    if(open) {
      // Fetch Story
      if(editId !== undefined) {
        fetchStory();
      }

      // Clear the fields
      else {
        setName("");
        setDescription("");
        setTimeEstimate(10);
        setBussinesValue(10);
        setPriority(Priorities.MUST_HAVE);
        setComment("");
        setTests("");
        setStatus(Status.UNASSIGNED);
        
      }
    }
  }, [ open ]);


  const fetchStory = async () => {
    if(editId !== undefined) {
      const gottenStory = (await getStory(projectId, sprintId, editId)).data.data as IStory;

      setName(gottenStory.name);
      setTimeEstimate(gottenStory.timeEstimate);
    }
  }

  const confirmAction = async () => {
    /* // Edit Story
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
    else {*/
    try {
      console.log(projectId, sprintId, name, description, timeEstimate, bussinesValue, priority, comment, tests, status)
      const response = await postStory(projectId, sprintId, name, description, timeEstimate, bussinesValue, priority, comment, tests, status);
      setId(response.data.data._id);
      console.log(response.data.data._id);
      console.log(id);
      if (response.data.data._id){
        await rejectUserStory(projectId, sprintId, response.data.data._id, comment);
      }

      openSnack("Story created successfully!", "success", true);
      handleClose();
    } catch (e) {
      let message = "Story creation failed!";
      if(e && e.response && e.response.data && e.response.data.message) message = e.response.data.message;
      openSnack(message, "error");
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
          value={name}
          onChange={(e) => {setName(e.target.value)}}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Story description"
          fullWidth
          multiline
          rowsMax={4}
          value={description}
          onChange={(e) => {setDescription(e.target.value)}}
          variant="outlined"
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
          <TextField
            style={{ margin: 10, width: "20%" }}
            InputProps={{
              inputProps: { 
                min: 1 ,max: 100
              }
            }}
            label="Time Estimate"
            type="number"
            value={timeEstimate}
            onChange={(e) => {setTimeEstimate(e.target.value as unknown as number)}}
          />

          <TextField
            style={{margin: 10, width: "20%" }}
            InputProps={{
              inputProps: { 
                  min: 1, max: 100, maxLength: 2 
              }
            }}
            label="Bussines value"
            type="number"
            value={bussinesValue}
            onChange={(e) => {setBussinesValue(e.target.value as unknown as number)}}
          />  

          <FormControl style={{ margin: 10, width: "30%" }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e: any) => {setPriority(e.target.value)}}
            >
              {
                allPriorities.map((priority, j) => (
                  <MenuItem key={j} value={priority.type}>{priority.label}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        

        <TextField
          style={{ marginTop: 20 }}
          label="Story comment"
          fullWidth
          multiline
          rowsMax={4}
          value={comment}
          onChange={(e) => {setComment(e.target.value)}}
          variant="outlined"
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Story tests"
          fullWidth
          multiline
          rowsMax={4}
          value={tests}
          onChange={(e) => {setTests(e.target.value)}}
          variant="outlined"
        />
        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={confirmAction} color="primary">
          { editId !== undefined ? "Confirm changes" : "Add" }
        </Button>
      </DialogActions>
    </Dialog>
  )
}