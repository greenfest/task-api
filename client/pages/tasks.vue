<script setup lang="ts">

import type {TaskResponse} from '@/types/taskTypes';
import TaskList from "~/components/tasks/taskList.vue";

const token = useCookie('token');
  const response = await fetch('http://localhost:4000/tasks', {
    method: "GET",
    headers: {
      "Authorization": token ? "Bearer " + token.value : "",
    },
  });
  const tasksObj = await response.json();
  let tasks: Ref<TaskResponse> = ref(tasksObj);

  async function fetchTasks() {
    const response = await fetch('http://localhost:4000/tasks', {
      method: "GET",
      headers: {
        "Authorization": token ? "Bearer " + token.value : "",
      },
    });
    tasks.value = await response.json();
  }





  let snackbarTaskAdded = ref(false);
  let snackbarTaskAddingError = ref(false);
  let snackbarTaskDeleted = ref(false);
  let snackbarTaskDeletedError = ref(false);
  let snackbarTaskEdited = ref(false);
  let snackbarTaskEditingError = ref(false);


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
      await fetchTasks();
      snackbarTaskAdded.value = true;
    } catch (error) {
      console.error('Error creating a new task', error);
      snackbarTaskAddingError.value = true;
    }
  }

  const newTask = ref({
    title: null,
    description: null,
    date: new Date,
    deadline: new Date,
    completed: false,
  });

  function handleSnackbarEvents(eventName: string) {
    if(eventName === 'snackbarTaskAdded') {
      snackbarTaskAdded.value = !snackbarTaskAdded.value;
    } else if(eventName === 'snackbarTaskAddingError') {
      snackbarTaskAddingError.value = !snackbarTaskAddingError.value;
    } else if(eventName === 'snackbarTaskDeleted') {
      snackbarTaskDeleted.value = !snackbarTaskDeleted.value;
    } else if(eventName === 'snackbarTaskDeletedError') {
      snackbarTaskDeletedError.value = !snackbarTaskDeletedError.value;
    } else if(eventName === 'snackbarTaskEdited') {
      snackbarTaskEdited.value = !snackbarTaskEdited.value;
    } else if(eventName === 'snackbarTaskEditingError') {
      snackbarTaskEditingError.value = !snackbarTaskEditingError.value;
    }
  }

</script>

<template>

  <v-dialog
      transition="dialog-top-transition"
      width="auto"
  >
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" class="mb-3"><v-icon icon="mdi-plus"></v-icon>Add task</v-btn>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card>
        <v-toolbar
            color="primary"
            title="Add a task"
        ></v-toolbar>
        <v-card-text>
          <v-sheet width="300" class="mx-auto">
            <v-form fast-fail @submit.prevent>
              <v-text-field
                  v-model="newTask.title"
                  label="Title"
              ></v-text-field>
              <v-text-field
                  v-model="newTask.description"
                  label="Description"
              ></v-text-field>
              <v-text-field
                  v-model="newTask.deadline"
                  label="Deadline"
                  type="datetime-local"
              ></v-text-field>

              <v-btn type="submit" color="primary" :block="true" class="mt-2" @click="createTask">Submit</v-btn>

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

  <TaskList
      v-bind:title="'Uncompleted Tasks'"
      v-bind:tasks="tasks"
      v-model="tasks"
      @snackbarEvents="handleSnackbarEvents"
      class="mb-4"
  ></TaskList>
  <TaskList
      v-bind:title="'Completed Tasks'"
      v-bind:tasks="tasks"
      v-model="tasks"
      @snackbarEvents="handleSnackbarEvents"
      class="mb-4"
  ></TaskList>

<!-- Snackbars - Adding -->
  <v-snackbar
      v-model="snackbarTaskAdded"
      :timeout="3000"
  >
    A new task was added

    <template v-slot:actions>
      <v-btn
          color="blue"
          variant="text"
          @click="snackbarTaskAdded = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar
      v-model="snackbarTaskAddingError"
      :timeout="3000"
  >
    A new task was not added. Please try again later.

    <template v-slot:actions>
      <v-btn
          color="blue"
          variant="text"
          @click="snackbarTaskAddingError = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>

<!--  Snackbars - Editing -->
  <v-snackbar
      v-model="snackbarTaskEdited"
      :timeout="3000"
  >
    The task was edited successfully

    <template v-slot:actions>
      <v-btn
          color="blue"
          variant="text"
          @click="snackbarTaskEdited = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar
      v-model="snackbarTaskEditingError"
      :timeout="3000"
  >
    The task was not edited. Please try again later.

    <template v-slot:actions>
      <v-btn
          color="blue"
          variant="text"
          @click="snackbarTaskEditingError = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>

<!-- Snackbars - Deleting -->
  <v-snackbar
      v-model="snackbarTaskDeleted"
      :timeout="3000"
  >
    The task was deleted.

    <template v-slot:actions>
      <v-btn
          color="blue"
          variant="text"
          @click="snackbarTaskDeleted = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
  <v-snackbar
      v-model="snackbarTaskDeletedError"
      :timeout="3000"
  >
    The task was not deleted. Please try again later.

    <template v-slot:actions>
      <v-btn
          color="blue"
          variant="text"
          @click="snackbarTaskDeletedError = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>

</template>

<style>
.text-decoration-line-through {
  text-decoration: line-through;
}
</style>