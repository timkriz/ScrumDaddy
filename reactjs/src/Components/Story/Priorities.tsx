export enum Priorities{
    MUST_HAVE = "MUST_HAVE",
    COULD_HAVE = "COULD_HAVE",
    SHOULD_HAVE = "SHOULD_HAVE",
    WONT_HAVE = "WONT_HAVE" //Priorities.MUST_HAVE
  }

export interface IPriorityObject{
    type: Priorities;
    label: string;
}


export const allPriorities: IPriorityObject[] = [
    {
        type: Priorities.MUST_HAVE,
        label: "Must Have"
    },
    {
        type: Priorities.COULD_HAVE,
        label: "Could Have"
    },
    {
        type: Priorities.SHOULD_HAVE,
        label: "Should Have"
    },
    {
        type: Priorities.WONT_HAVE,
        label: "Won't Have"
    }
]

