import { defineStore } from 'pinia';
import type { Task } from '@/types/taskTypes';
import { parseISO, formatISO } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

export const useTaskStore = defineStore( 'tasks', {
    state: () => ({
        tasks: {
            uncompleted: [{}] as Task[],
            completed: [{}] as Task[],
        },
        snackbar: {
            isActive: false,
            text: '',
        }
    }),
    getters: {
        getTasks: (state) => state.tasks,
    },
    actions: {
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
                tasksObj.completed.forEach((task: { deadline: string }) => {
                    const utcDateTime = parseISO(task.deadline);
                    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    let localDate = formatISO(utcToZonedTime(utcDateTime, timeZone));
                    localDate = localDate.substring(0, localDate.length - 6)
                    task.deadline = localDate;
                });
            }

            if (tasksObj.uncompleted.length !== 0) {
                tasksObj.uncompleted.forEach((task: { deadline: string }) => {
                    const utcDateTime = parseISO(task.deadline);
                    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    let localDate = formatISO(utcToZonedTime(utcDateTime, timeZone));
                    localDate = localDate.substring(0, localDate.length - 6)
                    task.deadline = localDate;
                });
            }

            this.tasks.uncompleted = tasksObj.uncompleted;
            this.tasks.completed = tasksObj.completed;
        },
        async createTask(newTask: any) {
            try {
                const token = useCookie('token');
                const taskObj = {...newTask};
                const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                const utcDate = zonedTimeToUtc(taskObj.deadline, localTimeZone);
                taskObj.deadline = formatISO(utcDate);

                const response = await fetch(`http://localhost:4000/tasks/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token ? "Bearer " + token.value : "",
                    },
                    body: JSON.stringify(taskObj),
                });
                await response.json();

                await this.fetchTasks();
                this.snackbar.isActive = true;
                this.snackbar.text = 'A new task was added';
            } catch (error) {
                console.error('Error creating a new task', error);
                this.snackbar.isActive = true;
                this.snackbar.text = 'A new task was not added. Please try again later.';
            }
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

                const taskToUpdate: Task | undefined = this.tasks.uncompleted.find((task) => task._id === taskId) ||
                    this.tasks.completed.find((task) => task._id === taskId);

                if (taskToUpdate) {
                    if (isCompleted) {
                        this.tasks.uncompleted.push(taskToUpdate);
                        this.tasks.completed = this.tasks.completed.filter(task => task._id !== taskId);
                    } else {
                        this.tasks.completed.push(taskToUpdate);
                        this.tasks.uncompleted = this.tasks.uncompleted.filter(task => task._id !== taskId);
                    }
                }

                await this.fetchTasks();
            } catch (error) {
                console.error('Error updating task status', error);
            }
        },
        async editTask(editedTask: Task) {
            try {
                const token = useCookie('token');
                const response = await fetch(`http://localhost:4000/tasks/${editedTask._id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token ? "Bearer " + token.value : "",
                    },
                    body: JSON.stringify( {...editedTask} ),
                });
                const json = await response.json();
                if (!json.message) {
                    // snackbarTaskEdited.value = true;
                    this.snackbar.isActive = true;
                    this.snackbar.text = 'The task was edited successfully';
                    if (editedTask.completed) {
                        this.tasks.completed = this.tasks.completed.map( task => {
                            if (task._id === editedTask._id) {
                                return editedTask;
                            }
                            return task;
                        })
                    } else {
                        this.tasks.uncompleted = this.tasks.uncompleted.map( task => {
                            if (task._id === editedTask._id) {
                                return editedTask;
                            }
                            return task;
                        })
                    }
                } else {
                    // snackbarTaskEditingError.value = true;
                    this.snackbar.isActive = true;
                    this.snackbar.text = 'The task was not edited. Please try again later.';
                }
            } catch(error) {
                console.error('Error Editing the task', error);
                // snackbarTaskEditingError.value = true;
                this.snackbar.isActive = true;
                this.snackbar.text = 'The task was not edited. Please try again later.';
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
                    await this.fetchTasks();
                    // snackbarTaskDeleted.value = true;
                    this.snackbar.isActive = true;
                    this.snackbar.text = 'The task was deleted.';
                } else {
                    // snackbarTaskDeletedError.value = true;
                    this.snackbar.isActive = true;
                    this.snackbar.text = 'The task was not deleted. Please try again later.';
                }
            } catch(error) {
                console.error('Error deleting the task', error);
                // snackbarTaskDeletedError.value = true;
                this.snackbar.isActive = true;
                this.snackbar.text = 'The task was not deleted. Please try again later.';
            }
        }
    }
});