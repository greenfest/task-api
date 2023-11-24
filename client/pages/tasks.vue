<script setup lang="ts">
  import {format, parseISO} from 'date-fns';
  import {utcToZonedTime} from 'date-fns-tz';


  const token = useCookie('token');
  const response = await fetch('http://localhost:4000/tasks', {
    method: "GET",
    headers: {
      "Authorization": token ? "Bearer " + token.value : "",
    },
  });

  interface Tasks {
    uncompleted: any;
    completed: any;
  }

  const tasks: Tasks = await response.json();
  tasks.uncompleted.forEach((task: { deadline: string | any[]; }) => task.deadline = task.deadline.slice(0, 19))
  tasks.completed.forEach((task: { deadline: string | any[]; }) => task.deadline = task.deadline.slice(0, 19))

  interface CompletedTasks {
    _id: string;
    title: string;
    deadline: string;
    value: any;
    description: string;
    completed: boolean;
  }

  interface UncompletedTasks {
    _id: string;
    title: string;
    deadline: string;
    value: any;
    description: string;
    completed: boolean;
  }

  const uncompletedTasks: UncompletedTasks= ref(tasks.uncompleted);
  const completedTasks: CompletedTasks = ref(tasks.completed);

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

  let snackbarTaskAdded = ref(false);
  let snackbarTaskAddingError = ref(false);

  async function createTask() {
    try {
      const taskObj = {...newTask.value};
      taskObj.deadline = new Date(taskObj.deadline);
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

  let snackbarTaskDeleted = ref(false);
  let snackbarTaskDeletedError = ref(false);

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

  interface Task {
    _id: string;
    title: string;
    deadline: string;
    value: any;
    description: string;
    completed: boolean;
  }


  let snackbarTaskEdited = ref(false);
  let snackbarTaskEditingError = ref(false);
  let editedTask: Ref<Task> = ref({
    _id: '',
    title: '',
    deadline: '',
    value: [],
    description: '',
    completed: false,
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



  <v-list class="rounded">
    <v-list-subheader>Uncompleted tasks</v-list-subheader>

    <v-list-item
        v-for="task in uncompletedTasks"
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
          <v-col><v-list-item-title>
            {{ task.title }}
            <v-tooltip
              activator="parent"
              location="top"
            >{{ task.description }}</v-tooltip>
          </v-list-item-title></v-col>
          <v-col><p class="hidden-xs" style="text-align: end"><v-icon class="mr-2" icon="mdi-clock"></v-icon>{{ formatDateTimeToLocal(task.deadline) }}</p></v-col>
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
                    <v-text-field
                        v-model="editedTask.value.title"
                        label="Title"
                    ></v-text-field>
                    <v-text-field
                        v-model="editedTask.value.description"
                        label="Description"
                    ></v-text-field>
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

  <v-list class="rounded">
    <v-list-subheader>Completed tasks</v-list-subheader>

    <v-list-item
        v-for="task in completedTasks"
        :key="task._id"
        class="flex align-content-center"
    >
      <template v-slot:default>
        <v-container>
          <v-row justify="space-between">
            <v-col><v-list-item-title :class="{ 'text-decoration-line-through': task.completed }">
              {{ task.title }}
              <v-tooltip
                  activator="parent"
                  location="top"
              >{{ task.description }}</v-tooltip>
            </v-list-item-title></v-col>
            <v-col><p style="text-align: end">{{ "Deadline: " + formatDateTimeToLocal(task.deadline) }}</p></v-col>
          </v-row>
        </v-container>
      </template>

      <template v-slot:prepend>
        <v-checkbox
            v-model="task.completed"
            @click="toggleTask(task._id, task.completed)"
            color="primary"
            hide-details
        ></v-checkbox>
      </template>

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
                    <v-text-field
                        v-model="editedTask.value.title"
                        label="Title"
                    ></v-text-field>
                    <v-text-field
                        v-model="editedTask.value.description"
                        label="Description"
                    ></v-text-field>
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