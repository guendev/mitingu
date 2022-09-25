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
        sidebar: 'users',
        page: 'confirm',
        members: []
    }),


    getters: {
        hasSidebar: (state) => !!state.sidebar,
    },

    actions: {
        toogleTab(tab: 'users' | 'chat' | 'settings') {
            this.sidebar = tab === this.sidebar ? undefined : tab
        }
    }
})
