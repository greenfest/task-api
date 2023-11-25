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
            try {
                if (!email || !password) {
                    throw new Error("Email and password must be filled in.");
                }
                const userObj = {
                    user: {
                        email: email,
                        password: password
                    }
                }
                const { data, pending, error }: any = await useFetch('http://localhost:4000/users/login', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userObj),
                });


                if (error?.value?.data?.errors) {
                    throw new Error(`Authorization error: ${error.value.data.errors.info.message}`);
                }

                this.loading = pending;

                if (data.value.user) {
                    const token = useCookie('token');
                    token.value = data?.value?.user?.token;
                    if (!token.value) {
                        throw new Error("Failed to get a user token.");
                    }
                    this.authenticated = true;
                }
            } catch(error) {
                return error;
            }

        },
        async signUpUser({ email, password }: UserPayloadInterface) {
            try {
                if (!email || !password) {
                    throw new Error("Email and password must be filled in.");
                }
                const userObj = {
                    user: {
                        email: email,
                        password: password
                    }
                }
                const { data, pending, error }: any = await useFetch('http://localhost:4000/users/', {
                    method: 'post',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userObj),
                });


                if (error?.value?.data?.errors) {
                    throw new Error(`Authorization error: ${error.value.data.errors.info.message}`);
                }

                this.loading = pending;

                if (data.value.user) {
                    const token = useCookie('token');
                    token.value = data?.value?.user?.token;
                    if (!token.value) {
                        throw new Error("Failed to get a user token.");
                    }
                    this.authenticated = true;
                }
            } catch(error) {
                return error;
            }

        },
        logUserOut() {
            const token = useCookie('token');
            this.authenticated = false;
            token.value = null;
        },
    },
});