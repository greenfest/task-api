import {defineStore} from 'pinia';

export const useProfileStore = defineStore('profile', {
    state: () => ({
        profile: {
            email: '',
            avatar: '',
        },
    }),
    getters: {
        getEmail: (state) => {
            return state.profile.email;
        },
        getAvatar: (state) => {
            return state.profile.avatar;
        },
    },
    actions: {
        async editEmail(newEmail: string){
            const token = useCookie('token');
            const response = await fetch('http://localhost:4000/users', {
                method: "PATCH",
                headers: {
                    "Authorization": token ? "Bearer " + token.value : "",
                },
                body: JSON.stringify({ email: newEmail }),
            });
            const status = await response.json();
            this.profile.email = status.email;
            if (status.error){
                throw new Error(status.message)
            }
        },
        async fetchProfile() {
            const token = useCookie('token');
            const response = await fetch('http://localhost:4000/users/profile', {
                method: "GET",
                headers: {
                    "Authorization": token ? "Bearer " + token.value : "",
                }
            });
            const user = await response.json();
            this.profile.email = user.email;
            this.profile.avatar = user.avatar;
        }
    }

})