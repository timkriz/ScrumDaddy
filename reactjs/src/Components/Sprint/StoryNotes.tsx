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

interface IProps {
  projectId: string;
  sprintId: string;
  storyId: string;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ projectId, sprintId, storyId, openSnack }: IProps) => {
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
      let gottenNotesFiltered = gottenNotes.filter(f => f.userId === userId);
      gottenNotesFiltered = gottenNotesFiltered.sort((a: IStoryNote, b: IStoryNote) => b.timestamp - a.timestamp);
      setNotes(gottenNotesFiltered);
    }

    const addNote = async () => {
        const userId = getUserId();
        if(userId !== null) {
          await postNotes(projectId, sprintId, storyId, userId, moment().unix(), newNoteText)
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
      const removeNote = async (noteId: string) => {
        await deleteNote(projectId, sprintId, storyId, noteId)
            .then(() => {
              openSnack("Note successfully deleted!", "success");
              fetchNotes();
            })
            .catch(() => {
              openSnack("Note deletion failed!", "error");
            });
      }


  return (
    <div style={{maxWidth: '40%'}}>
        <div className="sprint_label" style={{marginTop: 10 }}>Notes:</div>

        {/* Existing notes */}
        {
        notes.map(note => (

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5, paddingTop: 5 }}>
            <div style={{ display: "flex", flexDirection: "column", paddingLeft: 15}}>
                <Typography variant="caption">{user && user.name} {user && user.surname}, {moment.unix(note.timestamp).format("DD.MM.YYYY HH:mm")}</Typography>
                <Typography variant="subtitle2">{note.text}</Typography>
            </div>
            <div>
              <IconButton aria-label="delete" color="primary" onClick={() => removeNote(note._id)}>
                <ClearIcon />
              </IconButton>
            </div>
          </div>
        ))
        }

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