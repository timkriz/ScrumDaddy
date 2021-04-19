import React, {useEffect, useState} from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import moment, {Moment} from "moment"
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {Color} from "@material-ui/lab";
import {getStory, getStories} from "../../api/UserStoriesService";
import {putStory} from "../../api/StoryService";
import {IStory} from "../ProjectList/IProjectList";
import ISprint from "../ProductBacklog/ProductBacklog"; 
import "./story.css";
import {getSprints} from "../../api/SprintService";
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';



interface ISprint {
  _id: string;
  name: string;
  description: number;
  startTime: number;
  endTime: number;
  velocity: number;
  projectId: string;
}

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
  //const [ sprint, setSprint] = useState<ISprint[]>([]);
  const [ productBacklog, setProductBacklog ] = useState<IStory[]>([]); 
  const [ sprints, setSprints ] = useState<ISprint[]>([]);

  const classes = useStyles();
  const theme = useTheme();
  const [ selectedStories, setSelectedStories] = React.useState<string[]>([]);
  const [ finalSprint, setFinalSprint ] = useState<string>("");
  const [ todayDate, setTodayDate ] = useState<Moment>(moment());

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedStories(event.target.value as string[]);
  };

  const handleChangeMultiple = (event: React.ChangeEvent<{ value: unknown }>) => {
    const { options } = event.target as HTMLSelectElement;
    const value: string[] = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    setSelectedStories(value);
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


  useEffect(() => {
    fetchProductBacklog();
    fetchSprints();

  },[open] );


  /* Get stories of a product backlog */
  const fetchProductBacklog = async () => {
    const allStoriesInProductBacklog = (await getStories(projectId, "/")).data.data as IStory[];
    if(allStoriesInProductBacklog) setProductBacklog(allStoriesInProductBacklog);
  }

  /* Get sprints of this project */
  const fetchSprints = async () => {
    const gottenSprints = (await getSprints(projectId)).data.data as ISprint[];
    const filteredSprints: ISprint[] = [];
    gottenSprints.forEach((sprint)=>{
      const sprintEnd = (moment.unix(sprint.endTime));
      if( sprintEnd > todayDate){
        filteredSprints.push(sprint);
      }
    })
    setSprints(filteredSprints);
  }

  /* Add stories to sprint */
  const addStoryToSprint = async (id:string) =>{
    try{
      const response = await putStory(projectId, " ", id, finalSprint);
    }
    catch(e){
      let message = "Failed to add stories!";
      if(e && e.response && e.response.data && e.response.data.message) message = e.response.data.message;
      openSnack(message, "error");
    }
    
  }

  const confirmAction = async () => {
    try {

      const newIDs = [] as any;
      const newIDs2 = [] as any;
      if (selectedStories.length > 0){
        selectedStories.forEach((story) =>{
          if(productBacklog.length > 0){
            productBacklog.forEach((story2) =>{
              if (story == story2.name){
                newIDs.push(story2._id)
              }

            })
          }else{
            openSnack("There is no stories in Product Backlog", "error");
          }
        })

        if(finalSprint != ""){
          for(var i=0; i<newIDs.length; i++){
            var x = JSON.parse(JSON.stringify(newIDs[i]));
            newIDs2.push(x)
            addStoryToSprint(x)
          }

          openSnack("Added stories successfully!", "success", true);
          handleClose();

        }else{
          openSnack("Please, select sprint!", "error");
        }

      }else{
        openSnack("Please, select stories!", "error");
      }

      
    } catch (e) {
      let message = "Failed to add stories!";
      if(e && e.response && e.response.data && e.response.data.message) message = e.response.data.message;
      openSnack(message, "error");
    }

   
  
};



  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Select stories for sprint</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select stories to add to sprint.
        </DialogContentText>

        <div>
          <FormControl className={classes.formControl} style={{ display: "flex"}}>
            <InputLabel id="demo-mutiple-checkbox-label">Stories</InputLabel>
            <Select
              labelId="demo-mutiple-checkbox-label"
              id="demo-mutiple-checkbox"
              multiple
              value={selectedStories}
              onChange={handleChange}
              input={<Input />}
              renderValue={(selected) => (selected as string[]).join(', ')}
              MenuProps={MenuProps}
            >
              {productBacklog.map((story, j) => (
                <MenuItem key={j} value={story.name}>
                  <Checkbox checked={selectedStories.indexOf(story.name) > -1} />
                  <ListItemText primary={story.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div>
          <FormControl style={{ display: "flex", margin: "10px", justifyContent: "space-between" }}>
            <InputLabel>Sprint</InputLabel>
              <Select 
              value={finalSprint} 
              onChange={(e: any) => {setFinalSprint(e.target.value)}}
              >
                {
                  sprints.map((sprint, j) => (
                    <MenuItem key={j} value={sprint._id}>{sprint.name}</MenuItem>
                    
                  ))
                }
              </Select>
          </FormControl>
        </div>


        
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary"style={{ marginTop: "20px"}}>
          Cancel
        </Button>
        <Button onClick={confirmAction} variant="contained" color="primary"style={{ marginTop: "20px"}}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}