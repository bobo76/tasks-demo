export interface ITask {
    id: string;
    title: string;
    description: string;
}

export interface ICreateTask {
    title: string;
    description: string;
}

export enum TaskStatus {
    NEW = 'new-tasks',
    IN_PROGRESS = 'in-progress',
    DONE = 'done'
}
