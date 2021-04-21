import React, {useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {Color} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {IStory, ISprint} from "./IStory";
import {editUserStory, getStory} from "../../api/UserStoriesService";
import {allPriorities, Priorities} from "../Story/Priorities";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import {ProjectRoles, projectRoleTitles} from "../../data/Roles";


interface IProps {
  projectId: string;
  storyId: string;
  story: IStory;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
  userRole: ProjectRoles;
}

export default ({ projectId, storyId, story, open, handleClose, openSnack, userRole}: IProps) => {
  const [ name, setName ] = useState<string>(story.name);
  const [ description, setDescription ] = useState<string>(story.description);
  const [ timeEstimate, setTimeEstimate] = useState<number>(story.timeEstimate);
  const [ businessValue, setBusinessValue] = useState<number>(story.businessValue);
  const [ priority, setPriority] = useState<Priorities>(story.priority as Priorities);
  const [ comment, setComment] = useState<string>(story.comment);
  const [ tests, setTests] = useState<string>(story.tests);

  const confirmAction = async () => {
    try {
      if(comment.length > 1 && name.length > 1 && description.length > 1 && tests.length > 1){
        await editUserStory(projectId, " " /*sprintid*/, storyId, name, description, timeEstimate, businessValue, priority, comment, tests);
        //setTimeEstimate(10);
        openSnack("Story updated.", "success", true);
        handleClose();
      }
      else openSnack("One or more fields is missing.", "error");
    } catch (e) {
      let message = "Editing story failed!";
      if(e && e.response && e.response.data && e.response.data.message) message = e.response.data.message;
      openSnack(message, "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      
      <DialogTitle>Edit User Story: {story.name}</DialogTitle>
      <DialogContent>
        {/* Name */}
        <TextField
            label="Story Title"
            fullWidth
            rowsMax={1}
            value={name}
            onChange={(e) => {setName(e.target.value)}}
            variant="outlined"
        />
        {/* Description */}
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
        {/* Others */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
          <TextField
            style={{ paddingTop: 10, width: "20%" }}
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
            style={{paddingTop: 10, width: "20%" }}
            InputProps={{
              inputProps: { 
                  min: 1, max: 100, maxLength: 2 
              }
            }}
            label="Bussines value"
            type="number"
            value={businessValue}
            onChange={(e) => {setBusinessValue(e.target.value as unknown as number)}}
          />  

          <FormControl style={{ paddingTop: 10, width: "30%" }}>
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
        {/* Comment of product owner */}
        {userRole == "PROD_LEAD" &&
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
        }
        {/* Story tests */}
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
          Confirm changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}