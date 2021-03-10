export interface IDrawerItem {
  title: string;
  path: string;
  roles: number[];
}

export const drawerItems = [
  {
    title: "Project List",
    path: "/projects",
    roles: [ 0, 1 ]
  },
  {
    title: "Manage Users",
    path: "/manage_users",
    roles: [ 0 ]
  }
];