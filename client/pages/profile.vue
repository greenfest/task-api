<script setup lang="ts">

import {storeToRefs} from "pinia";
import {useProfileStore} from "~/store/profile";

definePageMeta({
  middleware: "auth",
});

const profileStore  = useProfileStore();
await profileStore.fetchProfile();

</script>

<template>

  <h2 class="mb-3">Account Settings</h2>
  <v-list class="rounded">
    <div class="profile-avatar my-5 mx-5">
      <v-avatar image="/images/profile/user2.jpg" size="80">
      </v-avatar>
      <v-icon class="profile-avatar__edit" icon="mdi-pencil"></v-icon>
    </div>

    <v-list-item class="ml-3">
      <v-list-item-title>{{ `Email: ${profileStore.getEmail}` }}</v-list-item-title>
    </v-list-item>
    <v-list-item class="ml-3">
      <v-list-item-title>{{ `Password: ******` }}</v-list-item-title>
    </v-list-item>

  </v-list>

</template>

<style lang="scss" scoped>
.profile-avatar {
  position: relative;
  width: 80px;
  height: 80px;

  &:hover {
    .profile-avatar__edit {
      opacity: 1;
    }
  }

  &__edit {
    position: absolute;
    opacity: 0;
    top: 50%;
    left: 50%;
    transform: translateX(-50%);
    color: white;

    &:hover {
      opacity: 1;
    }
  }
}
</style>