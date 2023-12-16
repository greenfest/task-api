<script setup lang="ts">
import type { Task } from '@/types/taskTypes';
import { format, parseISO } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";
import { useTaskStore } from "~/store/tasks";


const props = defineProps({
  title: String,
  tasks: Object || undefined,
});

const store = useTaskStore();
const tasks = props.tasks;

if (tasks) {
  if (tasks.completed.length !== 0) {
    tasks.completed.forEach((task: { deadline: string | any[]; }) => task.deadline = task.deadline.slice(0, 19));
  }

  if (tasks.uncompleted.length !== 0) {
    tasks.uncompleted.forEach((task: { deadline: string | any[]; }) => task.deadline = task.deadline.slice(0, 19));
  }
}

function formatDateTimeToLocal(dateTimeString: string) {
  const utcDateTime = parseISO(dateTimeString);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zonedDateTime = utcToZonedTime(utcDateTime, timeZone);

  return format(zonedDateTime, 'dd.MM.yyyy HH:mm');
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

const areArraysNotEmpty = () => {
  if (tasks) {
    return tasks.completed.length || tasks.uncompleted.length;
  } else {
    return false;
  }

};

</script>

<template>
  <v-list class="rounded" v-if="areArraysNotEmpty">
    <v-list-subheader>{{ props.title }}</v-list-subheader>

    <v-list-item
        v-for="task in props.title === 'Uncompleted Tasks' ? tasks.uncompleted || [] : tasks.completed || []"
        :key="task._id"
    >
      <template v-slot:prepend>
        <v-checkbox
            @click="store.toggleTask(task._id, task.completed)"
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
                  <p class="d-flex d-sm-none"><v-icon class="mr-2" icon="mdi-clock"></v-icon>
                    {{ formatDateTimeToLocal(task.deadline) }}</p>
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

                    <v-btn type="submit" color="primary" :block="true" class="mt-2" @click="store.editTask(editedTask.value)">Edit</v-btn>
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
            @click="store.deleteTask(task._id, task.completed)"
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
