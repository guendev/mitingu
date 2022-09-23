import { defineStore } from 'pinia'

interface IRoomStore {
    page: 'confirm' | 'room' | 'kicked'
    sidebar?: 'users' | 'chat' | 'settings'
}

export const useRoomStore = defineStore({
    id: 'room',

    state: (): IRoomStore => ({
        sidebar: 'users',
        page: 'confirm'
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
