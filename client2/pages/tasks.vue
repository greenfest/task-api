<script setup lang="ts">
  // const { data: tasks } = await useFetch('http://localhost:4000/tasks');
  const { pending, data: tasks } = useFetch('http://localhost:4000/tasks', {
    lazy: true,
    server: false
  })
  console.log(tasks)
  // function toggleTask(taskId: String) {
  //   const task = tasks.value.filter(task => task.id === taskId);
  //   console.log(task);
  // }
</script>

<template>
  <v-list lines="one">
    <v-list-subheader>Uncompleted tasks</v-list-subheader>

    <v-list-item
        v-for="task in tasks"
        :key="task.id"
        :title="task.title"
    >
      <template v-slot:prepend>
        <v-checkbox
            @click="toggleTask(task.id)"
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
        v-for="task in tasks"
        :key="task.title"
        :title="task.title"
        class="flex align-content-center"
    >
      <template v-slot:prepend>
        <v-checkbox
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



<style scoped>

</style>