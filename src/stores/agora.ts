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

        async init() {
            if(!this._client) {
                this._client = window.AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
            }
        },

        async toggleAudio() {
            if (this.localTracks.audio) {
                await this.localTracks.audio.setMuted(!this.localTracks.audio.muted)
            }
        },

        async toggleVideo() {
            if (this.localTracks.video) {
                await this.localTracks.video.setMuted(!this.localTracks.video.muted)
            }
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

                    const remoteUser = Object.assign({}, this.mapRemoteUsers[index])

                    if(mediaType === "audio") {
                        remoteUser.audioTrack = user.audioTrack
                        remoteUser.hasAudio = user.hasAudio
                    } else if (mediaType === "video") {
                        remoteUser.videoTrack = user.videoTrack
                        remoteUser.hasVideo = user.hasVideo
                    }

                    this.mapRemoteUsers[index] = remoteUser
                } else {
                    this.mapRemoteUsers.push(user)
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
