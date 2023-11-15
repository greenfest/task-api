<script setup>
definePageMeta({
  layout: "blank" ,
});


import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'; // import the auth store we just created

const { authenticateUser } = useAuthStore(); // use authenticateUser action from  auth store
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const visiblePassword = ref(false);
const isEmailValid = ref(false);
const isPasswordValid = ref(false);
const isValid = ref(false);

const user = ref({
  email: '',
  password: '',
});

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Invalid Email address',
];

const passwordRules = [
  v => !!v || 'Password is required',
];

const checkEmailFormat = () => {
  isEmailValid.value = /.+@.+\..+/.test(user.value.email);
  updateFormValidity();
};

const checkPasswordFormat = () => {
  isPasswordValid.value = user.value.password.trim() !== '';
  updateFormValidity();
};

const updateFormValidity = () => {
  isValid.value = isEmailValid.value && isPasswordValid.value;
};

let incorrectAuth = ref(false);

const router = useRouter();


const login = async () => {
  const error = await authenticateUser(user.value);
  if (error) {
    incorrectAuth.value = true;
    console.log(error);
    return;
  }

  if (authenticated) {
    await router.push('/dashboard');
  } else {
    incorrectAuth.value = true;
  }
};

</script>

<template>
  <div>
    <v-img
        class="mx-auto my-6"
        max-width="228"
        src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-v3-slim-text-light.svg"
    ></v-img>

    <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Account</div>

      <v-text-field
          density="compact"
          placeholder="Email address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          v-model="user.email"
          @input="checkEmailFormat"
          :rules="emailRules"
      ></v-text-field>

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Password

        <a
            class="text-caption text-decoration-none text-blue"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
        >
          Forgot login password?</a>
      </div>

      <v-text-field
          :append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visiblePassword ? 'text' : 'password'"
          density="compact"
          placeholder="Enter your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visiblePassword = !visiblePassword"
          v-model="user.password"
          @input="checkPasswordFormat"
          :rules="passwordRules"
      ></v-text-field>

      <v-card
          class="mb-12"
          color="surface-variant"
          variant="tonal"
      >
        <v-card-text class="text-medium-emphasis text-caption">
          Warning: After 3 consecutive failed login attempts, you account will be temporarily locked for three hours. If you must login now, you can also click "Forgot login password?" below to reset the login password.
        </v-card-text>
      </v-card>

      <v-btn
          block
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          @click="login"
          :disabled="!isValid"
      >
        Log In
      </v-btn>

      <v-card-text class="text-center">
        <a
            class="text-blue text-decoration-none"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
        >
          Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
        </a>
      </v-card-text>

      <v-alert
          v-if="incorrectAuth"
          class="mb-3"
          color="error"
          variant="tonal"
          type="error"
          text="The email address or password you entered is incorrect."
      ></v-alert>

    </v-card>
  </div>
</template>

<style scoped>

</style>