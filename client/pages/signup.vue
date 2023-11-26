<script setup>
definePageMeta({
  layout: "blank" ,
});

import { storeToRefs } from 'pinia'; // import storeToRefs helper hook from pinia
import { useAuthStore } from '~/store/auth'; // import the auth store we just created

const { signUpUser } = useAuthStore(); // use authenticateUser action from  auth store
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs

const visiblePassword = ref(false);
const isEmailValid = ref(false);
const isPasswordValid = ref(false);
const isValid = ref(false);

const user = ref({
  email: '',
  password: '',
  confirmPassword: '',
});

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Invalid Email address',
];

const passwordRules = [
  v => !!v || 'Password is required',
];

const confirmPasswordRules = [
  v => !!v || 'Password is required',
  v => v === user.value.password || 'Please make sure your passwords match',
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


const signup = async () => {
  const error = await signUpUser(user.value);
  if (error) {
    incorrectAuth.value = true;
    console.error(error);
    return;
  }

  if (authenticated) {
    await router.push('/dashboard');
  } else {
    incorrectAuth.value = true;
  }
};

const activateSubmit = computed(() => {
  return isValid.value && (user.value.password === user.value.confirmPassword) ;
});

</script>

<template>
  <div>

    <div class="text-h1 mx-auto my-6" style="max-width: 228px; text-align: center">Sign Up</div>

    <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="448"
        rounded="lg"
    >
      <div class="text-subtitle-1 text-medium-emphasis">Email</div>

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

      <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
        Confirm Password
      </div>

      <v-text-field
          :append-inner-icon="visiblePassword ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visiblePassword ? 'text' : 'password'"
          density="compact"
          placeholder="Confirm your password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visiblePassword = !visiblePassword"
          v-model="user.confirmPassword"
          :rules="confirmPasswordRules"
      ></v-text-field>

      <v-card
          class="mb-12"
          color="surface-variant"
          variant="tonal"
      >
      </v-card>

      <v-btn
          block=""
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          @click="signup"
          :disabled="!activateSubmit"
      >
        Sign Up
      </v-btn>

      <NuxtLink to="/login" class="d-flex">
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
      </NuxtLink>

      <v-alert
          v-if="incorrectAuth"
          class="mb-3"
          color="error"
          variant="tonal"
          type="error"
          text="There is an error. Please try again later."
      ></v-alert>

    </v-card>
  </div>
</template>

<style scoped>

</style>