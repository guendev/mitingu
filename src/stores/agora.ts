import { defineStore } from 'pinia'
import type {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack, UID
} from "agora-rtc-sdk-ng"
import {UserDocument} from "@entities/user";

interface IRoomStore {
    _client?: IAgoraRTCClient
    localTracks: {
        audio?: IMicrophoneAudioTrack
        video?: ICameraVideoTrack
    },
    // mapRemoteUsers: Record<UID, IAgoraRTCRemoteUser & {
    //     userData?: UserDocument
    // }>
    volumes: {
        id: number
        level: number
    }[]
    mapRemoteUsers: (IAgoraRTCRemoteUser & {
        userData?: UserDocument
    })[]
}

export const useAgoraStore = defineStore({
    id: 'agora',

    state: (): IRoomStore => ({
        localTracks: {},
        mapRemoteUsers: [],
        volumes: []
    }),

    getters: {
        isEnableAudio: (state) => !state.localTracks.audio?.muted,
        isEnableVideo: (state) => !state.localTracks.video?.muted,
        client: (state) => toRaw(state._client)
    },


    actions: {
        async reset() {
            this.mapRemoteUsers = []
            this.volumes = []
            this.localTracks.video?.stop()
            this.localTracks.audio?.stop()
            this.localTracks = {}
        },

        async init() {
            if(!this._client) {
                this._client = window.AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
            }
        },

        async toggleAudio() {
            await this.localTracks.audio?.setMuted(!this.localTracks.audio.muted)
        },

        async toggleVideo() {
            await this.localTracks.video?.setMuted(!this.localTracks.video.muted)
        },

        async join(chanel: string, uid: UID) {
            await this.client?.join(import.meta.env.VITE_AGORA_API_KEY, chanel, null, uid)
            const tracks: any = Object.values(this.localTracks).filter((track) => track).map((track) => toRaw(track))
            await this.client?.publish(tracks)
        },


        addPublished() {

            const upsertTrack = (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {

                const index = this.mapRemoteUsers.findIndex((e) => e.uid === Number(user.uid))

                if(index > -1) {

                    if(mediaType === "audio") {
                        this.mapRemoteUsers[index].audioTrack = user.audioTrack
                        this.mapRemoteUsers[index].hasAudio = user.hasAudio
                    } else if (mediaType === "video") {
                        this.mapRemoteUsers[index].videoTrack = user.videoTrack
                        this.mapRemoteUsers[index].hasVideo = user.hasVideo
                    }

                } else {
                    this.mapRemoteUsers.push({
                        uid: user.uid,
                        audioTrack: user.audioTrack,
                        hasAudio: user.hasAudio,
                        videoTrack: user.videoTrack,
                        hasVideo: user.hasVideo
                    })
                }
            }

            this.client?.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
                console.log(`================================${user.uid} published ${mediaType}`)
                await this.client?.subscribe(user, mediaType)

                upsertTrack(user, mediaType)

            })

            this.client?.on("user-unpublished", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
                console.log(`${user.uid} unpublished ${mediaType}`)
                upsertTrack(user, mediaType)
            })


            this.client?.enableAudioVolumeIndicator()
            this.client?.on("volume-indicator", (volumes: any) => {

                this.volumes = volumes.map((volume: any) => ({
                    id: Number(volume.uid),
                    level: volume.level
                }))

            })

            this.client?.on('user-left',(user: IAgoraRTCRemoteUser) => {
                this.mapRemoteUsers = this.mapRemoteUsers.filter((e) => e.uid !== Number(user.uid))
            })
        },

        registerEvent() {
            this.addPublished()
        },

        async leave() {
            await this.client?.leave()
        }
    }
})
