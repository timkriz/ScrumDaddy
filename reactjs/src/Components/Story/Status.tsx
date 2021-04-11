export enum Status{
    UNASSIGNED = "UNASSIGNED",
    COMPLETED = "COMPLETED" 
  }

export interface IStatusObject{
    type: Status;
    label: string;
}


export const allStatuses: IStatusObject[] = [
    {
        type: Status.UNASSIGNED,
        label: "Unassigned"
    },
    {
        type: Status.COMPLETED,
        label: "Completed"
    }
]

