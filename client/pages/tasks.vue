<script setup lang="ts">
  const token = useCookie('token');

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

      // Ожидаем завершения запроса перед обновлением данных
      await response.json();

      // Обновление данных после успешного запроса
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

</script>

<template>
  <v-list lines="one">
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

      <template v-slot:append>
        <v-btn
            color="grey-lighten-1"
            icon="mdi-information"
            variant="text"
        ></v-btn>
      </template>
    </v-list-item>
  </v-list>

  <v-list lines="one">
    <v-list-subheader>Completed tasks</v-list-subheader>

    <v-list-item
        v-for="task in completedTasks"
        :key="task._id"
        class="flex align-content-center"
    >
      <template v-slot:default>
        <v-list-item-content>
          <v-list-item-title
              v-text="task.title"
              :class="{ 'text-decoration-line-through': task.completed }"
          ></v-list-item-title>
        </v-list-item-content>
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
</style>