export interface IReadTask {
    id: string;
    title: string;
    description: string;
}


export interface ICreateTask {
    id: string,
    title: string,
    description: string,
    done?: boolean;
}
