export interface IStoryNote {
    _id: string;
    projectId: string;
    sprintId: string;
    storyId: string;
    userId: string;
    timestamp: number;
    text: string;
    userRole: string;
}