export interface ISystemRole {
  id: string;
  title: string;
}

export const systemRoles: ISystemRole[] = [
  {
    id: "ADMIN",
    title: "Admin"
  },
  {
    id: "USER",
    title: "User"
  }
];

export interface IProjectRole {
  id: string;
  title: string;
}

export const projectRoles: IProjectRole[] = [
  {
    id: "PROD_LEAD",
    title: "Product Leader"
  },
  {
    id: "METH_KEEPER",
    title: "Methodology Keeper"
  },
  {
    id: "DEV_TEAM_MEMBER",
    title: "Development Team Member"
  }
];