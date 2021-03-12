import React, {useEffect, useState} from "react";
import {IComment, IUser} from "../ProjectList/IProjectList";
import {getUser} from "../../api/UserService";
import moment from "moment";
import {Typography} from "@material-ui/core";

interface IProps {
  comment: IComment;
}

export default ({ comment }: IProps) => {
  const [ user, setUser ] = useState<IUser>();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const gottenUser = (await getUser(comment.userId)).data.data as IUser;
    setUser(gottenUser);
  }

  return (
    <>
      {
        user &&
        <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid rgba(0,0,0,0.2)", marginTop: 15, paddingTop: 15 }}>
          <Typography variant="subtitle2">{user.name} {user.surname} commented at {moment.unix(comment.timestamp).format("DD.MM.YYYY HH:mm")}</Typography>
          <Typography variant="body2">{comment.text}</Typography>
        </div>
      }
    </>
  )
}