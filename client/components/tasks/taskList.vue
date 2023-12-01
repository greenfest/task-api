<script setup lang="ts">
import type { Tasks, Task, TaskResponse } from '@/types/taskTypes';
import {format, parseISO} from "date-fns";
import {utcToZonedTime} from "date-fns-tz";

const props = defineProps({
  title: String,
  tasks: Array<TaskResponse>,
});

const token = useCookie('token');

if (props.tasks.completed.length !== 0) {
  props.tasks.completed.forEach((task: { deadline: string | any[]; }) => task.deadline = task.deadline.slice(0, 19));
}

if (props.tasks.uncompleted.length !== 0) {
  props.tasks.uncompleted.forEach((task: { deadline: string | any[]; }) => task.deadline = task.deadline.slice(0, 19));
}

const uncompletedTasks: Tasks = ref(props.tasks.uncompleted.length ? props.tasks.uncompleted : []);
const completedTasks: Tasks = ref(props.tasks.completed.length ? props.tasks.completed : []);

async function toggleTask(taskId: string, isCompleted: boolean) {
  try {
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

    updateTaskStatusLocally(taskId, !isCompleted);
  } catch (error) {
    console.error('Error updating task status', error);
  }
}

function updateTaskStatusLocally(taskId: string, isCompleted: boolean) {
  const taskToUpdate = uncompletedTasks.value.find((task: { _id: string; }) => task._id === taskId) ||
      completedTasks.value.find((task: { _id: string; }) => task._id === taskId);

  if (taskToUpdate) {
    taskToUpdate.completed = isCompleted;

    // Обновляем массивы в зависимости от статуса задачи
    if (isCompleted) {
      completedTasks.value.push(taskToUpdate);
      uncompletedTasks.value = uncompletedTasks.value.filter((task: { _id: string; }) => task._id !== taskId);
    } else {
      uncompletedTasks.value.push(taskToUpdate);
      completedTasks.value = completedTasks.value.filter((task: { _id: string; }) => task._id !== taskId);
    }
  }
}

const newTask = ref({
  title: null,
  description: null,
  date: new Date,
  deadline: new Date,
  completed: false,
});



