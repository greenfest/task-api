<script setup>
import {onMounted, ref} from "vue";

const data = ref(null);
const loading = ref(true);
const error = ref(null);

function fetchData() {
  loading.value = true;
  return fetch('http://localhost:3000/tasks', {
    method: 'get',
    headers: {
      'content-type': 'application/json'
    }
  })
      .then(res => {
        // a non-200 response code
        if (!res.ok) {
          // create error instance with HTTP status text
          const error = new Error(res.statusText);
          error.json = res.json();
          throw error;
        }
        return res.json();
      })
      .then(json => {
        // set the response data

        data.value = json;
      })
      .catch(err => {
        error.value = err;
        // In case a custom JSON error response was provided
        if (err.json) {
          return err.json.then(json => {
            // set the JSON response message
            error.value.message = json.message;
          });
        }
      })
      .then(() => {
        loading.value = false;
      });
}

onMounted(() => {
  fetchData();
});

</script>
<script>
export default {
  methods: {
    formatDate(date) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      const newDate = new Date(date);
      return newDate.toLocaleDateString("ru-RU", options);
    },
  }
}
</script>

<template>
  <div class="flex flex-wrap gap-5">
    <div v-if="!loading && data && data.length"></div>
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
      </va-card-content>
    </va-card>
    <p v-if="loading">
      Still loading..
    </p>
    <p v-if="error"></p>
  </div>
</template>

<style scoped>

</style>