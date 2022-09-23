import { defineStore } from 'pinia'
import AgoraRTC, {
    IAgoraRTCClient,
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack, UID
} from "agora-rtc-sdk-ng";

interface IRoomStore {
    _client?: IAgoraRTCClient
    localTracks: {
        audio?: IMicrophoneAudioTrack
        video?: ICameraVideoTrack
    },
    mapRemoteUsers: Record<UID, IAgoraRTCRemoteUser>
}

export const useAgoraStore = defineStore({
    id: 'agora',

    state: (): IRoomStore => ({
        localTracks: {},
        mapRemoteUsers: {}
    }),

    getters: {
        isEnableAudio: (state) => !state.localTracks.audio?.muted,
        isEnableVideo: (state) => !state.localTracks.video?.muted,
        client: (state) => toRaw(state._client)
    },


    actions: {

        async init() {
            if(!this._client) {
                this._client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
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

        async join(chanel: string) {
            await this.client?.join(import.meta.env.VITE_AGORA_API_KEY, chanel, null, Math.round(Math.random() * 1000000))

            const tracks: any = Object.values(this.localTracks).filter((track) => track)

            await this.client?.publish(tracks)

        },


        addPublished() {
            this.client?.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
                console.log(`================================${user.uid} published ${mediaType}`)
                await this.client?.subscribe(user, mediaType)

                if(!this.mapRemoteUsers[user.uid]) {
                    this.mapRemoteUsers[user.uid] = user
                } else {
                    // toRaw(this.mapRemoteUsers[user.uid])
                    if(mediaType === "audio") {
                        this.mapRemoteUsers[user.uid].audioTrack = user.audioTrack
                        this.mapRemoteUsers[user.uid].hasAudio = user.hasAudio
                    } else if (mediaType === "video") {
                        this.mapRemoteUsers[user.uid].videoTrack = user.videoTrack
                        this.mapRemoteUsers[user.uid].hasVideo = user.hasVideo
                    }
                }

            })
        },

        registerEvent() {
            this.addPublished()
        }
    }
})
