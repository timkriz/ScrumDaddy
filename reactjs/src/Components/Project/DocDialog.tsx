import React, {useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import {Color} from "@material-ui/lab";
import TextField from "@material-ui/core/TextField";
import {IProject} from "../ProjectList/IProjectList";
import {putProject} from "../../api/ProjectService";
import { saveAs } from 'file-saver';

interface IProps {
  project: IProject;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ project, open, handleClose, openSnack }: IProps) => {
  const [ text, setText ] = useState<string>(project.projectDescription);

  const confirmAction = async () => {
    try {
      await putProject(project._id, project.projectName, text);

      openSnack("Sprint updated successfully!", "success", true);
      handleClose();
    } catch (e) {
      openSnack("Sprint update failed!", "error");
    }
  };

  const exportDoc = () => {
    const blob = new Blob([text], {type: "text/plain;charset=utf-8"});
    saveAs(blob, `${project.projectName}_documentation.txt`);
  }

  const importDoc = (e: any) => {
    const file = e.target.files[0];

    const reader = new FileReader();
    reader.onload = function(e) {
      if(e.target && e.target.result) {
        const content = e.target.result as string;
        setText(content);
      }
    };
    reader.readAsText(file);
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>Project Documentation</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          multiline
          rows={30}
          value={text}
          onChange={e => setText(e.target.value)}
          label="Documentation Content"
          variant="outlined"
        />
      </DialogContent>
      <DialogActions style={{ justifyContent: "space-between", padding: "8px 24px 16px 24px" }}>
        <div>
          <Button onClick={exportDoc} color="primary">EXPORT</Button>

          <input
            id="import_doc"
            accept=".txt"
            multiple
            type="file"
            style={{ display: "none" }}
            onChange={importDoc}
          />

          <label htmlFor="import_doc">
            <Button color="primary" component="span">IMPORT</Button>
          </label>
        </div>

        <Button onClick={confirmAction} color="primary" variant="contained" disabled={text === project.projectDescription}>UPDATE</Button>
      </DialogActions>
    </Dialog>
  )
}