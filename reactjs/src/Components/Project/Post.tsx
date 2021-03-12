import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, TextField, Typography} from "@material-ui/core";
import {IComment, IPost, IUser} from "../ProjectList/IProjectList";
import moment from "moment";
import Comment from "./Comment";
import IconButton from "@material-ui/core/IconButton";
import {Send} from "@material-ui/icons";

const fakeComments: IComment[] = [
  {
    _id: "a",
    postId: "a",
    userId: "a",
    text: "This is comment 1",
    timestamp: moment().unix()
  },
  {
    _id: "b",
    postId: "b",
    userId: "b",
    text: "This is comment 2",
    timestamp: moment().unix()
  }
];

const fakeUser: IUser = {
  _id: "c",
  name: "Arne",
  surname: "Simonic",
  email: "akje",
  role: "ADMIN",
  username: "arne"
};

interface IProps {
  post: IPost;
}

export default ({ post }: IProps) => {
  const [ user, setUser ] = useState<IUser>();
  const [ comments, setComments ] = useState<IComment[]>([]);
  const [ newCommentText, setNewCommentText ] = useState<string>("");

  useEffect(() => {
    fetchUser();
    fetchComments();
  }, []);

  const fetchUser = async () => {
    // const gottenUser = (await getUser(post.userId)).data.data as IUser;
    // setUser(gottenUser);
    setUser(fakeUser);
  }

  const fetchComments = async () => {
    // const gottenComments = (await getComments(post._id)).data.data as IComment[];
    // setComments(gottenComments);
    setComments(fakeComments);
  }

  const addComment = () => {

  }

  return (
    <>
      {
        user &&
        <Card style={{ marginTop: 20 }}>
          <CardHeader subheader={"Posted at "+moment.unix(post.timestamp).format("DD.MM.YYYY HH:mm")} title={user.name+" "+user.surname} />
          <CardContent>

            <Typography variant="body1" style={{ marginBottom: 32 }}>{post.text}</Typography>

            {
              comments.map(comment => (
                <Comment key={comment._id} comment={comment} />
              ))
            }

              <div style={{ display: "flex", marginTop: 30 }}>
                  <TextField
                      style={{ flex: 1, marginRight: 20 }}
                      multiline
                      placeholder="Write a new comment..."
                      value={newCommentText}
                      onChange={e => setNewCommentText(e.target.value)}
                  />
                  <IconButton color="secondary" onClick={addComment}>
                      <Send />
                  </IconButton>
              </div>
          </CardContent>
        </Card>
      }
    </>
  )
}