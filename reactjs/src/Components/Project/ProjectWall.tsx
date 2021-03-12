import React, {useEffect, useState} from "react";
import {IPost} from "../ProjectList/IProjectList";
import {Card, TextField} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import {Send} from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";
import Post from "./Post";
import {getPosts, postPost} from "../../api/ProjectWallService";
import {getUserId} from "../../api/TokenService";
import moment from "moment";
import {Color} from "@material-ui/lab";

interface IProps {
  projectId: string;
  openSnack: (message: string, severity: Color, refresh?: boolean) => void;
}

export default ({ projectId, openSnack }: IProps) => {
  const [ posts, setPosts ] = useState<IPost[]>([]);
  const [ newPostText, setNewPostText ] = useState<string>("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    let gottenPosts = (await getPosts(projectId)).data.data as IPost[];
    gottenPosts = gottenPosts.sort((a: IPost, b: IPost) => b.timestamp - a.timestamp);
    setPosts(gottenPosts);
  }

  const addPost = async () => {
    const userId = getUserId();
    if(userId !== null) {
      await postPost(projectId, userId, moment().unix(), newPostText)
        .then(() => {
          openSnack("Post creation successful!", "success");
          fetchPosts();
        })
        .catch(() => {
          openSnack("Post creation failed!", "error");
        });
    }
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
            <IconButton color="secondary" disabled={newPostText === ""} onClick={addPost}>
              <Send />
            </IconButton>
          </div>
        </CardContent>
      </Card>

      {
        posts.map(post => (
          <Post key={post._id} projectId={projectId} post={post} openSnack={openSnack} />
        ))
      }

    </>
  )
}