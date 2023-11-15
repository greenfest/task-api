import {useAuthStore} from "~/store/auth";
import {storeToRefs} from "pinia";

export default defineNuxtRouteMiddleware((to, from) => {
    const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
    const token = useCookie('token'); // get token from cookies

    if (token.value) {
        authenticated.value = true; // update the state to authenticated
    }

    if (token.value && to?.name === 'login') {
        return navigateTo('/');
    }

    if (!token.value && to?.name !== 'login') {
        abortNavigation();
        return navigateTo('/login');
    }
})