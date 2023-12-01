<script setup lang="ts">

  import type { Tasks, Task, TaskResponse } from '@/types/taskTypes';
  import TaskList from "~/components/tasks/taskList.vue";

  const token = useCookie('token');
  const response = await fetch('http://localhost:4000/tasks', {
    method: "GET",
    headers: {
      "Authorization": token ? "Bearer " + token.value : "",
    },
  });

  const tasks: TaskResponse = await response.json();

  let snackbarTaskAdded = ref(false);
  let snackbarTaskAddingError = ref(false);
  let snackbarTaskDeleted = ref(false);
  let snackbarTaskDeletedError = ref(false);
  let snackbarTaskEdited = ref(false);
  let snackbarTaskEditingError = ref(false);

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
      @snackbarEvents="handleSnackbarEvents"
      ></TaskList>

<!--  <v-list class="rounded" v-if="areArraysNotEmpty()">-->
<!--    <v-list-subheader>Completed tasks</v-list-subheader>-->
<!--    <v-list-item-->
<!--        v-for="task in completedTasks"-->
<!--        :key="task._id"-->
<!--    >-->
<!--      <template v-slot:prepend>-->
<!--        <v-checkbox-->
<!--            @click="toggleTask(task._id, task.completed)"-->
<!--            color="primary"-->
<!--            hide-details-->
<!--        ></v-checkbox>-->
<!--      </template>-->
<!--      <v-container>-->
<!--        <v-row justify="space-between">-->
<!--          <v-col class="w-75 text-truncate">-->
<!--            <v-dialog-->
<!--                transition="dialog-top-transition"-->
<!--                width="auto"-->
<!--            >-->
<!--              <template v-slot:activator="{ props }">-->
<!--                <v-list-item-title  v-bind="props">-->
<!--                  <p :class="{ 'text-decoration-line-through': task.completed }">{{ task.title }}</p>-->
<!--                  <p class="d-flex d-sm-none"><v-icon class="mr-2" icon="mdi-clock"></v-icon>{{ formatDateTimeToLocal(task.deadline) }}</p>-->
<!--                  <v-tooltip-->
<!--                      v-if="task.description"-->
<!--                      activator="parent"-->
<!--                      location="bottom"-->
<!--                  >{{ task.description }}</v-tooltip>-->
<!--                </v-list-item-title>-->
<!--              </template>-->
<!--              <template v-slot:default="{ isActive }">-->
<!--                <v-card>-->
<!--                  <v-toolbar-->
<!--                      color="primary"-->
<!--                      title="Task"-->
<!--                  ></v-toolbar>-->
<!--                  <v-card-text>-->
<!--                    <v-sheet width="300" class="mx-auto">-->
<!--                      <p class="font-weight-bold ">Title:</p>-->
<!--                      <p>{{ task.title }}</p>-->
<!--                      <p class="font-weight-bold mt-2" v-if="task.description">Description:</p>-->
<!--                      <p>{{ task.description }}</p>-->
<!--                      <p class="font-weight-bold mt-2" v-if="task.deadline">Deadline:</p>-->
<!--                      <p>{{ formatDateTimeToLocal(task.deadline) }}</p>-->
<!--                    </v-sheet>-->

<!--                  </v-card-text>-->
<!--                  <v-card-actions class="justify-end">-->
<!--                    <v-btn-->
<!--                        variant="text"-->
<!--                        @click="isActive.value = false"-->
<!--                    >Close</v-btn>-->
<!--                  </v-card-actions>-->
<!--                </v-card>-->
<!--              </template>-->
<!--            </v-dialog>-->
<!--          </v-col>-->
<!--          <v-col class="w-25 hidden-xs"><p style="text-align: end"><v-icon class="mr-2" icon="mdi-clock"></v-icon>{{ formatDateTimeToLocal(task.deadline) }}</p></v-col>-->
<!--        </v-row>-->
<!--      </v-container>-->

<!--      <template v-slot:append>-->

<!--        <v-dialog-->
<!--            transition="dialog-top-transition"-->
<!--            width="auto"-->
<!--        >-->
<!--          <template v-slot:activator="{ props }">-->
<!--            <v-btn-->
<!--                color="grey-lighten-1"-->
<!--                icon="mdi-pencil"-->
<!--                variant="text"-->
<!--                v-bind="props"-->
<!--                @click="editedTask.value = {...task}"-->
<!--            ></v-btn>-->
<!--          </template>-->
<!--          <template v-slot:default="{ isActive }">-->
<!--            <v-card>-->
<!--              <v-toolbar-->
<!--                  color="primary"-->
<!--                  title="Edit the task"-->
<!--              ></v-toolbar>-->
<!--              <v-card-text>-->
<!--                <v-sheet width="300" class="mx-auto">-->
<!--                  <v-form fast-fail @submit.prevent>-->
<!--                    <v-textarea-->
<!--                        rows="1"-->
<!--                        v-model="editedTask.value.title"-->
<!--                        label="Title"-->
<!--                        variant="outlined"-->
<!--                    ></v-textarea>-->
<!--                    <v-textarea-->
<!--                        rows="1"-->
<!--                        v-model="editedTask.value.description"-->
<!--                        label="Description"-->
<!--                        variant="outlined"-->
<!--                    ></v-textarea>-->
<!--                    <v-text-field-->
<!--                        v-model="editedTask.value.deadline"-->
<!--                        label="Deadline"-->
<!--                        type="datetime-local"-->
<!--                    ></v-text-field>-->

<!--                    <v-btn type="submit" color="primary" :block="true" class="mt-2" @click="editTask(editedTask.value)">Edit</v-btn>-->
<!--                  </v-form>-->
<!--                </v-sheet>-->
<!--              </v-card-text>-->
<!--              <v-card-actions class="justify-end">-->
<!--                <v-btn-->
<!--                    variant="text"-->
<!--                    @click="isActive.value = false"-->
<!--                >Close</v-btn>-->
<!--              </v-card-actions>-->
<!--            </v-card>-->
<!--          </template>-->
<!--        </v-dialog>-->

<!--        <v-btn-->
<!--            color="grey-lighten-1"-->
<!--            icon="mdi-delete"-->
<!--            variant="text"-->
<!--            @click="deleteTask(task._id, task.completed)"-->
<!--        ></v-btn>-->
<!--      </template>-->
<!--    </v-list-item>-->
<!--  </v-list>-->
<!--  <p v-else class="mt-3">There are no tasks yet. You can add a new task.</p>-->


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