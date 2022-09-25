import { defineStore } from 'pinia'
import { AxiosInstance } from 'axios'
import {UserDocument} from "@entities/user";

interface IUserStore {
    user?: UserDocument
    _token: string
}

export const useUserStore = defineStore({
    id: 'user',

    state: (): IUserStore => ({
        user: undefined,
        _token: ''
    }),

    getters: {
        auth: (state) => !!state.user
    },

    actions: {
        setUser(payload: any) {
            this.user = payload
        },

        setToken(token: string) {
            this._token = token
        },

        async getMe(axios: AxiosInstance) {
            try {
                this.user = await axios.get('/smileeye/get-user')
            } catch (e) {
                //
            }
        },

        logout() {
            this._token = ''
            this.user = undefined
        }
    },
})
