import {IComment, IUser} from "../Components/ProjectList/IProjectList";
import moment from "moment";

const mockUser: IUser = {
  _id: "c",
  name: "Arne",
  surname: "Simonic",
  email: "akje",
  role: "ADMIN",
  username: "arne"
};

const mockComments: IComment[] = [
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