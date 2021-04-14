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
import {getUser} from "../../api/UserService";
import {IUser} from "../ProjectList/IProjectList";
import ClearIcon from '@material-ui/icons/Clear';
import {getProjectUser} from "../../api/ProjectService";
import {IProjectUser} from "../ProjectList/IProjectList";
import {ProjectRoles, projectRoleTitles} from "../../data/Roles";

interface IProps {
  projectId: string;
  sprintId: string;
  storyId: string;
  user: IUser;
  userRole: ProjectRoles;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
  note: IStoryNote;
}

export default ({projectId, sprintId, storyId, user, userRole, openSnack, note }: IProps) => {
    const [ userNoteAuthor, setUserNoteAuthor ] = useState<IUser | null>();
    const [ noteVisible, setNoteVisible ] = useState<boolean>(true);


    useEffect(() => {
      fetchUser();
    }, []);

    const fetchUser = async () => {
      const gottenUser = (await getUser(note.userId)).data.data as IUser;
      setUserNoteAuthor(gottenUser);
    }
    
    const removeNote = async (noteId: string) => {
      await deleteNote(projectId, sprintId, storyId, noteId)
          .then(() => {
            openSnack("Note successfully deleted!", "success");
            setNoteVisible(false)
          })
          .catch(() => {
            openSnack("Note deletion failed!", "error");
          });
    }

  return (
    <div>
      {noteVisible &&
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 5, paddingTop: 5 }}>
          <div style={{ display: "flex", flexDirection: "column", paddingLeft: 15}}>
              <Typography variant="caption">{userNoteAuthor && userNoteAuthor.name} {userNoteAuthor && userNoteAuthor.surname} {note.userRole==="PROD_LEAD" && "(product owner)"}, {moment.unix(note.timestamp).format("DD.MM.YYYY HH:mm")}</Typography>
              <Typography variant="subtitle2">{note.text}</Typography>
          </div>
          {/* Button visible if user is the author or admin*/}
          {user._id === note.userId &&
            <div>
              <IconButton aria-label="delete" color="primary" onClick={() => removeNote(note._id)}>
                <ClearIcon />
              </IconButton>
            </div>
          }
        </div>
      }
    </div>
  )
}