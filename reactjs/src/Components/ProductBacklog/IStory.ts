export interface IStory {
    _id: string;
    name: string;
    timeEstimate: number;
    businessValue: number;
    comment: string;
    priority: number;
    tests: string;
    status: string;
    projectId: string;
    sprintId: string;
  }
  export interface ISprint {
    _id: string,
    name: string,
    description: string,
    startTime: number,
    endTime: number,
    velocity: number,
    projectId: string,
  }