export enum Status{
    UNASSIGNED = "UNASSIGNED",
    COMPLETED = "COMPLETED",
    ACCEPTED = "ACCEPTED",
    ACTIVE = "ACTIVE"
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
    },
    {
        type: Status.ACCEPTED,
        label: "Accepted"
    },
    {
        type: Status.ACTIVE,
        label: "Active"
    }
]

