import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, TextField, Typography} from "@material-ui/core";
import {IComment, IPost, IUser} from "../ProjectList/IProjectList";
import moment from "moment";
import Comment from "./Comment";
import IconButton from "@material-ui/core/IconButton";
import {ClearRounded, Send} from "@material-ui/icons";
import {getUser} from "../../api/UserService";
import {deletePost, getComments, postComment} from "../../api/ProjectWallService";
import {Color} from "@material-ui/lab";
import {getUserId} from "../../api/TokenService";

interface IProps {
  projectId: string;
  post: IPost;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ projectId, post, openSnack }: IProps) => {
  const [ user, setUser ] = useState<IUser>();
  const [ comments, setComments ] = useState<IComment[]>([]);
  const [ newCommentText, setNewCommentText ] = useState<string>("");

  useEffect(() => {
    fetchUser();
    fetchComments();
  }, []);

  const fetchUser = async () => {
    const gottenUser = (await getUser(post.userId)).data.data as IUser;
    setUser(gottenUser);
  }

  const fetchComments = async () => {
    const gottenComments = (await getComments(projectId, post._id)).data.data as IComment[];
    setComments(gottenComments);
  }

  const addComment = async () => {
    const userId = getUserId();
    if(userId !== null) {
      await postComment(projectId, post._id, userId, moment().unix(), newCommentText)
        .then(() => {
          openSnack("Post creation successful!", "success");
          fetchComments();
        })
        .catch(() => {
          openSnack("Post creation failed!", "error");
        });
    }
  }

  const deleteClickedPost = async () => {
    await deletePost(projectId, post._id)
      .then(() => {
        openSnack("Post deletion successful!", "success", true);
      })
      .catch(() => {
        openSnack("Post deletion failed!", "error");
      });
  }

  return (
    <>
      {
        user &&
        <Card style={{ marginTop: 20 }}>
          <CardHeader subheader={"Posted at "+moment.unix(post.timestamp).format("DD.MM.YYYY HH:mm")} title={user.name+" "+user.surname} />
          <CardContent>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <Typography variant="body1">{post.text}</Typography>
                <IconButton color="secondary" onClick={deleteClickedPost}>
                    <ClearRounded />
                </IconButton>
            </div>

            {
              comments.map(comment => (
                <Comment key={comment._id} projectId={projectId} postId={post._id} comment={comment} openSnack={(message, severity, refresh) => {
                  if(refresh) fetchComments();
                  openSnack(message, severity);
                }} />
              ))
            }

              <div style={{ display: "flex", marginTop: 15, paddingTop: 24, borderTop: "1px solid rgba(0,0,0,0.2)" }}>
                  <TextField
                      style={{ flex: 1, marginRight: 20 }}
                      multiline
                      placeholder="Write a new comment..."
                      value={newCommentText}
                      onChange={e => setNewCommentText(e.target.value)}
                  />
                  <IconButton color="secondary" disabled={newCommentText === ""} onClick={addComment}>
                      <Send />
                  </IconButton>
              </div>
          </CardContent>
        </Card>
      }
    </>
  )
}