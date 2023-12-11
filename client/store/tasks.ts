import { defineStore } from 'pinia';
import type { Tasks, Task, TaskResponse } from '@/types/taskTypes';

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
        async toggleTask(taskId: string, isCompleted: boolean) {
            try {
                const token = useCookie('token');
                const response = await fetch(`http://localhost:4000/tasks/${taskId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token ? "Bearer " + token.value : "",
                    },
                    body: JSON.stringify({
                        completed: !isCompleted,
                        dateCompleted: new Date,
                    }),
                });

                await response.json();

                const taskToUpdate = this.tasks.uncompleted.find(task => task._id === taskId) ||
                    this.tasks.completed.find( task=> task._id === taskId) || {};

                if (isCompleted) {
                    this.tasks.uncompleted.push(taskToUpdate);
                    this.tasks.completed = this.tasks.completed.filter(task => task._id !== taskId);
                } else {
                    this.tasks.completed.push(taskToUpdate);
                    this.tasks.uncompleted = this.tasks.uncompleted.filter(task => task._id !== taskId);
                }
            } catch (error) {
                console.error('Error updating task status', error);
            }
        },
        async deleteTask(taskId: string, isCompleted: boolean) {
            try {
                const token = useCookie('token');
                const response = await fetch(`http://localhost:4000/tasks/${taskId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token ? "Bearer " + token.value : "",
                    }
                });
                const json = await response.json();
                if (!json.error) {
                    if (isCompleted) {
                        this.tasks.completed = this.tasks.completed.filter(task => task._id !== taskId);
                    } else {
                        this.tasks.uncompleted = this.tasks.uncompleted.filter(task => task._id !== taskId);
                    }
                    snackbarTaskDeleted.value = true;
                } else {
                    snackbarTaskDeletedError.value = true;
                }
            } catch(error) {
                console.error('Error deleting the task', error);
                snackbarTaskDeletedError.value = true;
            }
        }
    }
});