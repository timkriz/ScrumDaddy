export interface IProject {
  id: number;
  title: string;
}

export interface IUser {
  id: number;
  name: string;
  surname: string;
}

export interface IRole {
  id: number;
  title: string;
}

export interface IProjectDialogAssign {
  userId: number;
  roleId: number;
}