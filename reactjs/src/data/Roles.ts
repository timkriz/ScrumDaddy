export enum SystemRoles {
  ADMIN = "ADMIN",
  USER = "USER"
}

export interface ISystemRole {
  id: SystemRoles;
  title: string;
}

export const systemRoles: ISystemRole[] = [
  {
    id: SystemRoles.ADMIN,
    title: "Admin"
  },
  {
    id: SystemRoles.USER,
    title: "User"
  }
];

export const systemRoleTitles: any = {
  [SystemRoles.ADMIN]: systemRoles[0].title,
  [SystemRoles.USER]: systemRoles[1].title
}

export enum ProjectRoles {
  PROD_LEAD = "PROD_LEAD",
  METH_KEEPER = "METH_KEEPER",
  DEV_TEAM_MEMBER = "DEV_TEAM_MEMBER"
}

export interface IProjectRole {
  id: ProjectRoles;
  title: string;
}

export const projectRoles: IProjectRole[] = [
  {
    id: ProjectRoles.PROD_LEAD,
    title: "Product Owner"
  },
  {
    id: ProjectRoles.METH_KEEPER,
    title: "Scrum Master"
  },
  {
    id: ProjectRoles.DEV_TEAM_MEMBER,
    title: "Developer"
  }
];

export const projectRoleTitles: any = {
  [ProjectRoles.PROD_LEAD]: projectRoles[0].title,
  [ProjectRoles.METH_KEEPER]: projectRoles[1].title,
  [ProjectRoles.DEV_TEAM_MEMBER]: projectRoles[2].title,
}