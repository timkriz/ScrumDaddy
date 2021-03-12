import React, {useEffect, useState} from "react";
import {IComment, IPost, IUser} from "../ProjectList/IProjectList";
import {Card, CardHeader, TextField} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import {Send} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import moment from "moment";
import Post from "./Post";

const fakePosts: IPost[] = [
  {
    _id: "a",
    projectId: "a",
    userId: "a",
    text: "This is a fake post.",
    timestamp: moment().unix()
  }
]

export default () => {
  const [ posts, setPosts ] = useState<IPost[]>([]);
  const [ newPostText, setNewPostText ] = useState<string>("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setPosts(fakePosts);
  }

  const addPost = () => {

  }

  return (
    <>
      <div className="page_subtitle" style={{ marginBottom: 20 }}>Project Wall</div>

      <Card>
        <CardContent>
          <div style={{ display: "flex", padding: "10px 10px 2px" }}>
            <TextField
              style={{ flex: 1, marginRight: 20 }}
              multiline
              placeholder="Write a new post..."
              value={newPostText}
              onChange={e => setNewPostText(e.target.value)}
            />
            <IconButton color="secondary" onClick={addPost}>
              <Send />
            </IconButton>
          </div>
        </CardContent>
      </Card>

      {
        posts.map(post => (
          <Post key={post._id} post={post} />
        ))
      }

    </>
  )
}