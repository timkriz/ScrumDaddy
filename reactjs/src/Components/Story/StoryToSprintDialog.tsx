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
import ISprint from "../ProductBacklog/ProductBacklog"; 
import {allStatuses, Status} from "./Status"; 
import { stat } from "node:fs";
import "./story.css";
import {rejectUserStory} from "../../api/UserStoriesService";
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';


interface IProps {
  projectId: string;
  sprintId: string;
  open: boolean;
  handleClose: () => void;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
  editId?: string;
}

const useStyles = makeStyles((theme: Theme) =>
createStyles({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}),
);


export default ({ projectId, sprintId, open, handleClose, openSnack, editId }: IProps) => {
  const [ id, setId] = useState<string>("");
  const [ name, setName ] = useState<string>("");
  const [ description, setDescription ] = useState<string>("");
  const [ timeEstimate, setTimeEstimate] = useState<number>(10);
  const [ bussinesValue, setBussinesValue] = useState<number>(10);
  //const [ sprint, setSprint] = useState<ISprint[]>([]);
  const [ comment, setComment] = useState<string>("");
  const [ tests, setTests] = useState<string>("");
  const [ status, setStatus] = useState<Status>(Status.UNASSIGNED);




  const classes = useStyles();
  const theme = useTheme();
  const [personName, setPersonName] = React.useState<string[]>([]);

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPersonName(event.target.value as string[]);
  };

  const handleChangeMultiple = (event: React.ChangeEvent<{ value: unknown }>) => {
    const { options } = event.target as HTMLSelectElement;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setPersonName(value);
  };
  


 

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };

  const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder',
  ];

  function getStyles(name: string, personName: string[], theme: Theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  
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


  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select stories for sprint</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select stories to add to sprint.
        </DialogContentText>

        <div>
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-mutiple-checkbox-label">Stories</InputLabel>
            <Select
              labelId="demo-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"
              multiple
              value={personName}
              onChange={handleChange}
              input={<Input />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={personName.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
        </div>


        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={void 0} color="primary">
          { editId !== undefined ? "Confirm changes" : "Add" }
        </Button>
      </DialogActions>
    </Dialog>
  )
}