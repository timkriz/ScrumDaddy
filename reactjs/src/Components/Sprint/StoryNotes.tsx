import React, {useEffect, useState} from "react";
import {Color} from "@material-ui/lab";
import {TextField, Typography} from "@material-ui/core";
import {IStoryNote} from "./IStoryNote";
import {Send} from "@material-ui/icons";
import "./sprint.css";
import moment from "moment";
import IconButton from "@material-ui/core/IconButton";
import {getUserId} from "../../api/TokenService";
import {getNotes, postNotes, deleteNote} from "../../api/StoryNoteService";
import {getUser} from "../../api/TokenService";
import {IUser} from "../ProjectList/IProjectList";
import ClearIcon from '@material-ui/icons/Clear';
import {getProjectUser} from "../../api/ProjectService";
import {IProjectUser} from "../ProjectList/IProjectList";
import {ProjectRoles, projectRoleTitles} from "../../data/Roles";
import Note from "./Note";

interface IProps {
  projectId: string;
  sprintId: string;
  storyId: string;
  userRole: ProjectRoles;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ projectId, sprintId, storyId, userRole, openSnack }: IProps) => {
    const [ newNoteText, setNewNoteText ] = useState<string>("");
    const [ notes, setNotes ] = useState<IStoryNote[]>([]);
    const [ user, setUser ] = useState<IUser | null>();

    useEffect(() => {
      setUser(getUser());
      fetchNotes();
    }, []);

    const fetchNotes = async () => {
      const userId = getUserId();
      let gottenNotes = (await getNotes(projectId, sprintId, storyId)).data.data as IStoryNote[];
      if(userId !== null) {
        /* Filter posts from this user */
        let gottenNotesFiltered = gottenNotes.filter(f => f.userId === userId || f.userRole === "PROD_LEAD");
        gottenNotesFiltered = gottenNotesFiltered.sort((a: IStoryNote, b: IStoryNote) => b.timestamp - a.timestamp);
        setNotes(gottenNotesFiltered);
      }
    }

    const addNote = async () => {
        const userId = getUserId();
        if(userId !== null && userRole !== undefined && userRole !== null) {
          await postNotes(projectId, sprintId, storyId, userId, moment().unix(), newNoteText, userRole)
            .then(() => {
              //openSnack("Note creation successful!", "success");
              fetchNotes();
              setNewNoteText("")
            })
            .catch(() => {
              openSnack("Note creation failed!", "error");
            });
        }
      }


  return (
    <div style={{maxWidth: '40%'}}>
        <div className="sprint_label" style={{marginTop: 10 }}>Notes:</div>

        {/* Existing notes */}
        {(user !== undefined && user != null) &&
        <div>
          { 
          notes.map(note => (
            <Note key={note._id} projectId={projectId} sprintId={sprintId} storyId={storyId} openSnack={openSnack} user = {user} userRole = {userRole} note={note}></Note>
              
          ))
          }
        </div>}

        {/* Text input note */}
        <div style={{ display: "flex", marginTop: 5, paddingTop: 5, paddingLeft: 15, maxWidth: '100%'}}>
            <TextField
                style={{ flex: 1, marginRight: 20 }}
                multiline
                placeholder="Write a new note..."
                value={newNoteText}
                onChange={e => setNewNoteText(e.target.value)}
                
            />
            <IconButton color="secondary" disabled={newNoteText === ""} onClick={addNote}>
                <Send />
            </IconButton>
        </div>
    </div>
  )
}