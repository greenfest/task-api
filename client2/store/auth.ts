import { defineStore } from 'pinia';

interface UserPayloadInterface {
    email: string;
    password: string;
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        authenticated: false,
        loading: false,
    }),
    actions: {
        async authenticateUser({ email, password }: UserPayloadInterface) {
            const userObj = {
                user: {
                    email: email,
                    password: password
                }
            }
            const { data, pending }: any = await useFetch('http://localhost:4000/users/login', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userObj),
            });
            this.loading = pending;
            if (data.value.user) {
                const token = useCookie('token');
                token.value = data?.value?.user?.token;
                this.authenticated = true;
            }
        },
        logUserOut() {
            const token = useCookie('token');
            this.authenticated = false;
            token.value = null;
        },
    },
});