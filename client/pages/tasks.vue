<script setup lang="ts">
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
    console.log(newTask._value);
    try {
      const response = await fetch(`http://localhost:4000/tasks/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? "Bearer " + token._value : "",
        },
        body: JSON.stringify(newTask._value),
      });

      const task = await response.json();
      uncompletedTasks.value .push(task);
      isSuccess = true;
    } catch (error) {
      console.error('Error creating a new task', error);
      isError = true;
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
                  type="date"
              ></v-text-field>

              <v-btn type="submit" color="primary" block class="mt-2" @click="createTask">Submit</v-btn>
              <v-alert
                  v-if="isError"
                  class="mb-3"
                  color="error"
                  variant="tonal"
                  type="error"
                  text="The email address or password you entered is incorrect."
              ></v-alert>
              <v-alert
                  v-if="isSuccess"
                  class="mb-3"
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
              @click="isActive.value = false; isError = false; isSuccess = false"
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
        :title="task.title"
    >
      <template v-slot:prepend>
        <v-checkbox
            @click="toggleTask(task._id, task.completed)"
            color="primary"
            hide-details
        ></v-checkbox>
      </template>
      <p></p>
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

  <v-list lines="one" class="rounded">
    <v-list-subheader>Completed tasks</v-list-subheader>

    <v-list-item
        v-for="task in completedTasks"
        :key="task._id"
        class="flex align-content-center"
    >
      <template v-slot:default>
          <v-list-item-title
              v-text="task.title"
              :class="{ 'text-decoration-line-through': task.completed }"
          ></v-list-item-title>
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
            icon="mdi-information"
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