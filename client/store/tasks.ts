import {defineStore} from 'pinia';

export const useTaskStore = defineStore( 'tasks', {
    state: () => ({
        tasks: {
            uncompleted: [{}],
            completed: [{}],
        }
    }),
    getters: {
        getTasks: (state) => state.tasks,
    },
    actions: {
        addNewTask(task: object) {
            this.tasks.uncompleted.push(task);
        },
        async fetchTasks() {
            const token = useCookie('token');
            const response = await fetch('http://localhost:4000/tasks', {
                method: "GET",
                headers: {
                    "Authorization": token ? "Bearer " + token.value : "",
                },
            });
            const tasksObj = await response.json();
            if (tasksObj.completed.length !== 0) {
                tasksObj.completed.forEach((task: { deadline: string | any[]; }) => task.deadline = task.deadline.slice(0, 19));
            }

            if (tasksObj.uncompleted.length !== 0) {
                tasksObj.uncompleted.forEach((task: { deadline: string | any[]; }) => task.deadline = task.deadline.slice(0, 19));
            }
            this.tasks.uncompleted = tasksObj.uncompleted;
            this.tasks.completed = tasksObj.completed;
        },
        toggleTask() {

        }
    }
});