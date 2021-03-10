import React, {useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {Color} from "@material-ui/lab";
import moment, { Moment } from "moment"
import {DatePicker} from "@material-ui/pickers";
import {postSprint} from "../../api/SprintService";

interface IProps {
  projectId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color) => void;
}

export default ({ projectId, open, handleClose, openSnack }: IProps) => {
  const [ sprintTitle, setSprintTitle ] = useState<string>("");
  const [ sprintDescription, setSprintDescription ] = useState<string>("");
  const [ startDate, setStartDate ] = useState<Moment>(moment());
  const [ endDate, setEndDate ] = useState<Moment>(moment().add(1, "month"));
  const [ sprintVelocity, setSprintVelocity ] = useState<number>(10);

  const addSprint = async () => {
    try {

      await postSprint(sprintTitle, sprintDescription, startDate.unix(), endDate.unix(), sprintVelocity, projectId);

      openSnack("Sprint created successfully!", "success");
      handleClose();
    } catch (e) {
      openSnack("Sprint creation failed!", "error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Sprint</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Fill out the required fields to add a new sprint.
        </DialogContentText>
        <TextField
          label="Sprint Title"
          fullWidth
          value={sprintTitle}
          onChange={(e) => {setSprintTitle(e.target.value)}}
        />
        <TextField
          style={{ marginTop: 20 }}
          label="Sprint Description"
          fullWidth
          multiline
          value={sprintDescription}
          onChange={(e) => {setSprintDescription(e.target.value)}}
        />

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32 }}>
          <DatePicker
            style={{ marginRight: 10 }}
            variant="inline"
            label="Start Date"
            value={startDate}
            onChange={value => setStartDate(value as Moment)}
          />

          <DatePicker
            style={{ marginRight: 10 }}
            variant="inline"
            label="End Date"
            value={endDate}
            onChange={value => setEndDate(value as Moment)}
          />

          <TextField
            label="Sprint Velocity"
            type="number"
            value={sprintVelocity}
            onChange={(e) => {setSprintVelocity(e.target.value as unknown as number)}}
          />
        </div>

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={addSprint} color="primary">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}