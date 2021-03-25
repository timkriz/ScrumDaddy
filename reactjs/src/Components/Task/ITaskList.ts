export interface ITask {
  _id: string;
  taskName: string;
  taskDescription: string;
  taskVelocity : number;
}

export interface IUser {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
}

export interface ITaskUser {
  projectId: string;
  userId: string;
}

export interface ITaskDialogAssign {
  userId: string;
  name: string;
  surname: string;
}