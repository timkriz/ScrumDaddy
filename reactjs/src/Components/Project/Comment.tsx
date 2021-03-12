import React, {useEffect, useState} from "react";
import {IComment, IUser} from "../ProjectList/IProjectList";
import {getUser} from "../../api/UserService";
import moment from "moment";
import {Typography} from "@material-ui/core";
import {ClearRounded} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import {deleteComment} from "../../api/ProjectWallService";
import {Color} from "@material-ui/lab";

interface IProps {
  projectId: string;
  postId: string;
  comment: IComment;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ projectId, postId, comment, openSnack }: IProps) => {
  const [ user, setUser ] = useState<IUser>();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const gottenUser = (await getUser(comment.userId)).data.data as IUser;
    setUser(gottenUser);
  }

  const deleteClickedComment = async () => {
    await deleteComment(projectId, postId, comment._id)
      .then(() => {
        openSnack("Comment deletion successful!", "success", true);
      })
      .catch(() => {
        openSnack("Comment deletion failed!", "error");
      });
  }

  return (
    <>
      {
        user &&
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(0,0,0,0.2)", marginTop: 15, paddingTop: 15 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="subtitle2">{user.name} {user.surname} commented at {moment.unix(comment.timestamp).format("DD.MM.YYYY HH:mm")}</Typography>
              <Typography variant="body2">{comment.text}</Typography>
          </div>
          <IconButton color="secondary" onClick={deleteClickedComment}>
              <ClearRounded />
          </IconButton>
        </div>
      }
    </>
  )
}