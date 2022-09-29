import { defineStore } from 'pinia'
import {GoalDocument} from "@entities/goal";
import {UserDocument} from "@entities/user";

interface IRoomStore {
    goal?: GoalDocument
    page: 'confirm' | 'room' | 'kicked'
    sidebar?: 'users' | 'chat' | 'settings'
    members: UserDocument[]
}

export const useRoomStore = defineStore({
    id: 'room',

    state: (): IRoomStore => ({
        goal: undefined,
        sidebar: undefined,
        page: 'confirm',
        members: []
    }),


    getters: {
        hasSidebar: (state) => !!state.sidebar,
    },

    actions: {
        toogleTab(tab: 'users' | 'chat' | 'settings') {
            this.sidebar = tab === this.sidebar ? undefined : tab
        },

        async reset() {
            this.goal = undefined
            this.members = []
            this.sidebar = undefined
            this.page = 'confirm'
        }
    }
})
