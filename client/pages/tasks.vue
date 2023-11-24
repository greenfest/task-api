<script setup lang="ts">
  import { format, parseISO } from 'date-fns';
  import { utcToZonedTime } from 'date-fns-tz';


  const token = useCookie('token');
  let isError = false;
  let isSuccess = false;

  const response = await fetch('http://localhost:4000/tasks', {
    method: "GET",
    headers: {
      "Authorization": token ? "Bearer " + token._value : "",
    },
  });
  const tasks = await response.json();

  const uncompletedTasks = ref(tasks.uncompleted);
  const completedTasks = ref(tasks.completed);

  async function toggleTask(taskId: String, isCompleted: Boolean) {
    try {
      const response = await fetch(`http://localhost:4000/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? "Bearer " + token._value : "",
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
    const taskToUpdate = uncompletedTasks.value.find(task => task._id === taskId) ||
        completedTasks.value.find(task => task._id === taskId);

    if (taskToUpdate) {
      taskToUpdate.completed = isCompleted;

      // Обновляем массивы в зависимости от статуса задачи
      if (isCompleted) {
        completedTasks.value.push(taskToUpdate);
        uncompletedTasks.value = uncompletedTasks.value.filter(task => task._id !== taskId);
      } else {
        uncompletedTasks.value.push(taskToUpdate);
        completedTasks.value = completedTasks.value.filter(task => task._id !== taskId);
      }
    }
  }

  const newTask = ref({
    title: null,
    description: null,
    date: new Date,
    deadline: null,
    completed: false,
  });

  async function createTask() {
    try {
      const taskObj = {...newTask._value};
      taskObj.deadline = new Date(taskObj.deadline);
      console.log(taskObj);
      const response = await fetch(`http://localhost:4000/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? "Bearer " + token._value : "",
        },
        body: JSON.stringify(taskObj),
      });

      const task = await response.json();
      uncompletedTasks.value .push(task);
      isSuccess = true;
    } catch (error) {
      console.error('Error creating a new task', error);
      isError = true;
    }

  }

  function formatDateTimeToLocal(dateTimeString) {
    const utcDateTime = parseISO(dateTimeString);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zonedDateTime = utcToZonedTime(utcDateTime, timeZone);

    const formattedDateTime = format(zonedDateTime, 'dd.MM.yyyy HH:mm', { timeZone });

    return formattedDateTime;
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

              <v-btn type="submit" color="primary" block class="mt-2" @click="createTask">Submit</v-btn>
              <v-alert
                  v-if="isError"
                  class="mb-3 mt-3"
                  color="error"
                  variant="tonal"
                  type="error"
                  text="A new task wasn't added"
              ></v-alert>
              <v-alert
                  v-if="isSuccess"
                  class="mb-3 mt-3"
                  color="success"
                  variant="tonal"
                  type="success"
                  text="A new task was added"
              ></v-alert>
            </v-form>
          </v-sheet>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn
              variant="text"
              @click="isActive.value = false; isError = !isError; isSuccess = !isSuccess"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>



  <v-list lines="one" class="rounded">
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
          <v-col><p style="text-align: end">{{ "Deadline: " + formatDateTimeToLocal(task.deadline) }}</p></v-col>
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
                        v-model="task.title"
                        label="Title"
                    ></v-text-field>
                    <v-text-field
                        v-model="task.description"
                        label="Description"
                    ></v-text-field>
                    <v-text-field
                        v-model="task.deadline"
                        label="Deadline"
                        type="datetime-local"
                        value="task.deadline"
                    ></v-text-field>

                    <v-btn type="submit" color="primary" block class="mt-2" @click="createTask">Edit</v-btn>
                    <v-alert
                        v-if="isError"
                        class="mb-3 mt-3"
                        color="error"
                        variant="tonal"
                        type="error"
                        text="The task wasn't edited."
                    ></v-alert>
                    <v-alert
                        v-if="isSuccess"
                        class="mb-3"
                        color="success"
                        variant="tonal"
                        type="success"
                        text="The task was edited."
                    ></v-alert>
                  </v-form>
                </v-sheet>
              </v-card-text>
              <v-card-actions class="justify-end">
                <v-btn
                    variant="text"
                    @click="isActive.value = false; isError = !isError; isSuccess = !isSuccess"
                >Close</v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-dialog>

        <v-btn
            color="grey-lighten-1"
            icon="mdi-delete"
            variant="text"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>

  <v-list lines="one" class="rounded">
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
        <v-btn
            color="grey-lighten-1"
            icon="mdi-pencil"
            variant="text"
        ></v-btn>
        <v-btn
            color="grey-lighten-1"
            icon="mdi-delete"
            variant="text"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<style>
.text-decoration-line-through {
  text-decoration: line-through;
}

.date-picker {
  width: 100%;
}
</style>