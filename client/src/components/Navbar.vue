<script setup>

</script>

<template>
  <va-navbar
      color="#E3E3E3"
      class="h-24"
  >
    <template #left>
      <va-navbar-item class="logo">
        TaskApp
      </va-navbar-item>
    </template>
    <template #right>
      <va-navbar-item>Dashboard</va-navbar-item>
      <va-navbar-item>
        <va-icon name="search" />
      </va-navbar-item>
      <va-navbar-item>
        <va-icon name="account_circle" />
      </va-navbar-item>
    </template>
  </va-navbar>
</template>

<style scoped>
.logo {
  font-weight: 600;
  font-size: 1.5rem;
}
</style>