<script setup lang="ts">

import TaskList from "~/components/tasks/taskList.vue";
import { useTaskStore } from '~/store/tasks';
import {storeToRefs} from "pinia";

definePageMeta({
  middleware: "auth",
});

const { tasks } = storeToRefs(useTaskStore());
const store = useTaskStore();

await store.fetchTasks();

const newTask = ref({
  title: null,
  description: null,
  date: String,
  deadline: String,
  completed: false,
});

const areArraysNotEmpty = () => {
  if (store.tasks) {
    return store.tasks.completed.length || store.tasks.uncompleted.length;
  } else {
    return false;
  }
};

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
              <v-textarea
                  v-model="newTask.title"
                  label="Title"
                  rows="1"
                  variant="outlined"
              ></v-textarea>
              <v-textarea
                  v-model="newTask.description"
                  label="Description"
                  rows="1"
                  variant="outlined"
              ></v-textarea>
              <v-text-field
                  v-model="newTask.deadline"
                  label="Deadline"
                  type="datetime-local"
              ></v-text-field>

              <v-btn type="submit" color="primary" :block="true" class="mt-2" @click="store.createTask(newTask)">Submit</v-btn>

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
  <div v-if="areArraysNotEmpty">
    <TaskList
        v-bind:title="'Uncompleted Tasks'"
        v-bind:tasks="tasks"
        class="mb-4"
    ></TaskList>
    <TaskList
        v-bind:title="'Completed Tasks'"
        v-bind:tasks="tasks"
        class="mb-4"
    ></TaskList>
  </div>
  <p v-else>There are no tasks here yet. You can create a new task</p>


<!-- Snackbar -->
  <v-snackbar
      v-model="store.snackbar.isActive"
      :timeout="2000"
  >
    {{ store.snackbar.text }}

    <template v-slot:actions>
      <v-btn
          color="blue"
          variant="text"
          @click="store.snackbar.isActive = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>

</template>

<style>
</style>