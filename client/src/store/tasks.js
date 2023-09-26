import { defineStore } from 'pinia';
import { getTasks, updateTask } from '../api/tasks';


export const useTasksStore = defineStore({
    id: 'tasks',
    state: () => ({
        tasks: [],
    }),
    actions: {
        async loadTasks() {
            this.tasks = await getTasks(); // Обновляем состояние в сторе
        },
        async updateTask(task) {
            await updateTask(task); // Отправляем обновление на бэкенд
        },
    },
});

export default useTasksStore;