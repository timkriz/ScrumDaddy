export interface IProject {
  _id: string;
  projectName: string;
  projectDescription: string;
}

export interface IUser {
  _id: string;
  username: string;
  name: string;
  surname: string;
  email: string;
  role: string;
}

export interface IProjectUser {
  projectId: string;
  userId: string;
  userRole: string;
}

export interface IProjectDialogAssign {
  userId: string;
  roleId: string;
}

export interface ISprint {
  _id: string,
  sprintName: string,
  sprintDescription: string,
  sprintStartTime: number,
  sprintEndTime: number,
  sprintVelocity: number,
  sprintProjectId: string,
}