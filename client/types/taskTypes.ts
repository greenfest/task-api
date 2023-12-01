export type Tasks = {
    _id: string;
    title: string;
    deadline: string;
    value: any;
    description: string;
    completed: boolean;
    dateCompleted: string;
}

export type Task = {
    _id: string;
    title: string;
    deadline: string;
    value: any;
    description: string;
    completed: boolean;
    dateCompleted: string;
}

export type TaskResponse = {
    uncompleted: any;
    completed: any;
}


