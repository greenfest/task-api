<script setup>
import {computed, onMounted} from "vue";
import { useTasksStore } from '../store/tasks';

const tasksStore = useTasksStore();
const data = computed(() => tasksStore.tasks);

onMounted(async () => {
  await tasksStore.loadTasks();
});

const formatDate = (date) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  const newDate = new Date(date);
  return newDate.toLocaleDateString("ru-RU", options);
}

</script>

<template>
  <div class="flex flex-wrap gap-5 relative">
    <div v-if="data.length">
      <va-card
          square
          outlined
          v-for="task in data"
          :key="task._id"
      >
        <va-card-title>{{ task.title }}</va-card-title>
        <va-card-content>
          Описание: {{ task.description }}<br>
          Создана: {{ formatDate(task.date) }}<br>
          Срок: {{ formatDate(task.deadline) }}
          <div class="flex items-center absolute top-0.5 right-0.5">
            <va-button
                preset="secondary"
                border-color="primary"
                class="mr-6 mb-2"
            >
              <va-icon class="material-icons">
                edit
              </va-icon>
            </va-button>
          </div>
        </va-card-content>
      </va-card>
    </div>
    <p v-else class="mt-4 ml-4">
      Добавьте хотя бы одну задачу...
    </p>
  </div>
</template>

<style scoped>
</style>