async function createTask() {
  try {
    const taskObj = {...newTask.value};
    taskObj.deadline = new Date(taskObj.deadline);
    console.log(taskObj.date);
    const response = await fetch(`http://localhost:4000/tasks/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? "Bearer " + token.value : "",
      },
      body: JSON.stringify(taskObj),
    });

    const task = await response.json();
    uncompletedTasks.value.push(task);
    snackbarTaskAdded.value = true;
  } catch (error) {
    console.error('Error creating a new task', error);
    snackbarTaskAdded.value = true;
  }
}

function formatDateTimeToLocal(dateTimeString: string) {
  const utcDateTime = parseISO(dateTimeString);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDateTime = utcToZonedTime(utcDateTime, timeZone);

  return format(zonedDateTime, 'dd.MM.yyyy HH:mm');
}



async function deleteTask(taskId: string, completed: boolean) {
  try {
    const response = await fetch(`http://localhost:4000/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? "Bearer " + token.value : "",
      }
    });
    const json = await response.json();
    if (!json.error) {
      if (completed) {
        completedTasks.value = completedTasks.value.filter((task: { _id: string; }) => task._id !== taskId);
      } else {
        uncompletedTasks.value = uncompletedTasks.value.filter((task: { _id: string; }) => task._id !== taskId);
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


let editedTask: Ref<Task> = ref({
  _id: '',
  title: '',
  deadline: '',
  value: [],
  description: '',
  completed: false,
  dateCompleted: '',
});
async function editTask(editedTask: Task) {
  try {
    const response = await fetch(`http://localhost:4000/tasks/${editedTask._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? "Bearer " + token.value : "",
      },
      body: JSON.stringify( {...editedTask} ),
    });
    const json = await response.json();
    console.log(json);
    if (!json.message) {
      snackbarTaskEdited.value = true;
      if (editedTask.completed) {
        completedTasks.value = completedTasks.value.map( (task: { _id: string; }) => {
          if (task._id === editedTask._id) {
            return editedTask;
          }
          return task;
        })
      } else {
        uncompletedTasks.value = uncompletedTasks.value.map( (task: { _id: string; }) => {
          if (task._id === editedTask._id) {
            return editedTask;
          }
          return task;
        })
      }
    } else {
      snackbarTaskEditingError.value = true;
    }
  } catch(error) {
    console.error('Error Editing the task', error);
    snackbarTaskEditingError.value = true;
  }
}

const areArraysNotEmpty = () => {
  return completedTasks.value.length || uncompletedTasks.value.length;
};



</script>

<template>
  <v-list class="rounded" v-if="areArraysNotEmpty">
    <v-list-subheader>{{ props.title }}</v-list-subheader>

    <v-list-item
        v-for="task in props.tasks"
        :key="task._id"
    >
      <template v-slot:prepend>
        <v-checkbox
            @click="toggleTask(task._id, task.completed)"
            color="primary"
            hide-details
        ></v-checkbox>
      </template>
      <v-container>
        <v-row justify="space-between">
          <v-col class="w-75 text-truncate">
            <v-dialog
                transition="dialog-top-transition"
                width="auto"
            >
              <template v-slot:activator="{ props }">
                <v-list-item-title v-bind="props">
                  <p :class="{ 'text-decoration-line-through': task.completed }">{{ task.title }}</p>
                  <p class="d-flex d-sm-none"><v-icon class="mr-2" icon="mdi-clock"></v-icon>{{ formatDateTimeToLocal(task.deadline) }}</p>
                  <v-tooltip
                      v-if="task.description"
                      activator="parent"
                      location="bottom"
                  >{{ task.description }}</v-tooltip>
                </v-list-item-title>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card>
                  <v-toolbar
                      color="primary"
                      title="Task"
                  ></v-toolbar>
                  <v-card-text>
                    <v-sheet width="300" class="mx-auto">
                      <p class="font-weight-bold ">Title:</p>
                      <p>{{ task.title }}</p>
                      <p class="font-weight-bold mt-2" v-if="task.description">Description:</p>
                      <p>{{ task.description }}</p>
                      <p class="font-weight-bold mt-2" v-if="task.deadline">Deadline:</p>
                      <p>{{ formatDateTimeToLocal(task.deadline) }}</p>
                    </v-sheet>

                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn
                        variant="text"
                        @click="isActive.value = false"
                    >Close</v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </v-col>
          <v-col class="w-25 hidden-xs"><p style="text-align: end"><v-icon class="mr-2" icon="mdi-clock"></v-icon>{{ formatDateTimeToLocal(task.deadline) }}</p></v-col>
        </v-row>
      </v-container>

      <template v-slot:append>

        <v-dialog
            transition="dialog-top-transition"
            width="auto"
        >
          <template v-slot:activator="{ props }">
            <v-btn
                color="grey-lighten-1"
                icon="mdi-pencil"
                variant="text"
                v-bind="props"
                @click="editedTask.value = {...task}"
            ></v-btn>
          </template>
          <template v-slot:default="{ isActive }">
            <v-card>
              <v-toolbar
                  color="primary"
                  title="Edit the task"
              ></v-toolbar>
              <v-card-text>
                <v-sheet width="300" class="mx-auto">
                  <v-form fast-fail @submit.prevent>
                    <v-textarea
                        rows="1"
                        v-model="editedTask.value.title"
                        label="Title"
                        variant="outlined"
                    ></v-textarea>
                    <v-textarea
                        rows="1"
                        v-model="editedTask.value.description"
                        label="Description"
                        variant="outlined"
                    ></v-textarea>
                    <v-text-field
                        v-model="editedTask.value.deadline"
                        label="Deadline"
                        type="datetime-local"
                    ></v-text-field>

                    <v-btn type="submit" color="primary" :block="true" class="mt-2" @click="editTask(editedTask.value)">Edit</v-btn>
                  </v-form>
                </v-sheet>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                    variant="text"
                    @click="isActive.value = false"
                >Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <v-btn
            color="grey-lighten-1"
            icon="mdi-delete"
            variant="text"
            @click="deleteTask(task._id, task.completed)"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<style scoped>
  .text-decoration-line-through {
    text-decoration: line-through;
  }
</style>
