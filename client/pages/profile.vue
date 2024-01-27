<script setup lang="ts">

import {useProfileStore} from "~/store/profile";

definePageMeta({
  middleware: "auth",
});

const newProfileData = ref({
  email: "",
  avatar: "",
  password: "",
});

const inputStates = ref({
  email: false,
  password: false,
});

const profileStore  = useProfileStore();
await profileStore.fetchProfile();

newProfileData.value.email = profileStore.getEmail;
newProfileData.value.avatar = profileStore.getAvatar;

const editEmail = () => {
  profileStore.editEmail(newProfileData.value.email);
  inputStates.value.email = !inputStates.value.email;
}

const editPassword = () => {
  profileStore.editPassword(newProfileData.value.password);
  inputStates.value.password = !inputStates.value.password;
}

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
      <v-list-item-title>
        {{ `Email:` }}
      </v-list-item-title>
      <v-text-field
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          v-model="newProfileData.email"
          :disabled="!inputStates.email"
      ></v-text-field>
      <template v-slot:append>
        <v-icon v-if="!inputStates.email" class="email-input mr-2" icon="mdi-pencil" @click="inputStates.email = !inputStates.email"></v-icon>
        <v-icon v-else class="mr-2" icon="mdi-check" @click="editEmail()"></v-icon>
      </template>
    </v-list-item>

    <v-list-item class="ml-3">
      <v-list-item-title>{{ `Password:` }}</v-list-item-title>
      <v-text-field
          placeholder="******"
          prepend-inner-icon="mdi-email-outline"
          v-model="newProfileData.password"
          type="password"
          :disabled="!inputStates.password"
      ></v-text-field>
      <template v-slot:append>
        <v-icon v-if="!inputStates.password" class="password-input mr-2" icon="mdi-pencil" @click="inputStates.password = !inputStates.password"></v-icon>
        <v-icon v-else class="mr-2" icon="mdi-check" @click="editPassword()"></v-icon>
      </template>
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