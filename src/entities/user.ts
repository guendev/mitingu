import { ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteAudioTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng'

interface User {
    id: number
    name?: string
    email?: string
    avatar?: string
    banner?: string

    audioTrack?: IMicrophoneAudioTrack | IRemoteAudioTrack
    videoTrack?: ICameraVideoTrack | IRemoteVideoTrack

    type?: 'owner' | 'coach' | 'student'
}

export type UserDocument = User
